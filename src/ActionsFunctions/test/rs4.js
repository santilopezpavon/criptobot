function isUpperSellFunction(indicator) {  
    if(indicator.rsiStrategy.checkPriceUpperRsi(48, 55) === false) {return false;}
    return true;
}



module.exports = { isUpperSellFunction }