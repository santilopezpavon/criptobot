const StrategiesTest = require("./src/Backtest/StrategiesTest");

const coins = [
    "DOTBUSD", "BTCBUSD", "ADABUSD", "GLMRBUSD",
    "BNBBUSD", "XRPBUSD", "DOGEBUSD", "AVAXBUSD",
    "SOLBUSD", "ETHBUSD"
];

const strategies = [
     "real/InitialStrategy", "real/07-51", "real/safe"
];


const strategiesTest = new StrategiesTest(coins, strategies);

strategiesTest.getResults();