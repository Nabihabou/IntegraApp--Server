var request = require('request');
var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var jwt = require('jsonwebtoken');
var helpers = require('../helpers');

var Profile = mongoose.model('Profile');
module.exports = {
  get: function(req, res) {
    if (!req.query.id && !req.query.email && !req.query.name && !req.query.google_id) {
      Profile.find({}, helpers.client.findAll(req, res, "Profile"));
    } else if(req.query.id){
      Profile.findOne({_id: req.query.id}, helpers.client.findOne(req, res, "Profile"));
    } else if(req.query.email) {
      var findEmai = RegExp()
      Profile.find({google_email: {$regex: /req.query.email/, $options: 'i'}}, helpers.client.findAll(req, res, "Profile"));
    } else if(req.query.name) {
      Profile.findOne({google_name: req.query.name}, helpers.client.findOne(req, res, "Profile"));
    } else if(req.query.google_id) {
      Profile.findOne({google_id: req.query.google_id}, helpers.client.findOne(req, res, "Profile"));
    }
  },
  post: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, object) {
      if(object && object.is_admin) {
        // User is authorized to create accounts
        if (req.body.google_email) {
          var newUser = new Profile(req.body);
          newUser.save(function(err, obj) {
            if(err) {
              console.log(err);
              res.status(500).send("Something went wrong saving the new user!");
              res.end();
            }
            else {
              console.log("An user was created: ");
              console.log(JSON.stringify(obj));
              res.json(obj);
            }
          });
        } else if(req.body.emails) {
          var errors = 0;
          for(email in req.body.emails) {
            var newUser = new Profile({google_email: email});
            newUser.save(function(err, obj) {
              if(err) {
                console.log(err);
                errors++;
              }
              else if(obj){
                console.log("An user was created: ");
                console.log(JSON.stringify(obj));
              }
            });

          }
          res.json({success: req.body.emails.len - errors, errors: errors});
        }
      }
      else {
        res.json({message: "User is not admin!"});
      }
    });
  },
  count: function(req, res) {
    Profile.count({}, helpers.client.count(req, res, "Profile"));
  }
}
