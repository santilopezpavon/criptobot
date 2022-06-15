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
        let velas = 0;
        let ventaHecha = false;
        this.#coinsInfo.getHistoricalData(current.pair, "3m").then(async function (data) {
            for (let index = current.initfrom; index < data.length; index++) {
                const currentDataPeriod = data.slice(0, index + 1);
                current.#indicator.setData(currentDataPeriod);
                const currentPrice = currentDataPeriod[currentDataPeriod.length - 1]["close"];
                //const currentPriceHigh = currentDataPeriod[currentDataPeriod.length - 1]["high"];
                const currentPriceLow = currentDataPeriod[currentDataPeriod.length - 1]["low"];
                current.currentObject = currentDataPeriod[currentDataPeriod.length - 1];

                if(ventaHecha == true) {
                    velas++;
                }

                if(current.priceReBuy != null  && current.priceReBuy >= currentPriceLow) {
                    console.log({
                        "priceRebuy": current.priceReBuy,
                        "rentabilidad": current.rentabilidadMovimiento,
                        "priceSell": current.priceSell,
                        "velas": velas
                    });
                    current.priceReBuy = null;
                    current.rentabilidad += current.rentabilidadMovimiento;
                    current.operaciones++;
                    velas = 0;
                    ventaHecha = false;
                   
                }   

                if(current.isUpperShell()) {         
                    current.sobreventasNum++;                      
                    if(current.priceReBuy == null) {
                        current.priceSell = currentPrice;
                        current.priceReBuy = current.priceToRebuy(currentPrice);
                        velas++;
                        ventaHecha = true;
                    }                       
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
    }



}

module.exports = Backtest;

