var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var stockNameSchema = new Schema({
	traceparam:{type: String},
  stockNames: [{"stockName":{type: Strin,
      'default': []
    }}]
});

var stockName = mongoose.model("pollData",stockNameSchema);

module.exports = stockName;


module.exports.saveStock = function(stock,callback){
  stock.save(callback)
}

module.exports.removeStock = function(callback){
   var query = {traceparam: "allStock"};
	 stockName.remove(query, callback);
}