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

    getRangerPriceMain(nbars, period = 40, typeVolume = 'totalVolume') {
        const profile = this.getVolumeProfile(nbars, period);
        let pos = 0;
        let max = null;
        for (let i = 0; i < profile.length; i++) {
            if(max == null || max < profile[i][typeVolume]) {
                max = profile[i][typeVolume];
                pos = i;
            }            
        }

        return profile[pos];
    }


    isPriceCloseSuperiorThanRange(distance, period, nbars = 40, typeVolume = 'totalVolume') {
        const volumeProfileMax = this.getRangerPriceMain(nbars, period, typeVolume);
        const maxPrice = volumeProfileMax.rangeEnd;
        const lastCandleClose = this.#dataIni[this.#dataIni.length - 1].close;
        //console.log(volumeProfileMax);
        if(lastCandleClose > maxPrice && 
            ((lastCandleClose - maxPrice) / maxPrice) > distance
            ) {
            return true;
        }
        return false;
    }
}

module.exports = {getIndicatorVolumeProfileStrategy};

