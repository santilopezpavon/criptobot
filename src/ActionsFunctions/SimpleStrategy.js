function isUpperSellFunction(indicator) {
    const mfi_short = indicator.getMfi(16);
    const volumeIncrementPercent = indicator.getIncrementalVolume(16);  

    if (
        mfi_short[mfi_short.length - 1] > 65 &&
        volumeIncrementPercent[volumeIncrementPercent.length - 1] > 0.50
    ) {
        return true;
    } 
    return false;
}

function priceToRebuyFunction(priceClose, indicator) {
    const min = 0.07;
    const max = 0.01;
    const multiplicadorBoolinger = 0.8;

    const boolinguer = indicator.getBollingerBands(10);
    const middle = boolinguer[boolinguer.length - 1].middle;

    const mfi_short = indicator.getMfi(16);
    const volumeIncrementPercent = indicator.getIncrementalVolume(16);  

    let rentabilidadMovimiento = ((priceClose - middle) / middle) * multiplicadorBoolinger;
    if(rentabilidadMovimiento < min){
        rentabilidadMovimiento = min;
    }

    if(rentabilidadMovimiento > max){
        rentabilidadMovimiento = max;
    }
    //rentabilidadMovimiento = 0.005;
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    }

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }
