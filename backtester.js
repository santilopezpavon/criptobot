
const Backtest = require("./src/Backtest/Backtest");
const {
    isUpperSellFunction,
    priceToRebuyFunction
} = require("./src/ActionsFunctions/RealBot");

const backtest = new Backtest({
    "pair": "DOTBUSD",
    "initfrom": 51,
    "modulesFunctions": {
        "isUpperSellFunction": isUpperSellFunction,
        "priceToRebuyFunction": priceToRebuyFunction
    }
});
backtest.init();

/*
const backtest2 = new Backtest({
    "pair": "GLMRBUSD",
    "initfrom": 51
});
backtest2.init();


const backtest3 = new Backtest({
    "pair": "BTCBUSD",
    "initfrom": 51
});
backtest3.init();


const backtest4 = new Backtest({
    "pair": "ETHBUSD",
    "initfrom": 51
});
backtest4.init();*/