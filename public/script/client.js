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

 /*   <div  class="fragment" >
        <span id='close'>x</span>
asdasdasd
</div>

.fragment {
    font-size: 12px;
    font-family: tahoma;
    width: 100px;
    border: 1px solid #ccc;
    color: #555;
    display: block;
    padding: 10px;
    box-sizing: border-box;
    text-decoration: none;
}

.fragment:hover {
    box-shadow: 2px 2px 5px rgba(0,0,0,.2);

}
#close {
    float:right;
    display:inline-block;
    padding:2px 5px;
    background:#ccc;
}*/