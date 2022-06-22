const StrategiesTest = require("./src/Backtest/StrategiesTest");

let coins = [
    "DOTBUSD"
];

coins = [
    "DOTBUSD", "BTCBUSD", "ADABUSD", "GLMRBUSD",
    "BNBBUSD", "XRPBUSD", "DOGEBUSD", "AVAXBUSD",
    "SOLBUSD", "ETHBUSD", "TRXBUSD", "LINKBUSD",
    "MATICBUSD", "UNIBUSD", "FTTBUSD", "XLMBUSD",
    "NEARBUSD", "HBARBUSD"
];

coins = [
    "UNIBUSD", "TRXBUSD"
];

const strategies = [
    //"labs/Aleatory",
   /* "labs/Aleatory2",
    "labs/ModAleatory",
    "real/07-51",*/
   // "real/safe",
    //"real/07-51",
  //  "real/InitialStrategy",
   // "BackTesting"
   //"real/Sarwithvolumeosc",
   //"real/Sar007",
   "labs/Hammer",
   "labs/CandlePattern"
];
const strategiesTest = new StrategiesTest(coins, strategies);

strategiesTest.getResults();