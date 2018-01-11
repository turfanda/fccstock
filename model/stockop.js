var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var stockNameSchema = new Schema({
  stockNames: {type:Array}
});

var stockName = mongoose.model("stockName",stockNameSchema);

module.exports = stockName;


module.exports.saveStock = function(stock,callback){
  stock.save(callback)
}

module.exports.removeStock = function(callback){
	 stockName.remove(query, callback);
}

module.exports.getStock = function(callback){
   var query = {traceparam: "allStock"};
	 stockName.find(query,callback);
}