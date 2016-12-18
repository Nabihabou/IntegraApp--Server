var request = require('request');
var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var helpers = require('../helpers');
var jwt = require('jsonwebtoken');

var Profile = mongoose.model('Profile');
module.exports = function(req, res) {
  if(req.query.idToken || req.query.access_token) {
    console.log(req.query.idToken);
    var link = ""
    if (req.query.access_token) {
      link = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + req.query.access_token
    } else {
      link = "https://www.googleapis.com/oauth2/v3/userinfo?id_token=" + req.query.idToken
    }
    request.get(link, function(response, body) {
      if(body) {
        console.log(body.body);
        var googleRequestResponse = JSON.parse(body.body);
        if (googleRequestResponse.sub) {
          Profile.findOne({google_id: googleRequestResponse.sub}, function(err, obj) {
            console.log(googleRequestResponse);
            if(err) {
              console.log(err);
              res.json({error: err, message: "Error Finding user by google_id"});
            } else if(obj) {
              console.log("User logged in.");
              var token = jwt.sign({_id: obj._id}, config.secret, {expiresIn: "48h"});
              console.log("An user Logged-in: " + token);
              res.json({token: token, google_id: obj.google_id, is_admin: obj.is_admin});
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
                  obj.google_name = googleRequestResponse.name;
                  obj.google_picture = googleRequestResponse.picture;
                  obj.save(function(err, updatedObj) {
                    if(err) {
                      console.log(err);
                      res.json({error: err, message: "Error adding google_id to user"});
                    } else if(updatedObj) {
                      console.log("User registration completed and logged in!");
                      res.json({user: updatedObj, token: token, is_admin: updatedObj.is_admin});
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
