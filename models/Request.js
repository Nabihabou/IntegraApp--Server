// var mongoose = require('mongoose')
// var User = require('./User')
// var Project = require('./Project')
//
// var Schema = mongoose.Schema
// mongoose.connect('mongodb://localhost/integra')
//
// var requisitionSchema = new Schema({
//   author: {type: Schema.Types.ObjectID, ref: 'User', required: true},
//   project: {type: Schema.Types.ObjectID, ref: 'Project', required: true},
//   kind: {type: String, enum: ["Impressão", "Material", "Outro"], required: true},
//   subject: {type: String, required: true},
//   description: String,
//   file: String,
//   copies: Number,
//   dueDate: {type: Date, required: true},
// })
//
// module.exports = mongoose.model('Requisition', requisitionSchema)