var mongoose = require('mongoose')

var Schema = mongoose.Schema

if (!mongoose.connection.readyState == 0) {
  mongoose.connect('mongodb://localhost/integra')
}

var requestSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  project: {type: Schema.Types.ObjectId, ref: 'Project', required: true},
  category: {type: String, enum: ["Impressão", "Material", "Outro"], required: true},
  subject: {type: String, required: true},
  description: String,
  file: String,
  copies: Number,
  dueDate: {type: Date, required: true},
})

module.exports = mongoose.model('Request', requestSchema)
