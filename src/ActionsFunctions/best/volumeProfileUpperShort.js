function isUpperSellFunction(indicator) {  
    return indicator.volumeProfileStrategy.isPriceCloseSuperiorThanRange(0.015); 
}

function priceToRebuyFunction(priceClose, indicator) {
    let rentabilidadMovimiento = 0.007;      
 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    } 

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }