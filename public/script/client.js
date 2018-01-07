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
    if(stocks.length>9){
      alert("you can view up to 10 stock");
      return;
    }
    else{
      var stockName=makeid();
      stocks.push(stockName);
      console.log(stocks);
      $(".stockZone").append($("<div>").attr("id",stockName).text(stockName).addClass("stockBox"));
    } 
  });


});