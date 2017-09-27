var mongoose = require('mongoose')

var Schema = mongoose.Schema

if (!mongoose.connection.readyState == 0) {
  mongoose.connect('mongodb://localhost/integra')
}

var memoSchema = new Schema({
  author: {type: String, required: true},
  to: {type: String, required: true},
  description: {type: String, required: true},
  assunt: {type: String, required: true},
  methods: {type: String, required: true},
  reasons: {type: String, required: true},
  valid: {type: Boolean, default: false},
  url: {type: String, required: false},
  number: {type: Number, required: true},
});

module.exports = mongoose.model('Memo', memoSchema)
