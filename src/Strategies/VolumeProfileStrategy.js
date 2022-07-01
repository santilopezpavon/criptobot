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

    checkDoubleVerification(period = 40, numBarsUpper = 6) {
        const volumeProfileMax = this.getRangerPriceMain(40, period);
        const basePrice = volumeProfileMax.rangeEnd;

        const lastPosition = this.#dataIni.length - 1;
        const lastCandleClose = this.#dataIni[lastPosition].close;
        
        if(basePrice < lastCandleClose) {
            return false;
        }

        const values = this.#data["close"];  
        const sma = technicalIndicators.SMA.calculate({period : 48, values : values}); 
        const smaValue = sma[lastPosition];
        if(smaValue * 1.10 > lastCandleClose) {
            return false;
        }

        for (let index = lastPosition; index > (lastPosition - numBarsUpper); index--) {
            const currentBar = this.#dataIni[index];
            if(currentBar.low < sma[index]) {
                return false;
            }
            
        }

        const volumeProfileMaxAmplified = this.getRangerPriceMain(40, 5);
        const maxPriceAmplified = volumeProfileMaxAmplified.rangeEnd;

        if(maxPriceAmplified < lastCandleClose) {
            return false;
        }


        /*const from = lastPosition - numBarsUpper;
        /*console.log("-----");
        console.log(from);
        console.log(lastPosition);
        for (let index = lastPosition; index > from; index--) {
            
            if(maxPrice > this.#dataIni[index].close) {
                console.log("entra");
            console.log(maxPrice);
            console.log(this.#dataIni[index].close);
                return false;
            }            
        }*/
        

        return true;
        

    }



   

}

module.exports = {getIndicatorVolumeProfileStrategy};

