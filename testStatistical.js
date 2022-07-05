const getStrategiesStatisticalTestService = require("./src/Backtest/StrategiesStatisticalTest");
const statsService = getStrategiesStatisticalTestService();

let all = statsService.getStrategiesByDirectories(["best", "test", "closed", "legacy"]);


//let all = statsService.getStrategiesByDirectories(["test"]);
init(all);
async function init(strategiesArray) {
    const results = await statsService.getCoins(
        strategiesArray
    );

    console.log("Ordenados por % bajadas");
    let resultsArrayBajadas = convertObjectToArray(results).sort(function (a, b) {
        return b["%bajadas"] - a["%bajadas"];
    });
    console.table(resultsArrayBajadas);


    console.log("Ordenados por total");
    resultsArrayTotal = convertObjectToArray(results).sort(function (a, b) {
        return b["total"] - a["total"];
    });
    console.table(resultsArrayTotal);


    console.log("Mejores estrategias");
    resultsArrayBest = convertObjectToArray(results).filter(function (item) {
        return item["total"] > 1500 && item["%bajadas"] > 75;
    });
    console.table(resultsArrayBest);


    let positions = convertObjectToArray(results);
    for (let index = 0; index < positions.length; index++) {
        const element = positions[index];
        const strategy = element["_strategy"];
        element["pos efect"] = getPositionStrategy(strategy, resultsArrayBajadas);
        element["pos total"] = getPositionStrategy(strategy, resultsArrayTotal);
        element["sum"] = element["pos efect"] + element["pos total"];        
    }

    positionsOrdered = positions.sort(function (a, b) {
        return a["sum"] - b["sum"];
    });
    console.table(positionsOrdered);









}
function getPositionStrategy(strategyName, arrayWithStrategies) {
    for (let index = 0; index < arrayWithStrategies.length; index++) {
        const element = arrayWithStrategies[index];
        if(element["_strategy"] === strategyName) {
            return index + 1;
        }        
    }
}
function convertObjectToArray(object) {
    var arrayForPrint = [];
    for (const key in object) {
        object[key]["_strategy"] = key;
        arrayForPrint.push(object[key]);    
    }
    return arrayForPrint;
}