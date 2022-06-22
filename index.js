const tulind = require('tulind');

var open  = [4,5,5,5,4,4,4,6,6,6];
var high  = [9,7,8,7,8,8,7,7,8,7];
var low   = [1,2,3,3,2,1,2,2,2,3];
var close = [4,5,6,6,6,5,5,5,6,4];
var volume = [123,232,212,232,111,232,212,321,232,321];


tulind.indicators.psar.indicator([high, low], [.2, 2], function(err, results) {
    console.log("Result of sma is:");
    console.log(results[0]);
  });
  console.log("SIGUE");

  console.log("SIGUE");

console.log("SIGUE");
  tulind.indicators.vosc.indicator([volume], [2,5], function(err, results) {
    console.log("Result of sma is:");
    console.log(results[0]);
  });


