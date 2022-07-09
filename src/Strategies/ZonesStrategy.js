const technicalIndicators = require("technicalindicators");
const tulind = require('tulind');
const cs = require('candlestick');



function getIndicatorZonesStrategy(dataIni, data) {
    return new ZonesStrategy(dataIni, data);
}

class ZonesStrategy {

    #data;

    #dataIni;  

    constructor(dataIni, data) {
        this.#dataIni = dataIni;
        this.#data = data;
    }

    getLinearRegresion(period = 48, property= "close") {
        let resultsReturn = [];
        tulind.indicators.linreg.indicator([this.#data[property]], [period], function(err, results) {
            resultsReturn =  results[0];
        });
        return resultsReturn;
    }

    getResistancePriceVolume(period = 48) {

        const pos = this.#dataIni.length - 1;
        const from = pos - period;
        let volMax = 0;
        let posVolMax = 0;
        for (let index = pos; index >= from; index--) {
            if(
                volMax < this.#data["volume"][index] && 
                this.#dataIni[index]["bullish"] == false
            ) {
                volMax = this.#data["volume"][index];
                posVolMax = index;
            }            
        }

        return this.#dataIni[posVolMax].close;        
    }


    getResistancePrice(period = 48) {

        const pos = this.#dataIni.length - 1;
        const from = pos - period;
        let priceMax = 0;
        let posPriceMax = 0;
        for (let index = pos; index >= from; index--) {
            if(
                priceMax < this.#data["high"][index] && 
                this.#dataIni[index]["bullish"] == false
            ) {
                priceMax = this.#data["high"][index];
                posPriceMax = index;
            }            
        }

        return this.#dataIni[posPriceMax].close;        
    }

    isUpperResistanceVolume(period = 48) {
        const closeResistance = this.getResistancePriceVolume(period);
        const pos = this.#dataIni.length - 1;
        const closeCurrent = this.#data["close"][pos];
        if(closeResistance < closeCurrent) {
            return true;
        }
        return false;
    }
    isUpperResistance(period = 48) {
        const closeResistance = this.getResistancePrice(period);
        const pos = this.#dataIni.length - 1;
        const closeCurrent = this.#data["close"][pos];
        if(closeResistance < closeCurrent) {
            return true;
        }
        return false;
    }

   
}

module.exports = {getIndicatorZonesStrategy};

