var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views/src'));
app.set('view engine', 'ejs');


//to get data from multiple API
var coinFront = "http://coincap.io/front"
var globalInfo = "https://api.coinmarketcap.com/v1/global/"
var result;
var globalD;

  function getCoinFrontData(error, response, body) {
    if (!error && response.statusCode == 200) {
          result = JSON.parse(body)
    }
  }

  function getGlobalData(error, response, body) {
    if (!error && response.statusCode == 200) {
      globalD = JSON.parse(body);
    }
  }

request(coinFront, getCoinFrontData);
request(globalInfo, getGlobalData);

app.get("/", function (req, res) {
      var marketcap = [];
      var cPrice = []
      var cryptoAPrice=[]

  //marketcap and price
      for (var i=0; i<500; i++) {
        var marketcon = result[i]["mktcap"]
        var cryptoPrice = result[i]["price"]
        var cryptoAPrice1 = result[i]["vwapData"]
        cryptoAPrice1 = (cryptoAPrice1.toFixed(4));
        cryptoPrice = (cryptoPrice.toFixed(4));
        marketcon = marketcon/1000000000
        marketcon = (marketcon.toFixed(4));
        marketcap.push(marketcon);
        cPrice.push(cryptoPrice);
        cryptoAPrice.push(cryptoAPrice1);
      }
  //Global Data conversion
  var globalDP = globalD["total_market_cap_usd"]
  globalDP= globalDP/1000000000
  globalDP = (globalDP.toFixed(4));
  var globalV = globalD["total_24h_volume_usd"]
  globalV= globalV/1000000000
  globalV = (globalV.toFixed(4));
  var v24 = globalD["total_24h_volume_usd"]
  v24 = v24/1000000000
  v24 = (v24.toFixed(4));

      res.render("index.ejs", {result:result, marketcap:marketcap, cPrice:cPrice, cryptoAPrice:cryptoAPrice, globalD:globalD, globalDP:globalDP, globalV:globalV, v24:v24 });
});


app.listen(port, function() {
console.log("Server have started");
})
