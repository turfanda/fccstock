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

function getfinanceinfo() {
    $.ajax({
        url: "/getstock",
        type: "get",
        success: function(data) {
            $.each(data, function(index, item) {
                console.log(item);
                stocks.push(item);
                $.ajax({
                    url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_MONTHLY_ADJUSTED" + "&symbol=" + item + "&apikey=" + apikey,
                    type: "get",
                    success: function(data) {
                        stockVal.push(data);
                        $(".stockZone").append($("<div>").attr("id", item).text(item).addClass("stockBox").append($("<span class='closeBtn'>x</span>")));
                      $.each(stockVal,function(i,item){});
                    }
                });
            });
        }
    });

}



/*var seriesOptions = [],
    seriesCounter = 0;

function createChart() {
  console.log(2);

    Highcharts.stockChart('chartZone', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
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


function chartyap(asd){
console.log(1);
$.each(asd, function (i, item) {
var frd=[];
$.each(item["Monthly Adjusted Time Series"],function(i,item){
frd.push([Object.keys(item),item["4. close"]])
});
  console.log(frd);
      seriesOptions[i] = {
            name: item["Meta Data"]["2. Symbol"],
            data: frd
        };
      seriesCounter += 1;
      if (seriesCounter === asd.length)
      createChart();
        
});

}
*/





  

$(function() {
    if (!apikey)
        getapikey();
    if (stocks.length === 0)
        getfinanceinfo();

    socket = io();
    socket.on('stockArray', function(data) {
        stocks = data;
        $.each(stocks, function(index, item) {
            console.log(item);
            stocks.push(item);
            $(".stockBox").remove();
            $.ajax({
                url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_MONTHLY_ADJUSTED" + "&symbol=" + item + "&apikey=" + apikey,
                type: "get",
                success: function(data) {
                    stockVal.push(data);
                    $(".stockZone").append($("<div>").attr("id", item).text(item).addClass("stockBox").append($("<span class='closeBtn'>x</span>")));
                }
            });
        });
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
        stockVal = [];
        $(this).parent().remove();
        $(".stockBox").each(function(index, item) {
            stocks.push($(this).attr("id"));
        });
        $.each(stocks, function(index, item) {
            $.ajax({
                url: "https://www.alphavantage.co/query?function=" + "TIME_SERIES_MONTHLY_ADJUSTED" + "&symbol=" + item + "&apikey=" + apikey,
                type: "get",
                success: function(data) {
                    stockVal.push(data);
                }
            });

        });
        socket.emit("stockArray", stocks);
    });
});