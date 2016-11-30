var request = require('request');
var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var jwt = require('jsonwebtoken');

var Profile = mongoose.model('Profile');
module.exports = function(req, res) {
  request.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.body.idToken, function(response, body) {
    var googleRequestResponse = JSON.parse(body.body);
    console.log(googleRequestResponse);

    Profile.findOne({google_id: req.body.id}, function(err, profile) {
      if(err) {
        console.log(err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      } else if(profile){
        var token = jwt.sign({_id: profile._id}, config.secret, {expiresIn: "24h"});
        console.log(token);
        console.log("An user logged in: " + profile._id);
        res.json({
          google_id: profile._id,
          token: token
        });
      } else if(req.body.id){
        var googleParams = {
          google_id: req.body.id,
          google_email: googleRequestResponse.email,
          google_name: googleRequestResponse.given_name + " " + googleRequestResponse.family_name,
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
            var token = jwt.sign({_id: obj._id}, config.secret, {expiresIn: "24h"});
            googleParams.status = "success";
            googleParams.token = token;
            console.log("An user was created: ");
            console.log(JSON.stringify(googleParams));
            res.json(googleParams);
          }
        });
      } else {
        console.log("Invalid google token");
        res.status(400).send("Invalid Google Token");
        res.end();
      }
    });
  });
}
