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





}

module.exports = getCoinsInformation;

