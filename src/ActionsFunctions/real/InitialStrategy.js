function isUpperSellFunction(indicator) {
    const mfi_short = indicator.getMfi(16);
    const rsi_short = indicator.getRsi(16);
    const volumeIncrementPercent = indicator.getIncrementalVolume(16);
    if (
        mfi_short[mfi_short.length - 1] > 60 &&
        rsi_short[rsi_short.length - 1] > 60 /*&&
        volumeIncrementPercent[volumeIncrementPercent.length - 1] > 0*/
    ) {
        return true;
    } 
    return false;
}

function priceToRebuyFunction(priceClose, indicator) {

    const boolinguer = indicator.getBollingerBands(12);
    const middle = boolinguer[boolinguer.length - 1].middle;

    let rentabilidadMovimiento = ((priceClose - middle) / middle) * 0.8;
    if(rentabilidadMovimiento < 0.008){
        rentabilidadMovimiento = 0.008;
    }

    if(rentabilidadMovimiento > 0.01){
        rentabilidadMovimiento = 0.01;
    }

    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    }

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }
