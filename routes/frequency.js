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
    Frequency.find({project: req.query.projectId}, helpers.client.findAll(req, res, "Frequency"));
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
  }
}