var stocks=[];
var socket;

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


$(function(){
  //socket = io();
  socket = io();
  socket.on('stockArray',function(data){
    $(".stockZone").remove();
    stocks=data;
    var x =$("<div>").addClass("stockZone");
    $.each(data,function(index,item){
    x.append($("<div>").attr("id",item).text(item).addClass("stockBox").append($("<span id='close'>x</span>")));   
    });
    $(".container").append(x);
    
  });
  $(".addBtn").on("click",function(){
    if(stocks.length>9){
      alert("you can view up to 10 stock");
      return;
    }
    else{
      var stockName=makeid();
      stocks.push(stockName);
      socket.emit("stockArray",stocks);
      console.log(stocks);
      $(".stockZone").append($("<div>").attr("id",stockName).text(stockName).addClass("stockBox").append($("<span id='close'>x</span>")));
    } 
  });
  $(".stockBtn").on("click",function(){
    $.ajax({
      url: "https://www.alphavantage.co/query?function="+""+,
      type:"get",
      success: function(html){
    $("#results").append(html);
  }
});
  });


});