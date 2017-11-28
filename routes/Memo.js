var mongoose = require('mongoose');
var models = require('../models');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var randomstring = require("randomstring");
var config = require('../config');
var helpers = require('../helpers');


var Memo = mongoose.model('Memo');
var Profile = mongoose.model('Profile');
var Project = mongoose.model('Project');

module.exports = {
    get: function(req, res) {
        if(!req.query.id){
            Memo.find({},helpers.client.findAll(req, res,"Memo"));
        }else {
            Memo.findOne({_id: mongoose.Types.ObjectId(req.query.id)}, helpers.client.findOne(req, res, "Memo"));
        }
    },
    post: function(req, res) {
        var profileId = jwt.decode(req.token, config.secret)._id;
        var number = null;
        Memo.count({}, function(err, count){
            if(!err) {
                number = count + 1; /// the number of memorando
            } else {
                number = 1;
            }
        });
        Profile.findOne({_id: profileId}, function(error, obj){
            console.log(req.body);
            if(obj) {
                /// random string to update url hash
                var entropy = randomstring.generate(parseInt(Math.random()) * 100);
                var entropy_time = (new Date()).valueOf().toString();
                var new_memo = new Memo({
                    author: obj.google_name,
                    to: req.body.to,
                    description: req.body.description,
                    title: req.body.title,
                    methods: req.body.methods,
                    reasons: req.body.reasons,
                    valid: 0,
                    number: number,
                    url:  crypto.createHash('sha1').update(entropy + entropy_time).digest('hex')
                });

                new_memo.save(function(err, obj){
                    if(err) {
                        console.log("Error in save in database "  + err);
                        res.status(500).send("Something went wrong :/ " + err);
                        res.end();
                    }
                    else {
                        console.log("A memorando was created: ");
                        //// Helper to send email, (auth, data, sender_to)

                        console.log(obj._id);
                        helpers.server.sendmail({
                            user: 'tecnologia@niejcesupa.org',
                            pass: 'tecnologianiej'
                        },obj,'tecnologia@niejesupa.org');
                        res.json(obj);
                    }
                });
            }
        });
},
confirmation: function(req, res){
    var urlValid = req.query.memo;
    var state = req.query.state;
    Memo.findOne({url: urlValid}, function(err, profile){
        if(profile) {
            Memo.update({url: urlValid},{url: '', valid: state}, function(err, profile){
                if(err){
                    console.log("Error in " + err );
                    res.json(err);
                }
                res.json("Memorando confirmado");
            });
        }else {
            res.json("URL INVALIDA!");
        }
    });
   }
}
