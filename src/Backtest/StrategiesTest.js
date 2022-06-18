const Backtest = require("./Backtest");


class StrategiesTest {  

    pairs;
    
    strategies;

    constructor(pairs = [], strategies = []) {
        this.pairs = pairs;
        this.strategies = strategies;
    }

    async getResults() {
        let results = {};
        for (let j = 0; j < this.strategies.length; j++) {
            const strategy = this.strategies[j];
            let resultsStrategy = {
                "oversold": 0,
                "operations": 0,
                "rentability": 0,
                "candles from operation": 0
            };
            for (let i = 0; i < this.pairs.length; i++) {
                const pair = this.pairs[i];
                const resultsStrategyPair = await this.getResultsStrategy(pair, strategy);
                resultsStrategyPair["strategy"] = strategy;
                resultsStrategy["oversold"] += resultsStrategyPair["oversold"];
                resultsStrategy["operations"] += resultsStrategyPair["operations"];
                resultsStrategy["rentability"] += resultsStrategyPair["rentability"];
                resultsStrategy["candles from operation"] += resultsStrategyPair["candles from operation"];                
                console.table(resultsStrategyPair);
            }   
            resultsStrategy["oversold"] = resultsStrategy["oversold"] / this.pairs.length;
            resultsStrategy["operations"] = resultsStrategy["operations"] / this.pairs.length;
            resultsStrategy["rentability"] = resultsStrategy["rentability"] / this.pairs.length;
            resultsStrategy["candles from operation"] = resultsStrategy["candles from operation"] / this.pairs.length;         
            resultsStrategy["rentabilityByOp"] = resultsStrategy["rentability"] / resultsStrategy["operations"];
            console.table(resultsStrategy);
            results[strategy] = resultsStrategy;
        }

        console.table(results);
        
        
    }


    async getResultsStrategy(pair, strategy) {

        const {
            isUpperSellFunction,
            priceToRebuyFunction
        } = require("./../ActionsFunctions/" + strategy);
        

        const backtest = new Backtest({
            "pair": pair,
            "initfrom": 51,
            "modulesFunctions": {
                "isUpperSellFunction": isUpperSellFunction,
                "priceToRebuyFunction": priceToRebuyFunction
            }
        });
        await backtest.init();

        return backtest.getResults();
    }
}

module.exports = StrategiesTest;
