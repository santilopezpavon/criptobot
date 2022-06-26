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

    getVolumeProfile(nbars) {
        let input = {
            high      :this.#data["high"],
            open       :this.#data["open"],
            low       : this.#data["low"],
            close     : this.#data["close"],
            volume    : this.#data["volume"],
            noOfBars  : nbars
        }

        return technicalIndicators.VolumeProfile.calculate(input); 
    }

    getRangerPriceMain(nbars) {
        const profile = this.getVolumeProfile(nbars);
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

    isPriceCloseSuperiorThanRange(distance) {
        const volumeProfileMax = this.getRangerPriceMain(40);
        const maxPrice = volumeProfileMax.rangeEnd;
        const lastCandleClose = this.#dataIni[this.#dataIni.length - 1].close;
        if(lastCandleClose > maxPrice && 
            ((lastCandleClose - maxPrice) / maxPrice) > distance
            ) {
            return true;
        }
        return false;
    }

    /*#getSMAForProperty(property, period) {
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

    }*/



   

}

module.exports = {getIndicatorVolumeProfileStrategy};

