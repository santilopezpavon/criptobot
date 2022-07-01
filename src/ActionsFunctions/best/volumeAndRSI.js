function isUpperSellFunction(indicator) {  
    return indicator.volumeProfileStrategy.checkDoubleVerification(45); 
   // return indicator.medianStrategy.checkDoubleVerification(45); 
}

function priceToRebuyFunction(priceClose, indicator) {
    let rentabilidadMovimiento = 0.007;      
 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    } 

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }