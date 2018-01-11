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

function drawStock(item) {
    var x = $("<div>").attr("id", item).text(item).addClass("stockBox").append($("<span class='closeBtn'>x</span>"));
    return x
}

function controlStockVal(stockVal, item, control) {
    if (control === "add_with_obj") {
        stockVal.push(item);
        return stockVal;
    } else if (control === "remove_with_name") {
        stockVal = $.grep(stockVal, function(value) {
            return value["Meta Data"]["2. Symbol"] !== item;
        });
        return stockVal;
    } else if (control === "remove_name") {
            stockVal = $.grep(stockVal, function(value) {
            return value !== item;
        });
       return stockVal;
    } else
        return stockVal;
}

function getfinanceinfo() {
    $.ajax({
        url: "/getstock",
        type: "get",
        success: function(data) {
            $.each(data, function(index, item) {
                stocks.push(item.stockName);
                $.ajax({
                    url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_DAILY" + "&symbol=" + item.stockName + "&apikey=" + apikey,
                    type: "get",
                    success: function(data) {
                        stockVal = controlStockVal(stockVal, data, "add_with_obj");
                        chartyap(stockVal);
                        $(".stockZone").append(drawStock(item.stockName));
                    }
                });
            });
        }
    });

}



  var seriesOptions = [];


function createChart() {
    Highcharts.stockChart('chartZone', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function() {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent'
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });

}


function chartyap(asd) {
  console.log(asd);
seriesOptions = [];
    var seriesCounter = 0;
    $.each(asd, function(i, item) {
        var frd = [];
        var stckname = item["Meta Data"]["2. Symbol"];
        $.each(item["Time Series (Daily)"], function(i, item) {
            frd.push([Date.parse(i), parseFloat(item["4. close"])])
        });
        frd.reverse();
        seriesOptions[i] = {
            name: stckname,
            data: frd
        };
        seriesCounter += 1;
        if (seriesCounter === asd.length) {
            createChart();
        }
    });
}


$(function() {
    if (!apikey)
        getapikey();
    if (stocks.length === 0)
        getfinanceinfo();

    socket = io();
    socket.on('addStock', function(dataName) {
        stocks = controlStockVal(stocks, dataName, "add_with_obj")
                $.ajax({
                url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_DAILY" + "&symbol=" + dataName + "&apikey=" + apikey,
                type: "get",
                success: function(data) {
                    stockVal=controlStockVal(stockVal, data, "add_with_obj");
                    $(".stockZone").append(drawStock(dataName));
                    chartyap(stockVal);
                }
            });

    });
    socket.on('removeStock', function(dataName) {
        stockVal=controlStockVal(stockVal, dataName, "remove_with_name");
        stocks=controlStockVal(stocks, dataName, "remove_name");
        $("#"+dataName).remove();
        chartyap(stockVal);

    });

    $("#getStock").on("click", function() {
        $.ajax({
            url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_DAILY" + "&symbol=" + $("#stockVal").val() + "&apikey=" + apikey,
            type: "get",
            success: function(data) {
                if (data["Error Message"]) {
                   $("#insertNote").text("Invalid Stock Code").css("color","red");
                }else if(){
                         } 
              else {
                    stockVal.push(data);
                    if (stocks.length > 9) {
                          $("#insertNote").text("Max 10 Stock").css("color","red");
                        return;
                    } else {
                        var stockName = $("#stockVal").val().toUpperCase();
                        stocks.push(stockName);
                        socket.emit("addStock", stockName);
                        $("#insertNote").text("Insert NASDAQ Code").css("color","black");
                        $(".stockZone").append(drawStock(stockName));
                        chartyap(stockVal);
                    }
                }
            }
        });
    });

    $(document).on('click', ".closeBtn", function() {
        var id = $(this).parent().attr("id");
        stockVal = controlStockVal(stockVal, id, "remove_with_name");
      chartyap(stockVal);
        stocks = $.grep(stocks, function(value) {
            return value !== id;
        });
        socket.emit("removeStock", id);
        $(this).parent().remove();

    });
});