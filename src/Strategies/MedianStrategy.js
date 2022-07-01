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
        return technicalIndicators.SMA.calculate({period : period, values : values}); 
    }

    checkPriceUpperSMA(period, distance) {
        const lastCandle = this.#dataIni[this.#dataIni.length - 1];
        const mediaClose = this.#getSMAForProperty("close", period);
        const lastPos = mediaClose.length - 1;

        if(
            lastCandle.close > mediaClose[lastPos] && 
            ((lastCandle.close - mediaClose[lastPos]) / mediaClose[lastPos]) > distance
        
            ) {
                return true;
        }
        return false;

    }


    checkDoubleVerification(period = 40) {

        const lastCandle = this.#dataIni[this.#dataIni.length - 1];

        const mediaClose = this.#getSMAForProperty("close", period);
        if( lastCandle.close < mediaClose[mediaClose.length - 1]) {
            return false;
        }


        const rsiPeriods = [40];

        for (let index = 0; index < rsiPeriods.length; index++) {
            const element = rsiPeriods[index];

            const inputRSI =  {
                "values": this.#data["close"],
                "period": element
            };
    
            const RSI = technicalIndicators.RSI;
            const rsiValue = RSI.calculate(inputRSI)
            const rsiLastValue = rsiValue[rsiValue.length - 1];
            if(rsiLastValue  < 50) {
                return false;
            }
        }       

        return true;       

    }





   

}

module.exports = {getIndicatorMedian};

