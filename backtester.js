
const Backtest = require("./src/Backtest/Backtest");
const {
    isUpperSellFunction,
    priceToRebuyFunction
} = require("./src/ActionsFunctions/SimpleStrategy");


const coins = [
    "DOTBUSD",
    "ETHBUSD",
    "BTCBUSD",
    "ADABUSD",
    "GLMRBUSD",
    "BNBBUSD",
    "XRPBUSD",
    "SOLBUSD",
    "DOGEBUSD",
    "AVAXBUSD"
];

runTest();

async function runTest(){
    let results = {
        "Num sobreventas": 0,
        "Operaciones": 0,
        "Rentabilidad": 0,
        "Velas pasadas media": 0
    };
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
        await backtest.init();
        results["Num sobreventas"] += backtest.results["Num sobreventas"]
        results["Operaciones"] += backtest.results["Operaciones"]
        results["Rentabilidad"] += backtest.results["Rentabilidad"]
        results["Velas pasadas media"] += backtest.results["Velas pasadas media"]
    }

    console.log("Total");
    console.table(
        {
            "Num sobreventas": results["Num sobreventas"] / coins.length,
            "Operaciones": results["Operaciones"] / coins.length,
            "Rentabilidad": results["Rentabilidad"] / coins.length,
            "Velas pasadas media": results["Velas pasadas media"] / coins.length
        }
    );
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