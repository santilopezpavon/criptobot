const StrategiesTest = require("./src/Backtest/StrategiesTest");

const coins = [
    "DOTBUSD", "BTCBUSD", "ADABUSD", "GLMRBUSD",
    "BNBBUSD", "XRPBUSD", "DOGEBUSD", "AVAXBUSD"
];

const strategies = [
    "BackTesting", "real/InitialStrategy", "BaseStrategy", "RealBot", 
    "InitialStrategyWithVolumeConfirmation"
];


const strategiesTest = new StrategiesTest(coins, strategies);

strategiesTest.getResults();