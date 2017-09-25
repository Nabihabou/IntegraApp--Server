var mongoose = require('mongoose');
var models = require('../models');
var jwt = require('jsonwebtoken');
var config = require('../config');
var helpers = require('../helpers');


var Memo = mongoose.model('Memo');
var Profile = mongoose.model('Profile');
var Project = mongoose.model('Project');

module.exports = {
    get: function(req, res) {
        Memo.find({},helpers.client.findAll(req, res,"Memo"));
    },
    post: function(req, res) {
        var profileId = jwt.decode(req.token, config.secret)._id;
        Profile.findOne({_id: profileId}, function(error, obj){
            console.log(req.body);
            if(obj) {
                var new_memo = new Memo({
                    author: obj._id,
                    to: req.body.to,
                    description: req.body.description,
                    assunt: req.body.assunt,
                    methods: req.body.methods,
                    reasons: req.body.reasons
                });
            
                new_memo.save(function(err, obj){
                    if(err) {
                        console.log("Error in save in database "  + err);
                        res.status(500).send("Something went wrong :/ " + err);
                        res.end();
                    }
                    else {
                        console.log("A memorando was created: ");
                        console.log(JSON.stringify(obj));
                        res.json(obj);
                    }
                });
            }
        });
    }
}
