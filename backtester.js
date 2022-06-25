const StrategiesTest = require("./src/Backtest/StrategiesTest");

const coins = [
    "DOTBUSD", "BTCBUSD", "ADABUSD", "GLMRBUSD",
    "BNBBUSD", "XRPBUSD", "DOGEBUSD", "AVAXBUSD",
    "SOLBUSD", "ETHBUSD"
];

const strategies = [
     /*"real/InitialStrategy", 
     "real/07-51", 
     "real/safe", 
     "best/divergencemcdvol",
     "best/rsimfivol",  
     "best/mcdrsi",  */
     // "best/mcdvol",
     "labs/divergencemacd"
    
];


const strategiesTest = new StrategiesTest(coins, strategies);

strategiesTest.getResults();