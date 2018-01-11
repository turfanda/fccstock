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
    if (control === "addobj") {
        stockVal.push(item);
        return stockVal;
    } else if (control === "remove") {
        stockVal = $.grep(stockVal, function(value) {
            return value["Meta Data"]["2. Symbol"] !== item;
        });
        return stockVal;
    } else if (control === "addname") {} else
        return stockVal;
}

function getfinanceinfo() {
    $.ajax({
        url: "/getstock",
        type: "get",
        success: function(data) {
            $.each(data, function(index, item) {
                stocks.push(item);
                $.ajax({
                    url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_DAILY" + "&symbol=" + item + "&apikey=" + apikey,
                    type: "get",
                    success: function(data) {
                        stockVal = controlStockVal(stockVal, data, "addobj");
                        chartyap(stockVal);
                        $(".stockZone").append(drawStock(item));
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
                compare: 'percent',
                showInNavigator: true
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
    socket.on('addStock', function(data) {
        stocks.push(data);
        $.each(stocks, function(index, item) {
            stocks.push(item);
            $(".stockBox").remove();
            $.ajax({
                url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_DAILY" + "&symbol=" + item + "&apikey=" + apikey,
                type: "get",
                success: function(data) {
                    stockVal.push(data);
                    $(".stockZone").append(drawStock(item));
                    chartyap(stockVal);
                }
            });
        });
    });

    $("#getStock").on("click", function() {
        $.ajax({
            url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_DAILY" + "&symbol=" + $("#stockVal").val() + "&apikey=" + apikey,
            type: "get",
            success: function(data) {
                if (data["Error Message"]) {
                    alert("Invalid Stock Code");
                } else {
                    stockVal.push(data);
                    if (stocks.length > 9) {
                        alert("you can view up to 10 stock");
                        return;
                    } else {
                        var stockName = $("#stockVal").val();
                        stocks.push(stockName);
                        socket.emit("addStock", stockName);
                        $(".stockZone").append(drawStock(stockName));
                        chartyap(stockVal);
                    }
                }
            }
        });
    });

    $(document).on('click', ".closeBtn", function() {
        var id = $(this).parent().attr("id");
        stockVal = controlStockVal(stockVal, id, "remove");
        console.log(stocks);
        stocks = $.grep(stocks, function(value) {
            return value !== id;
        });
        console.log(stocks);
        socket.emit("removeStock", id);
        $(this).parent().remove();

        chartyap(stockVal);

    });
});