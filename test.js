const StrategiesTest = require("./src/Backtest/StrategiesTest");

const coins = [
    "DOTBUSD"
];


/*
const coins = [
    "DOTBUSD", "BTCBUSD", "ADABUSD", "GLMRBUSD",
    "BNBBUSD", "XRPBUSD", "DOGEBUSD", "AVAXBUSD"
];
*/
const strategies = [
    "labs/Aleatory",
    //"labs/Aleatory2",
    "labs/ModAleatory",
    "real/07-51",
   // "real/InitialStrategy",
   // "BackTesting"
];
const strategiesTest = new StrategiesTest(coins, strategies);

strategiesTest.getResults();