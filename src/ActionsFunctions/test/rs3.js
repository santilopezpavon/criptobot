function isUpperSellFunction(indicator) {  
    //if(indicator.rsiStrategy.checkPriceUpperRsi(48, 60) === false) {return false;}

    const rsiValue48 = indicator.rsiStrategy.getRsiValue(48, "close");
    if(rsiValue48 < 45 || rsiValue48 > 60){
        return false;
    } 

    const rsiValue48low = indicator.rsiStrategy.getRsiValue(48, "low");
    if(rsiValue48low < 54 || rsiValue48low > 61){
        return false;
    } 

    const rsiValue48high = indicator.rsiStrategy.getRsiValue(48, "high");
    if(rsiValue48high < 54 || rsiValue48high > 62){
        return false;
    } 

    const rsiValue20high = indicator.rsiStrategy.getRsiValue(20, "high");
    if(rsiValue20high < 45 || rsiValue20high > 62){
        return false;
    } 

    const rsiValue20close = indicator.rsiStrategy.getRsiValue(20, "close");
    if(rsiValue20close < 50 || rsiValue20close > 65){
        return false;
    } 

    const rsiValue20low = indicator.rsiStrategy.getRsiValue(20, "low");
    if(rsiValue20low < 50 || rsiValue20low > 65){
        return false;
    } 

    

    return true;
}


module.exports = { isUpperSellFunction }