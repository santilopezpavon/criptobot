const getStrategiesStatisticalTestService = require("./src/Backtest/StrategiesStatisticalTest");

const statsService = getStrategiesStatisticalTestService();
init();
async function init() {
    const results = await statsService.getCoins(
        [
            "best/divergencemcdvol",
            "best/mcdrsi",
            "best/mcdvol",
            "best/rsimfivol",
            "best/rsiwithvol",
            "combination/combination01",
            "real/07-51",

            //"best/divergencemcdvol",
            //"labs/divergencemacd",
            /*"RealBot", "SimpleStrategy", "real/safe", 
            "labs/MultipleStrategy", "labs/Aleatory",
            "real/07-51", "labs/CandlePattern", "labs/Hammer",
            "labs/ModAleatory2",
            "labs/MultipleStrategy", "labs/MultipleStrategy2",
            "labs/MultipleStrategy3", "labs/MultipleStrategy4",
            "labs/MultipleStrategy5"*/
        ]
    );
    console.table(results);
}

