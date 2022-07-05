const technicalIndicators = require("technicalindicators");


function getIndicatorRSIStrategy(dataIni, data) {
    return new RSIStrategy(dataIni, data);
}

class RSIStrategy {

    #data;

    #dataIni;  

    constructor(dataIni, data) {
        this.#dataIni = dataIni;
        this.#data = data;
    }   

    #getRsi(period, prop) {
        const inputRSI =  {
            "values": this.#data[prop],
            "period": period
        };

        const RSI = technicalIndicators.RSI;
        return RSI.calculate(inputRSI)
    }

    checkPriceUpperRsi(period, value) {
        const rsi = this.#getRsi(period, "close");
        const rsiValue = rsi[rsi.length - 1];
        if(rsiValue > value) {
            return true;
        }
        return false;      
    }

    crossRSISell(shortPeriod, largePeriod) {
        const rsiShort = this.#getRsi(shortPeriod, "close");
        const rsiLong = this.#getRsi(largePeriod, "close");

        const rsiShortLastPos = rsiShort.length - 1;
        const rsiLongLastPos = rsiLong.length - 1;

        if(
            rsiShort[rsiShortLastPos] < rsiLong[rsiLongLastPos] && 
            rsiShort[rsiShortLastPos - 1] > rsiLong[rsiLongLastPos - 1] &&
            rsiLong[rsiLongLastPos]  > 55 
        ) {
            return true;
        }
        return false;
    }


    velocityRsi(period = 48, numCandles = 3) {
        const rsi = this.#getRsi(period, "close");
        const from = rsi.length - 1;
        const to = from - numCandles;

        const rsi_last_value = rsi[from];
        const rsi_first_value = rsi[to];

        return Math.abs(rsi_last_value - rsi_first_value) / numCandles;



        
    }

    crossToDown(period, value) {
        const rsi = this.#getRsi(period, "close");
        const lastPos = rsi.length - 1;
        if(rsi[lastPos - 2] > value && rsi[lastPos - 1] > value && rsi[lastPos] < value) {
            return true;
        }   
        return false;
    }

    checkCim(period) {
        const rsi = this.#getRsi(period, "close");
        const Pc = rsi[rsi.length - 1];
        const Pb = rsi[rsi.length - 2];
        const Pa = rsi[rsi.length - 3];

        return (Pc < Pb) && (Pb > Pa);        
       
    }

    


    


   

}

module.exports = {getIndicatorRSIStrategy};

