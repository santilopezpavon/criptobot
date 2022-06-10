const configuration = require("../../config.json");
const axios = require('axios');


function getConnection() {
    return Connector.getInstance();
}

class Connector {
    url = configuration.information.urlbaseapi;    

    static #instance;

    static getInstance() {
        if (!Connector.#instance) {
            Connector.#instance = new Connector()
        }
        return Connector.#instance
    }

    /**
     * 
     * @param {string} parCoin 
     * @param {string} path 
     * @param {string} interval 
     * @returns {string}
     */
    #getUrl(parCoin, path, time) {
        return this.url + path + '?symbol=' + parCoin + '&interval=' + time + '&limit=1000';
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



}

module.exports = getConnection;

