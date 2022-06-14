const getCoinsInformation = require("../Connector/CoinsInformation");
const getIndicator = require("./../../src/Indicators/Indicator");
const getComunication = require("./../../src/Communication/Communication");
const getAccount = require("./../../src/Account/Account"); 
const configuration = require("../../config.json");

class Backtest {

    #coinsInfo = getCoinsInformation();

    #indicator = getIndicator();

    #comunication = getComunication();

    #account = getAccount();


    constructor(configuration) {
        this.pair = configuration.pair;
        this.initfrom = configuration.initfrom
        this.priceReBuy = null;
        this.operaciones = 0;
        this.rentabilidad = 0;
        this.rentabilidadMovimiento = 0;
    }


    async init() {
        const current = this;
        this.#coinsInfo.getHistoricalData(current.pair, "3m").then(async function (data) {
            for (let index = current.initfrom; index < data.length; index++) {
                const currentDataPeriod = data.slice(0, index + 1);
                current.#indicator.setData(currentDataPeriod);
                const currentPrice = currentDataPeriod[currentDataPeriod.length - 1]["close"];
                if(current.isUpperShell()) {                    
                    if(current.priceReBuy == null) {
                        current.priceReBuy = current.priceToRebuy(currentPrice);

                    }

                    if(current.priceReBuy >= currentPrice) {

                        current.priceReBuy = null;
                        current.rentabilidad += current.rentabilidadMovimiento;
                        current.operaciones++;
                    }                   
                }
            }
            console.log("Pair " + current.pair);
            console.log("Operaciones " + current.operaciones);
            console.log("Rentabilidad " + current.rentabilidad);
        });
        
    }

    isUpperShell() {
        const mfi_long = this.#indicator.getMfi(50);
        const rsi_long = this.#indicator.getRsi(50);
        const mfi_short = this.#indicator.getMfi(16);
        const rsi_short = this.#indicator.getRsi(16);

        
        if (
            mfi_short[mfi_short.length - 1] > 60 &&
            rsi_short[rsi_short.length - 1] > 60 &&
            mfi_long[mfi_long.length - 1] > 50 &&
            rsi_long[rsi_long.length - 1] > 50
        ) {
            return true;
        }
        return false;
    }

    priceToRebuy(priceClose) {
        const mfi_short = this.#indicator.getMfi(16);
        const rsi_short = this.#indicator.getRsi(16);

        const mfi_short_value = mfi_short[mfi_short.length - 1];
        const rsi_short_value = rsi_short[rsi_short.length - 1];

        const suma = mfi_short_value + rsi_short_value;
        this.rentabilidadMovimiento = 0.01;
        if(suma > 120) {
            this.rentabilidadMovimiento = 0.012;
        } else if(suma > 100) {
            this.rentabilidadMovimiento = 0.01;
        } else if(suma > 80) {
            this.rentabilidadMovimiento = 0.006;
        } else {
            this.rentabilidadMovimiento = 0.005;
        }        

        return priceClose - (priceClose * this.rentabilidadMovimiento);
    }



}

module.exports = Backtest;

