var mongoose = require('mongoose')

var Schema = mongoose.Schema

if (!mongoose.connection.readyState == 0) {
  mongoose.connect('mongodb://localhost/integra')
}

var memoSchema = new Schema({
  author: {type: Schema.Types.ObjectId, required: true},
  to: {type: String, required: true},
  description: {type: String, required: true},
  assunt: {type: String, required: true},
  methods: {type: String, required: true},
  reasons: {type: String, required: true},
  valid: {Type: Boolean, default: false}
});

module.exports = mongoose.model('Memo', memoSchema)
