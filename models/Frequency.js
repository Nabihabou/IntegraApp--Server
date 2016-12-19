var mongoose = require('mongoose');

var Schema = mongoose.Schema

if (!mongoose.connection.readyState == 0) {
  mongoose.connect('mongodb://localhost/integra')
}

var frequencySchema = new Schema({
  author: {type: Schema.Types.ObjectId, required: true},
  project: {type: Schema.Types.ObjectId, required: true},
  title: {type: String, require: true},
  description: {type: String, default: ""},
  category: {type: String, enum: ["Reunião", "Módulo", "Atividade"], required: true},
  duration: {type: Number, required: true},
  date: {type: Date, required: true},
  presents: {type: [{member: Schema.Types.ObjectId, hours: Number}], default: []}
})

module.exports = mongoose.model('Frequency', frequencySchema)
