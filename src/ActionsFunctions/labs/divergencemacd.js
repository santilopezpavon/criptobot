const {isOverBiddenByMacd, isDivergenceMacd, isOverBiddenByMacdRsi} = require("../../Formulas/macd");
const {rsimfi} = require("../../Formulas/rsimfi");
const {isDivergenceRSI} = require("../../Formulas/rsi");
function isUpperSellFunction(indicator) {  
    // return indicator.medianStrategy.checkPriceUpperSMA(48, 0.02); 

    return indicator.volumeProfileStrategy.isPriceCloseSuperiorThanRange(0.02); 

    console.log(vol);
    dsada


/*
    const lastCandle = indicator.getLastCandle();
    const data = indicator.getDataInit();

    const mediaClose = indicator.getEMAForProperty("close", 48);
    const lastPos = mediaClose.length - 1;
   
    if(
        lastCandle.close > mediaClose[lastPos] && 
        ((lastCandle.close - mediaClose[lastPos]) / mediaClose[lastPos]) > 0.02
    
        ) {
            return true;
    }
    return false;*/

}

function priceToRebuyFunction(priceClose, indicator) {
    let rentabilidadMovimiento = 0.007;      
 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    } 

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }