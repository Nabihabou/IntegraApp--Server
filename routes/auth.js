var request = require('request');
var mongoose = require('mongoose');
var config = require('../config');
var models = require('../models');
var helpers = require('../helpers');
var jwt = require('jsonwebtoken');


module.exports = function(req, res) {
  if(req.query.idToken || req.query.access_token || req.query.code) {
    console.log('Sending to the authApp');
    request.get('http://localhost:3000/auth?idToken=' + req.query.idToken, function(err,response){
      if(response.statusCode == 200){
        var authResponse = JSON.parse(response.body);
        res.status(200).json({user: authResponse.user, token: authResponse.token});
      } else {
        console.log('Invalid user');
        res.status(401).json({error : 'invalid user!'});
      }
    });
  } else {
    console.log("No token sent!");
    res.json({message: "No token sent!", status: 404});
  }
}
