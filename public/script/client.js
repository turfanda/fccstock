var stocks = [];
var socket;
var apikey;

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getapikey() {
    $.ajax({
        url: "/apikey",
        type: "get",
        success: function(data) {
            console.log(data);
            apikey = data;
        }
    });

}

$(function() {
    if (!apikey)
        getapikey();

    socket = io();
    socket.on('stockArray', function(data) {

    });

    $("#getStock").on("click", function() {
        $.ajax({
            url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_MONTHLY_ADJUSTED" + "&symbol=" + $("#stockVal").val() + "&apikey=" + apikey,
            type: "get",
            success: function(data) {
                if (data["Error Message"]) {
                    alert("Invalid Stock Code");
                } else {
                    console.log(data);
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