const technicalIndicators = require("technicalindicators");


function getIndicator() {
    return Indicator.getInstance();
}

class Indicator {

    static #instance;
    
    #data;

    static getInstance() {
        if (!Indicator.#instance) {
            Indicator.#instance = new Indicator()
        }
        return Indicator.#instance
    }

    setData(data) {
        this.#data = this.#prepareData(data);
    }

    #prepareData(data) {
        let input = {
            "high": [],
            "low": [],
            "close":[],
            "volume": [],
            //"period": 14
        };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            input["high"].push(element["high"]);
            input["low"].push(element["low"]);
            input["close"].push(element["close"]);
            input["volume"].push(element["volume"]);            
        }
        return input;
    }

    getRsi(period) {
        const inputRSI =  {
            "values": this.#data["close"],
            "period": period
        };

        const RSI = technicalIndicators.RSI;
       return RSI.calculate(inputRSI)

    }

    getMfi(period) {
        //his.#data["period"] = period;

        const inputRSI =  {
            "high": this.#data["high"],
            "low": this.#data["low"],
            "close": this.#data["close"],
            "volume": this.#data["volume"],
            "period": period
        };

        const MFI = technicalIndicators.MFI;
       return MFI.calculate(inputRSI)
    }
}

module.exports = getIndicator;

