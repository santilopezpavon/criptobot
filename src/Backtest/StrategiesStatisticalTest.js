const getCacheService = require("./../../src/Memory/Cache");
const getCoinsInformation = require("../Connector/CoinsInformation");
const getIndicator = require("./../../src/Indicators/Indicator");
const configuration = require("../../config.json");
const FS   = require("fs");
const Path = require("path");


function getStrategiesStatisticalTestService() {
    return StrategiesStatisticalTest.getInstance();
}

class StrategiesStatisticalTest {

    static #instance;

    static getInstance() {
        if (!StrategiesStatisticalTest.#instance) {
            StrategiesStatisticalTest.#instance = new StrategiesStatisticalTest()
        }
        return StrategiesStatisticalTest.#instance
    }

    #coins  = [
        "DOTBUSD", "BTCBUSD", "ADABUSD", "GLMRBUSD",
        "BNBBUSD", "XRPBUSD", "DOGEBUSD", "AVAXBUSD",
        "SOLBUSD", "ETHBUSD", "TRXBUSD", "LINKBUSD",
        "MATICBUSD", "UNIBUSD", "FTTBUSD", "XLMBUSD",
        "NEARBUSD", "HBARBUSD", "LTCBUSD", "ATOMBUSD",
        "FILBUSD", "EOSBUSD", "AAVEBUSD", "GRTBUSD",
        "FTMBUSD", "CAKEBUSD", "ANKRBUSD", "BATBUSD",
        "BTTBUSD", "ONEBUSD", "TWTBUSD", "ONTBUSD"
    ];

    #cacheService = getCacheService();

    #coinsInformation = getCoinsInformation();

    #indicator = getIndicator();


    getStrategiesByDirectory(Directory) {
        const prefix = 'src/ActionsFunctions/';
        let Files = [];
        FS.readdirSync(prefix + Directory).forEach(File => {
            const Absolute = Path.join(prefix + Directory, File);
            return Files.push(Absolute);
        });

        for (let index = 0; index < Files.length; index++) {
            Files[index] = Files[index].replace(prefix, '');
            
        }       
        return Files;
    }

    getStrategiesByDirectories(Directory = []) {
        let files = [];
        for (let index = 0; index < Directory.length; index++) {
            const element = Directory[index];
            const allFiles = this.getStrategiesByDirectory(element);
            for (let j = 0; j < allFiles.length; j++) {
                files.push(allFiles[j]);
                
            }
        }
        return files;
    }

    async getCoins(strategies = []) {
        let results = {};
        for (let k = 0; k < strategies.length; k++) {
            results[strategies[k]] = {
                "subidas": 0,
                "bajadas": 0,
                "%subidas": 0,
                "%bajadas": 0,
                "total": 0,
                
            };
        }

        const current = this;
        for (let i = 0; i < this.#coins.length; i++) {
            const coin = this.#coins[i];
            const coinData = await this.getCoin(coin, configuration.analize.asset.temporality);

            for (let j = configuration.test.initPeriod; j < coinData.length - 50; j++) {
                const currentDataPeriod = coinData.slice(0, j + 1);
                current.#indicator.setData(currentDataPeriod);

                for (let k = 0; k < strategies.length; k++) {
                    const strategy = strategies[k];
                    const {
                        isUpperSellFunction
                    } = require("./../ActionsFunctions/" + strategy);

                    let pattern = false;
                    if(isUpperSellFunction(current.#indicator)) {
                        pattern = true;
                    }

                    if(pattern === true) {
                        const candles = current.#indicator.getDataInit();
                        const lastCandle = current.#indicator.getLastCandle();

                        const position = lastCandle.pos;
                        const futureCandle = coinData[position + 1];
                        const futureCandle4 = coinData[position + 15];


                        const reduction = lastCandle.close - (lastCandle.close * configuration.analize.asset.profit);
                        
                        let bajada = false;
                        for (let k = 1; k <= 50; k++) {
                            if(reduction > coinData[position + k].low ) {
                                bajada = true;
                                break;
                            }
                            
                        }

                        if(bajada === false) {
                            results[strategy]["subidas"]++;

                        } else if(bajada == true) {
                            results[strategy]["bajadas"]++;
                        } 

                        results[strategy]["total"]++;
                    }
                }                     

            }           
        }

        for (const key in results) {
                results[key]["%subidas"] = (results[key]["subidas"] / results[key]["total"]) * 100;
                results[key]["%bajadas"] = (results[key]["bajadas"] / results[key]["total"]) * 100;
            }
        return results
    }

    async getCoin(pair, time) {
        const current = this;
        const dataPair = this.#cacheService.load(pair + "_" + time);
        if(dataPair === false) {
            return await this.#coinsInformation.getHistoricalData(pair, time).then(async function (data) {
                current.#cacheService.save(pair + "_" + time, data, 10);
                return data;
            });
        } else {
            return dataPair

        }
       
    }

}

module.exports = getStrategiesStatisticalTestService