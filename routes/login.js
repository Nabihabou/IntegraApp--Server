var request = require('request');
var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var jwt = require('jsonwebtoken');

var Profile = mongoose.model('Profile');
module.exports = function(req, res) {
  request.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + req.body.access_token, function(response, body) {
    var googleRequestResponse = JSON.parse(body.body);
    Profile.findOne({google_id: googleRequestResponse.id}, function(err, profile) {
      if(err) {
        console.log(err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      } else if(profile){
        var token = jwt.sign({_id: profile._id}, config.secret, {expiresIn: "24h"});
        console.log(token);
        console.log("An user logged in: " + profile._id);
        res.json({
          id: profile._id,
          token: token
        });
      } else {
        console.log("User not found: " + googleRequestResponse.id);
        res.status(404).send("User not found: " + googleRequestResponse.id);
        res.end();
      }
    });
  });
}