const technicalIndicators = require("technicalindicators");
const tulind = require('tulind');
const cs = require('candlestick');



function getForceCandle(dataIni, data) {
    return new ForceCandle(dataIni, data);
}

class ForceCandle {

    #data;

    #dataIni;  

    constructor(dataIni, data) {
        this.#dataIni = dataIni;
        this.#data = data;
    }

    getForceRelative() {
        
    }

  
}

module.exports = {getForceCandle};

