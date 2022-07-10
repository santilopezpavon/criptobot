const technicalIndicators = require("technicalindicators");
const tulind = require('tulind');
const cs = require('candlestick');



function getIndicatorMedian(dataIni, data) {
    return new MedianStrategy(dataIni, data);
}

class MedianStrategy {

    #data;

    #dataIni;

    constructor(dataIni, data) {
        this.#dataIni = dataIni;
        this.#data = data;
    }

    #getSMAForProperty(property, period) {
        const values = this.#data[property];
        return technicalIndicators.SMA.calculate({ period: period, values: values });
    }

    getSMAForProperty(property, period) {
        return this.#getSMAForProperty(property, period);
    }

    getInfoTrend(property, periodLong, periodShort, fuerza, numeroRendimiento, numeroBarrasPequenas) {
        const median48 = this.getSMAForProperty(property, periodLong);
        const median20 = this.getSMAForProperty(property, periodShort);
        const precioCierre = this.#dataIni[this.#dataIni.length - 1].close;

        let alcista = true;
        let big = median20;
        let small = median48;
        if (median48[median48.length - 1] > median20[median20.length - 1]) {
            alcista = false;
            big = median48;
            small = median20;
        }


        let rendimientoAlto = true;
        for (let i = 1; i < numeroRendimiento; i++) {
            if(
                (
                    ((big[big.length - i] - small[small.length - i]) / small[small.length - i]) * 100
                ) < fuerza           
            ) {
                rendimientoAlto = false;
                break; 
            }
        }


        let masGrande = true;
        for (let i = 2; i < numeroBarrasPequenas; i++) {
            if(
                precioCierre < this.#dataIni[this.#dataIni.length - i].high           
            ) {
                masGrande = false;
                break; 
            }
        }



        return {
            alcista: alcista,
            rendimientoAlto: rendimientoAlto,
            masGrande: masGrande
        }



    }

    checkPriceUpperSMA(period, distance) {
        const lastCandle = this.#dataIni[this.#dataIni.length - 1];
        const mediaClose = this.#getSMAForProperty("close", period);
        const lastPos = mediaClose.length - 1;

        if (
            lastCandle.close > mediaClose[lastPos] &&
            ((lastCandle.close - mediaClose[lastPos]) / mediaClose[lastPos]) > distance

        ) {
            return true;
        }
        return false;

    }


    checkPriceDownSMA(period, distance) {
        const lastCandle = this.#dataIni[this.#dataIni.length - 1];
        const mediaClose = this.#getSMAForProperty("close", period);
        const lastPos = mediaClose.length - 1;

        if (
            lastCandle.close < mediaClose[lastPos] &&
            ((lastCandle.close - mediaClose[lastPos]) / mediaClose[lastPos]) < distance

        ) {
            return true;
        }
        return false;

    }


    checkPriceMantainsDownSMA(period = 48, numCandles = 10, delay = 0) {
        const mediaClose = this.#getSMAForProperty("close", period);

        for (let j = 1 + delay; j <= numCandles + delay; j++) {
            if (
                mediaClose[mediaClose.length - j] < this.#dataIni[this.#dataIni.length - j].high
            ) {
                return false;
            }
        }
        return true;
    }

}

module.exports = { getIndicatorMedian };

