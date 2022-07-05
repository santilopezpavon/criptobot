function isUpperSellFunction(indicator) {  
    if(indicator.rsiStrategy.checkPriceUpperRsi(48, 60) === false) {return false;}
    return true;
}


module.exports = { isUpperSellFunction }