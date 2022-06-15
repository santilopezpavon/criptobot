const configuration = require("../../config.json");
const axios = require('axios');
const getConnectionSpot = require("./../../src/Connector/ConnectorSpot");


function getAccount() {
    return Account.getInstance();
}

class Account {

    static #instance;

    #client;

    static getInstance() {
        if (!Account.#instance) {
            Account.#instance = new Account()
        }
        return Account.#instance
    }

    constructor() {
        this.#client = getConnectionSpot();
    }


    async getCryptFree() {
        return this.#client.account().then(
            function (response) {
                const data = response.data;
                const balances = data.balances;
                const list = balances.filter(obj => {
                    return obj.asset !== "BUSD" && obj.asset !== "BNB" && obj.free > 0
                })
                return list;
            }
        ).catch(function (error) {
            return false;
        });
    }

    async getStockOf(asset) {
        return this.getCryptFree().then(function (list) {
            const items = list.filter(obj => {
                return obj.asset == asset
            });
            if(items.length > 0) {
                return parseFloat(items[0].free);
            }
            return false;
        }).catch(function (error) {
            return false;
        });
    }

    async getTrades(pair) {
        return this.#client.myTrades(pair).then(function (response) {
            return response.data;
        }).catch(function (error) {
            return false;
        })
    }



    
}

module.exports = getAccount;

