
const Backtest = require("./src/Backtest/Backtest");
const {
    isUpperSellFunction,
    priceToRebuyFunction
} = require("./src/ActionsFunctions/SimpleStrategy");


const coins = [
    "DOTBUSD",
    "ETHBUSD",
    "BTCBUSD",
    "ADABUSD"
];

for (let index = 0; index < coins.length; index++) {
    const coin = coins[index];
    const backtest = new Backtest({
        "pair": coin,
        "initfrom": 51,
        "modulesFunctions": {
            "isUpperSellFunction": isUpperSellFunction,
            "priceToRebuyFunction": priceToRebuyFunction
        }
    });
    backtest.init();
    
}


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