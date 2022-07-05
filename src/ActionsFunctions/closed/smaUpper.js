function isUpperSellFunction(indicator) {  
    return indicator.medianStrategy.checkPriceUpperSMA(48, 0.02); 
 }
 

 
 module.exports = { isUpperSellFunction }