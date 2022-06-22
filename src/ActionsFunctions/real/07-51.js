function isUpperSellFunction(indicator) {

    const rsi_short = indicator.getRsi(16);
    const mfi_short = indicator.getMfi(16);
    
    if (
        rsi_short[rsi_short.length - 1] > 60 &&
        mfi_short[mfi_short.length - 1] > 65 
        
    ) {
        const data = indicator.getDataInit();
        return true;
    } 
    return false;
}

function priceToRebuyFunction(priceClose, indicator) {
    const max = 0.007;
    const min = 0.003;

    const boolinguer = indicator.getBollingerBands(10);
    const middle = boolinguer[boolinguer.length - 1].middle;
    const middleCalculate = middle;


    let rentabilidadMovimiento = ((middleCalculate - priceClose)/ priceClose ) * -1;

    if(rentabilidadMovimiento < min) {
        rentabilidadMovimiento = min;
    }

    if(rentabilidadMovimiento > max) {
        rentabilidadMovimiento = max;
    }



 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    }

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }