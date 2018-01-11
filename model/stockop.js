var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var stockNameSchema = new Schema({
  stockName:String
});

var stockName = mongoose.model("stockName",stockNameSchema);

module.exports = stockName;


module.exports.saveStock = function(name,callback){
  name.save(callback)
}

module.exports.removeStock = function(name,callback){
	 stockName.remove({stockName:name},callback);
}

module.exports.getStock = function(callback){
	 stockName.find(callback);
}