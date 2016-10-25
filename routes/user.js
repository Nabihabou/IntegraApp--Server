var request = require('request');
var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var jwt = require('jsonwebtoken');

var Profile = mongoose.model('Profile');
module.exports = {
  get: function(req, res) {
    Profile.findOne(req.userId, function(err, profile) {
      if(err) {
        res.status(500).send("Something went wrong: " + err);
        res.end();
      }
      else {
        if (profile) {
          console.log("Sent user data: " + JSON.stringify(profile));
          res.json(profile);
        }
        else {
          console.log("User not found, invalid token?");
          console.log(req.userId);
          res.status(404).send("User not found!");
          res.end();
        }
      }
    });
  },
  post: function(req, res) {
    if (req.body.access_token) {
      request.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + req.body.access_token, function(response, body) {
        var googleRequestResponse = JSON.parse(body.body);
        Profile.count({google_id: googleRequestResponse.id}, function(err, count) {
          if(err) {
            console.log("An error: " + err);
            res.status(500).send("Something went wrong: " + err);
            res.end();
          }
          else if(count > 0){
            console.log("Someone tried to create identical id Profiles!");
            res.status(500).send("User already exist!");
            res.end();
          }
          else {
            var googleParams = {
              google_id: googleRequestResponse.id,
              google_email: googleRequestResponse.email,
              google_name: googleRequestResponse.name,
              google_picture: googleRequestResponse.picture
            }
            console.log(googleParams);

            var new_user = new Profile(googleParams);

            new_user.save(function(err, obj) {
              if(err) {
                console.log(err);
                res.status(500).send("Something went wrong saving the new user!");
                res.end();
              }
              else {
                var token = jwt.sign({_id: obj._id}, config.secret, {expiresIn: "1h"});
                googleParams.status = "success";
                googleParams.token = token;
                console.log("An user was created: ");
                console.log(JSON.stringify(googleParams));
                res.json(googleParams);
              }
            });
          }
        });
      });
    }
  }
}