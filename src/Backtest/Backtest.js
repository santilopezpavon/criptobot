const getCoinsInformation = require("../Connector/CoinsInformation");
const getIndicator = require("./../../src/Indicators/Indicator");
const getComunication = require("./../../src/Communication/Communication");
const getAccount = require("./../../src/Account/Account"); 
const configuration = require("../../config.json");
const { bollingerbands } = require("technicalindicators");



class Backtest {

    #coinsInfo = getCoinsInformation();

    #indicator = getIndicator();

    #comunication = getComunication();

    #account = getAccount();

    #modulesFunctions = {};


    constructor(configuration) {
        this.pair = configuration.pair;
        this.initfrom = configuration.initfrom
        this.priceReBuy = null;
        this.operaciones = 0;
        this.rentabilidad = 0;
        this.rentabilidadMovimiento = 0;
        this.currentObject = {};
        this.sobreventasNum = 0;
        this.priceSell = 0;
        this.#modulesFunctions = configuration.modulesFunctions;
    }


    async init() {
        const current = this;
        this.#coinsInfo.getHistoricalData(current.pair, "3m").then(async function (data) {
            for (let index = current.initfrom; index < data.length; index++) {
                const currentDataPeriod = data.slice(0, index + 1);
                current.#indicator.setData(currentDataPeriod);
                const currentPrice = currentDataPeriod[currentDataPeriod.length - 1]["close"];
                //const currentPriceHigh = currentDataPeriod[currentDataPeriod.length - 1]["high"];
                const currentPriceLow = currentDataPeriod[currentDataPeriod.length - 1]["low"];
                current.currentObject = currentDataPeriod[currentDataPeriod.length - 1];

                let newPrice = false;
                if(current.isUpperShell()) {         
                    current.sobreventasNum++;                      
                    if(current.priceReBuy == null) {
                        current.priceSell = currentPrice;
                        current.priceReBuy = current.priceToRebuy(currentPrice);
                        newPrice = true;
                    }                       
                } 

                if(current.priceReBuy != null && newPrice == false && current.priceReBuy >= currentPriceLow) {
                    console.log({
                        "priceRebuy": current.priceReBuy,
                        "rentabilidad": current.rentabilidadMovimiento,
                        "priceSell": current.priceSell
                    });
                    current.priceReBuy = null;
                    current.rentabilidad += current.rentabilidadMovimiento;
                    current.operaciones++;
                   
                }   
            }
            console.log("Pair " + current.pair);
            console.log("Num sobreventas " + current.sobreventasNum);
            console.log("Operaciones " + current.operaciones);
            console.log("Rentabilidad " + current.rentabilidad);
        });
        
    }

    isUpperShell() {       
        return this.#modulesFunctions.isUpperSellFunction(this.#indicator);
    }

    priceToRebuy(priceClose) {

        const data = this.#modulesFunctions.priceToRebuyFunction(priceClose, this.#indicator);
        this.rentabilidadMovimiento = data.rentabilidadMovimiento;
        return data.price;
        /*const mfi_short = this.#indicator.getMfi(16);
        const rsi_short = this.#indicator.getRsi(16);

        const boolinguer = this.#indicator.getBollingerBands(12);
        const middle = boolinguer[boolinguer.length - 1].middle;
        console.log(middle);

        this.rentabilidadMovimiento = ((priceClose - middle) / middle) * 0.3;
        if(this.rentabilidadMovimiento < 0.005){
            this.rentabilidadMovimiento = 0.005;
        }

        if(this.rentabilidadMovimiento > 0.01){
            this.rentabilidadMovimiento = 0.01;
        }*/


/*
        const mfi_short_value = mfi_short[mfi_short.length - 1];
        const rsi_short_value = rsi_short[rsi_short.length - 1];

        const suma = mfi_short_value + rsi_short_value;
        this.rentabilidadMovimiento = 0.01;
        if(suma > 120) {
            this.rentabilidadMovimiento = 0.008;
        } else if(suma > 100) {
            this.rentabilidadMovimiento = 0.005;
        } else if(suma > 80) {
            this.rentabilidadMovimiento = 0.005;
        } else {
            this.rentabilidadMovimiento = 0.005;
        }        */

       // return priceClose - (priceClose * this.rentabilidadMovimiento);
    }



}

module.exports = Backtest;

