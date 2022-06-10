const configuration = require("../../config.json");
const axios = require('axios');
const { Spot } = require('@binance/connector')


function getConnectionSpot() {
    return ConnectorSpot.getInstance().getConnection();
}

class ConnectorSpot {

    static #instance;

    #client;

    static getInstance() {
        if (!ConnectorSpot.#instance) {
            ConnectorSpot.#instance = new ConnectorSpot()
        }
        return ConnectorSpot.#instance
    }

    constructor() {
        this.#client = new Spot(configuration.account.apiKey, configuration.account.apiSecret);
    }

    getConnection() {
        return this.#client;
    }
}

module.exports = getConnectionSpot;

