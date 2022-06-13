const configuration = require("../../config.json");
const axios = require('axios');


function getCoinsInformation() {
    return CoinsInformation.getInstance();
}

class CoinsInformation {
    url = configuration.information.urlbaseapi;    

    static #instance;

    static getInstance() {
        if (!CoinsInformation.#instance) {
            CoinsInformation.#instance = new CoinsInformation()
        }
        return CoinsInformation.#instance
    }

    /**
     * 
     * @param {string} parCoin 
     * @param {string} path 
     * @param {string} interval 
     * @returns {string}
     */
    #getUrl(parCoin, path, time, limit = 1000) {
        return this.url + path + '?symbol=' + parCoin + '&interval=' + time + '&limit=' + limit;
    }

    /**
     * 
     * @param {string} parCoin 
     * @param {string} time 
     * @returns 
     */
    async getHistoricalData(parCoin, time) {
        const current = this;
        const url = this.#getUrl(parCoin, "klines", time);
        return axios.get(url).then(function (response) {
            const data = current.#convertData(response.data);
            return data;
        }).catch(function (error) {
            console.log(error);
        });
    }

    /**
     * 
     * @param {Array} dataArray 
     */
    #convertData(dataArray) {
        let dataArrayConvert = [];
        dataArray.map(function (element) {
            dataArrayConvert.push({
                high: parseFloat(element[2]),
                low: parseFloat(element[3]),
                close: parseFloat(element[4]),
                volume: parseFloat(element[5]),
                numtrades: parseFloat(element[8]),
                open: parseFloat(element[1]),
            });
        });
        return dataArrayConvert;
    }


    async getCurrentPrice(asset) {
        const parCoin = asset + "USDT";
        const historicalData = await this.getHistoricalData(parCoin, "1m");
        return historicalData[historicalData.length - 1].close;
    }

    async getTotalValueAsset(asset, qty) {
        const price = await this.getCurrentPrice(asset);
        return price * qty;
    }

    async getFilters(pair) {
        const url = "https://www.binance.com/api/v1/exchangeInfo";
        return axios.get(url).then(function (response) {
            const datos = response.data.symbols;
            const result = datos.filter(datos => datos.symbol == pair);
            return result[0].filters;
        }).catch(function (error) {
            console.log(error);
        });
    }

    async getTruncates(pair) {
        let truncate = {};
        await this.getFilters(pair).then(function (res) {            
    
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                if(element.filterType == 'PRICE_FILTER') {
                    let tickSize = element.tickSize;
                    let decimals = tickSize.split(".");
                    let position = 0;
                    for (let j = 0; j < decimals[1].length; j++) {
                        if(decimals[1][j] == '1') {
                            position = j + 1;
                            break;
                        }                    
                    }
                    truncate["price"] = position;
                }
    
                if(element.filterType == 'LOT_SIZE') {
                    let tickSize = element.stepSize;
                    let decimals = tickSize.split(".");
                    let position = 0;
                    for (let j = 0; j < decimals[1].length; j++) {
                        if(decimals[1][j] == '1') {
                            position = j + 1;
                            break;
                        }                    
                    }
                    truncate["qty"] = position;
                }
                
            }
    
        });
        return truncate;
    }





}

module.exports = getCoinsInformation;

