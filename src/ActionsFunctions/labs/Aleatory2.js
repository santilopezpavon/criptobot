function isUpperSellFunction(indicator) {
    return true
}

function priceToRebuyFunction(priceClose, indicator) {   

    let rentabilidadMovimiento = 0.01;
 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    }

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }
