
const Backtest = require("./src/Backtest/Backtest");

const backtest = new Backtest({
    "pair": "DOTBUSD",
    "initfrom": 20
});
backtest.init();


const backtest2 = new Backtest({
    "pair": "GLMRBUSD",
    "initfrom": 20
});
backtest2.init();


const backtest3 = new Backtest({
    "pair": "BTCBUSD",
    "initfrom": 20
});
backtest3.init();


const backtest4 = new Backtest({
    "pair": "ETHBUSD",
    "initfrom": 20
});
backtest4.init();