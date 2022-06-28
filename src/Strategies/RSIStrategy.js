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



   

}

module.exports = {getIndicatorRSIStrategy};

