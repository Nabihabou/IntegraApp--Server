var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var jwt = require('jsonwebtoken');
var helpers = require('../helpers')

var Frequency = mongoose.model('Frequency');
var Profile = mongoose.model('Profile');
var Project = mongoose.model('Project');

var has_level = function(memberArray, id) {
  for(var i = 0;i < memberArray.length;i++) {
    if(memberArray[i]._id == id && memberArray[i].level >= 1) {
      return true;
    }
  }
  return false;
}

module.exports = {
  get: function(req, res) {
    if(req.query.id) {
      Frequency.findOne({_id:mongoose.Types.ObjectId(req.query.id)}, helpers.client.findOne(req, res, "Frequency"));
    }
    else if(req.query.projectId){
      Frequency.find({project: mongoose.Types.ObjectId(req.query.projectId)}, helpers.client.findAll(req, res, "Frequency"));
    }
  },
  many: function(req, res) {
    if(req.body.ids) {
      Frequency.find({_id: {$in: req.body.ids}}, helpers.client.findAll(req, res, "Frequency"));
    }
  },
  post: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, object) {
      if(object && (object.is_admin || has_level(object.members, profileId))) {
        var new_freq = new Frequency({
          author: profileId,
          project: mongoose.Types.ObjectId(req.body.projectId),
          title: req.body.title,
          category: req.body.category,
          duration: req.body.duration,
          date: req.body.date
        });

        new_freq.save(function(err, obj) {
          if(obj) {
            Project.update({_id: mongoose.Types.ObjectId(req.body.projectId)}, {$push: {frequencies: obj._id}}, function(error, object) {
              if (object) {
                console.log("A frequency was created: ");
                console.log(JSON.stringify(obj));
                res.json(object);
              }
            });

          } else {
            console.log("Something went wrong: " + err);
            res.status(500).send("Something went wrong: " + err);
            res.end();
          }
        });
      }
    });
  },
  put: function(req, res) {
    var profileId = jwt.decode(req.token, config.secret)._id;
    Profile.findOne({_id: profileId}, function(error, object) {
      if(object && (object.is_admin || has_level(object.members, profileId))) {
        Frequency.findOne({_id: req.body.frequencyId}, function(error, freq) {
          if(freq) {
            var is_present = false;
            for(var i = 0;i < freq.presents.length;i++) {
              if (freq.presents[i].member == req.body.memberId && 0 <= req.body.hours <= freq.duration) {
                freq.presents[i].hours = req.body.hours;
                is_present = true;
              }
            }
            if (!is_present) {
              freq.presents.push({member: req.body.memberId, hours: req.body.hours});
            }
            freq.save(function(err) {
              if (err) {
                console.log(err);
              }
            })
            res.json({msg: "Success!"});
          }
        })
      }
    });
  }

}
