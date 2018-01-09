var stocks = [];
var stockVal = [];
var socket;
var apikey;

function getapikey() {
    $.ajax({
        url: "/apikey",
        type: "get",
        success: function(data) {
            apikey = data;
        }
    });

}

function getfinanceinfo(){
  $.ajax({
    url:"/getstock",
    type:"get",
    success: function(data){
      $.each(data,function(index,item){
        console.log(item);
        stocks.push(item);
         $.ajax({
            url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_MONTHLY_ADJUSTED" + "&symbol=" + item+ "&apikey=" + apikey,
            type: "get",
            success: function(data) {
                  stockVal.push(data);
              $(".stockZone").append($("<div>").attr("id", item).text(item).addClass("stockBox").append($("<span class='closeBtn'>x</span>")));  
                }
        });
      });
    }
  });

}

$(function() {
  if (!apikey)
        getapikey();
  if(stocks.length===0)
    getfinanceinfo();

    socket = io();
    socket.on('stockArray', function(data) {
        $(".stockZone").remove();
        var x = $("<div>").addClass("stockZone");
        $.each(data, function(index, item) {
            x.append($("<div>").attr("id", item).text(item).addClass("stockBox").append($("<span class='closeBtn'>x</span>")));
        });
        $(".container").append(x);
    });

    $("#getStock").on("click", function() {
        $.ajax({
            url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_MONTHLY_ADJUSTED" + "&symbol=" + $("#stockVal").val() + "&apikey=" + apikey,
            type: "get",
            success: function(data) {
                if (data["Error Message"]) {
                    alert("Invalid Stock Code");
                } else {
                  stockVal.push(data);
                    console.log(stockVal);
                    if (stocks.length > 9) {
                        alert("you can view up to 10 stock");
                        return;
                    } else {
                        var stockName = $("#stockVal").val();
                        stocks.push(stockName);
                        socket.emit("stockArray", stocks);
                        $(".stockZone").append($("<div>").attr("id", stockName).text(stockName).addClass("stockBox").append($("<span class='closeBtn'>x</span>")));
                    }
                }
            }
        });
    });

    $(document).on('click', ".closeBtn", function() {
        stocks = [];
        $(this).parent().remove();
        $(".stockBox").each(function(index, item) {
            stocks.push($(this).attr("id"));
        });
        socket.emit("stockArray", stocks);
    });
});