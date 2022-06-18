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

    getData() {
        return this.#data;
    }

    getRsi(period) {
        const inputRSI =  {
            "values": this.#data["close"],
            "period": period
        };

        const RSI = technicalIndicators.RSI;
       return RSI.calculate(inputRSI)

    }

    getKST() {
        const KST = technicalIndicators.KST;
        return KST.calculate({
            values      : this.#data["close"],
            ROCPer1     : 10,
            ROCPer2     : 15,
            ROCPer3     : 20,
            ROCPer4     : 30,
            SMAROCPer1  : 10,
            SMAROCPer2  : 10,
            SMAROCPer3  : 10,
            SMAROCPer4  : 15,
        })
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

    getEMAForProperty(property, period) {
        const values = this.#data[property];  
        return technicalIndicators.SMA.calculate({period : period, values : values}); 

    }

    getIncrementalVolume(period){
        const volumenEma = this.getEMAForProperty("volume", period);
        let count = 0;
        let incrementalVolume = [];
        for (let index = period - 1; index < this.#data["volume"].length; index++) {
            const element = this.#data["volume"][index];
            incrementalVolume[count] = (element - volumenEma[count]) / volumenEma[count];
            count++;            
        }
        return incrementalVolume;
    }

    getBollingerBands(period) {
        var BB = technicalIndicators.BollingerBands;
        var input = {
            period : period, 
            values : this.#data["close"],
            stdDev : 2
                
        }
        return BB.calculate(input);

    }

    isUpperShell() {      

        const mfi_short = this.getMfi(16);
        const rsi_short = this.getRsi(16);
        if (
            mfi_short[mfi_short.length - 1] > 60 &&
            rsi_short[rsi_short.length - 1] > 60
        ) {
            return true;
        }
        return false;
    }
}

module.exports = getIndicator;

