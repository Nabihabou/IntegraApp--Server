var request = require('request');
var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var jwt = require('jsonwebtoken');
var helpers = require('../helpers');

var Profile = mongoose.model('Profile');
var Frequency = mongoose.model('Frequency');

module.exports = {
  get: function(req, res) {
    if (!req.query.id && !req.query.google_email && !req.query.name && !req.query.google_id) {
      Profile.find({}, helpers.client.findAll(req, res, "Profile"));
    } else if(req.query.id){
      Profile.findOne({_id: mongoose.Types.ObjectId(req.query.id)}, helpers.client.findOne(req, res, "Profile"));
    } else if(req.query.google_email) {
      Profile.findOne({google_email: req.query.google_email}, helpers.client.findAll(req, res, "Profile"));
    } else if(req.query.name) {
      Profile.findOne({google_name: req.query.name}, helpers.client.findOne(req, res, "Profile"));
    } else if(req.query.google_id) {
      Profile.findOne({google_id: req.query.google_id}, helpers.client.findOne(req, res, "Profile"));
    }
  },
  edit: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;

    Profile.update({_id: profileId}, {$set: {course: req.body.course, shirt_size: req.body.shirt_size,
                                             begin_course: req.body.begin_course, end_course: req.body.end_course,
                                             gender: req.body.gender, telephone: req.body.telephone,
                                             cellphone: req.body.cellphone, cpf: req.body.cpf,
                                             rg: req.body.rg, cep: req.body.cep, address: req.body.address,
                                             city: req.body.city, birthday: req.body.birthday}}, function(err, profile) {
      if (err) {
        console.log("Something went wrong: " + err);
        res.status(500).send("Something went wrong: " + err);
        res.end();
      }
      else {
        console.log("Profile edited.");
        res.json(profile);
        console.log(profile);
      }
    });
  },
  getMany: function(req, res) {
    if(req.body.ids) {
      Profile.find({_id: {$in: req.body.ids}}, helpers.client.findAll(req, res, "Profile"));
    }
  },
  getAll: function(req, res) {
    Profile.find({}, helpers.client.findAll(req, res, "Profile"));
  },
  myProfile: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, obj) {
      if (obj) {
        res.json(obj);
      } else if(error) {
        console.log(error);
        res.send(error);
        res.end();
      }
    });
  },
  post: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, object) {
      if(object && object.is_admin) {
        if (req.body.google_email) {
          Profile.findOne({google_email: req.body.google_email}, function(error, obj) {
            if(!obj) {
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
            } else {
            res.json(obj);
            }
          })
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
  },
  hours: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, obj) {
      if (obj) {
        Frequency.find({_id: {$in: obj.frequencies}}, function(err, frequencies) {
          var hours = 0;
          for(var j = 0;j < frequencies.length;j++) {
            for(var k = 0;k < frequencies[j].presents.length;k++) {
              if (obj._id.equals(frequencies[j].presents[k].member)) {
                hours += frequencies[j].presents[k].hours;
              }
            }
            res.json({hours: hours});
          }
        });

      } else if(error) {
        console.log(error);
        res.send(error);
        res.end();
      }
    });
  }
}
