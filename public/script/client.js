var stocks=[];

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

$(function(){
  $(".addBtn").on("click",function(){
    var stockName=makeid();
    stocks.push(stockName);
    console.log(stocks);
  
    $("<div>").attr("id",stockName).  
  
  });


});