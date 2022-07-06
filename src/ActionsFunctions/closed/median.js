function isUpperSellFunction(indicator) {  
    if(indicator.medianStrategy.checkPriceUpperSMA(48, 0.015) === false) {return false} 
    if(indicator.rsiStrategy.checkPriceUpperRsi(48, 55) === false) {return false} 


   /* const rsiValue48 = indicator.rsiStrategy.getRsiValue(48, "close");
    if(rsiValue48 < 55 ){
        return false;
    } 
**/
    return true;
}



module.exports = { isUpperSellFunction }