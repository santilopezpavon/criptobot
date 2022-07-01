const technicalIndicators = require("technicalindicators");
const tulind = require('tulind');
const cs = require('candlestick');



function getIndicatorVolumeProfileStrategy(dataIni, data) {
    return new VolumeProfileStrategy(dataIni, data);
}

class VolumeProfileStrategy {

    #data;

    #dataIni;  

    constructor(dataIni, data) {
        this.#dataIni = dataIni;
        this.#data = data;
    }

    getVolumeProfile(nbars, period) {
        const numItems = this.#data["high"].length;
        const to = numItems;
        const from = numItems - period;
        let input = {
            high      :this.#data["high"].slice(from, to),
            open       :this.#data["open"].slice(from, to),
            low       : this.#data["low"].slice(from, to),
            close     : this.#data["close"].slice(from, to),
            volume    : this.#data["volume"].slice(from, to),
            noOfBars  : nbars
        }

        return technicalIndicators.VolumeProfile.calculate(input); 
    }

    getRangerPriceMain(nbars, period = 40) {
        const profile = this.getVolumeProfile(nbars, period);
        let pos = 0;
        let max = null;
        for (let i = 0; i < profile.length; i++) {
            if(max == null || max < profile[i].totalVolume) {
                max = profile[i].totalVolume;
                pos = i;
            }            
        }

        return profile[pos];
    }

    isPriceCloseSuperiorThanRange(distance, period) {
        const volumeProfileMax = this.getRangerPriceMain(40, period);
        const maxPrice = volumeProfileMax.rangeEnd;
        const lastCandleClose = this.#dataIni[this.#dataIni.length - 1].close;
        if(lastCandleClose > maxPrice && 
            ((lastCandleClose - maxPrice) / maxPrice) > distance
            ) {
            return true;
        }
        return false;
    }

    checkDoubleVerification(period = 40) {
       
        const volumeProfileMax = this.getRangerPriceMain(40, period);
        const basePrice = volumeProfileMax.rangeEnd;

        const lastPosition = this.#dataIni.length - 1;
        const lastCandleClose = this.#dataIni[lastPosition].close;
        
        if(basePrice < lastCandleClose) {
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

module.exports = {getIndicatorVolumeProfileStrategy};

