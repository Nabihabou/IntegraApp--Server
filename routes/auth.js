var request = require('request');
var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var helpers = require('../helpers');
var jwt = require('jsonwebtoken');

var Profile = mongoose.model('Profile');
module.exports = function(req, res) {
  if(req.query.idToken) {
    console.log(req.query.idToken);
    request.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.query.idToken, function(response, body) {
      if(body) {
        console.log(body.body);
        var googleRequestResponse = JSON.parse(body.body);
        if (googleRequestResponse.sub) {
          Profile.findOne({google_id: googleRequestResponse.sub}, function(err, obj) {
            if(err) {
              console.log(err);
              res.json({error: err, message: "Error Finding user by google_id"});
            } else if(obj) {
              console.log("User logged in.");
              var token = jwt.sign({_id: obj._id}, config.secret, {expiresIn: "48h"});
              console.log("An user Logged-in: " + token);
              res.json({token: token, google_id: obj.google_id});
            }
            else {
              Profile.findOne({google_email: googleRequestResponse.email}, function(err, obj) {
                if (err) {
                  console.log(err);
                  res.json({error: err, message: "Error finding user by email"});
                } else if(obj) {
                  console.log("Pre-registered user logged in!");
                  var token = jwt.sign({_id: obj._id}, config.secret, {expiresIn: "48h"});
                  obj.google_id = googleRequestResponse.sub;
                  obj.save(function(err, updatedObj) {
                    if(err) {
                      console.log(err);
                      res.json({error: err, message: "Error adding google_id to user"});
                    } else if(updatedObj) {
                      console.log("User registration completed and logged in!");
                      res.json({user: updatedObj, token: token});
                    }
                  })
                }
                else {
                  res.json({message: "Account not created!", status: 403});
                }
              })
            }
          });
        }
      }
    });
  } else {
    console.log("No token sent!");
    res.json({message: "No token sent!", status: 404});
  }
}
