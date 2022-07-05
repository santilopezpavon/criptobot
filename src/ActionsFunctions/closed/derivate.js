function isUpperSellFunction(indicator) {  
    if(indicator.volumeProfileStrategy.isPriceCloseSuperiorThanRange(0.015, 45) === false) {return false; }
    if(indicator.rsiStrategy.checkPriceUpperRsi(40, 55) === false) {return false;}
    return true;
}

module.exports = { isUpperSellFunction }