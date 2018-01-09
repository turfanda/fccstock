var stocks = [];
var socket;

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


$(function() {
    socket = io();
    socket.on(function(data) {
        console.log(data);
    });
    socket.on('stockArray', function(data) {
        $(".stockZone").remove();
        stocks = data;
        var x = $("<div>").addClass("stockZone");
        $.each(data, function(index, item) {
            x.append($("<div>").attr("id", item).text(item).addClass("stockBox").append($("<span class='closeBtn'>x</span>")));
        });
        $(".container").append(x);

    });
    $(".addBtn").on("click", function() {
        if (stocks.length > 9) {
            alert("you can view up to 10 stock");
            return;
        } else {
            var stockName = makeid();
            stocks.push(stockName);
            socket.emit("stockArray", stocks);
            console.log(stocks);
            $(".stockZone").append($("<div>").attr("id", stockName).text(stockName).addClass("stockBox").append($("<span class='closeBtn'>x</span>")));
        }
    });
    $(document).on('click', ".closeBtn", function() {
      stocks=[];

        $(this).parent().remove();
        console.log(stocks);
        socket.emit("stockArray", stocks);
    });
    $(".stockBtn").on("click", function() {
        $.ajax({
            url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_MONTHLY_ADJUSTED" + "&symbol=" + "MSFxxT" + "&apikey=" + "HEUIOKJSMVGQQKFR",
            type: "get",
            success: function(data) {
                if (data["Error Message"]) {
                    alert("Invalid Stock Code");
                }
                console.log(data);
            }
        });
    });


});