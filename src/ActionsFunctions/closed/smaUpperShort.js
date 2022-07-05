function isUpperSellFunction(indicator) {  
    return indicator.medianStrategy.checkPriceUpperSMA(48, 0.015); 
 }
 

 module.exports = { isUpperSellFunction }