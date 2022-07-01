const getStrategiesStatisticalTestService = require("./src/Backtest/StrategiesStatisticalTest");

const statsService = getStrategiesStatisticalTestService();
init();
async function init() {
    const results = await statsService.getCoins(
        [
            "best/divergencemcdvol",
            /*"best/mcdrsi",
            "best/mcdvol",
            "best/rsimfivol",
            "best/rsiwithvol",*/
            "best/volumeAndRSI",
            "best/volumeProfileUpper",
            "best/smaUpper",
            "best/smaUpperShort",
            "best/volumeProfileUpperShort",
            "combination/combination01",
            "combination/combination02",
            "real/07-51",
            /*"labs/divergencemacd",
            "labs/CandlePattern",
*/
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

    console.log("Resultados en General");
    console.table(results);

    /*console.log("Ordenado más operaciones");
    console.log(results.sort(compareTotal));

    console.log("Ordenado más acierto");
    console.log(results.sort(compareBajadas));


    function compareBajadas(a, b) {

        return a["%bajadas"] - b["%bajadas"];
    }

    function compareTotal(a, b) {

        return a.total - b.total;
    }*/
}

