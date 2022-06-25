const {isDivergenceMacd} = require("../../Formulas/macd");
const {rsimfi} = require("../../Formulas/rsimfi");

function isUpperSellFunction(indicator) {   
    if(
        rsimfi(indicator)
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