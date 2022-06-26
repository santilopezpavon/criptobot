function isUpperSellFunction(indicator) {   
    const strategies = [
        "best/smaUpper", "best/volumeProfileUpper"
    ];

    for (let index = 0; index < strategies.length; index++) {
        const strategy = strategies[index];
        const {isUpperSellFunction} = require("../" + strategy);
        if(isUpperSellFunction(indicator)) {
            return true;
        }
        
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