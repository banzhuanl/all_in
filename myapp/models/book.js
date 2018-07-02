var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bookSchema = new Schema({
  id: Number,
  title: String,
  des: String,
  imgSrc: {type: String, default: 'default.jpg'},
  auth: String,
  status: String,
  type: String,
  for: String,
  hot: Number,
  price: String
})
bookSchema.index({id:1, hot:-1, price:1, type:1, status:1,for:1});

var book = mongoose.model('book',bookSchema);

module.exports = book;