var mongoose = require('mongoose');
var models = require('../models');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
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
                    reasons: req.body.reasons,
                    valid: false,
                    url:  crypto.createHash('md5').digest('hex')
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
                        },obj,'<email_rementente_aqui>');
                        res.json(obj);
                    }
                });
            }
        });
},
confirmation: function(req, res){
    var urlValid = req.query.memo;
    Memo.findOne({url: urlValid}, function(err, profile){
        if(profile) {
            Memo.update({url: urlValid},{url: '', valid: true}, function(err, profile){
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
