const {isOverBiddenByMacd, isDivergenceMacd, isOverBiddenByMacdRsi} = require("../../Formulas/macd");
const {rsimfi} = require("../../Formulas/rsimfi");
const {isDivergenceRSI} = require("../../Formulas/rsi");
function isUpperSellFunction(indicator) {   
    if(
        rsimfi(indicator, 16, 10, 45)
    ) {
        return isDivergenceMacd(indicator);
     }
     return false;

}

function priceToRebuyFunction(priceClose, indicator) {
    let rentabilidadMovimiento = 0.007;      
 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    } 

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }