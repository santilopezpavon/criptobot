function isUpperSellFunction(indicator) {
    const mfi_long = indicator.getMfi(50);
    const rsi_long = indicator.getRsi(50);
    const mfi_short = indicator.getMfi(16);
    const rsi_short = indicator.getRsi(16);
    const volumeIncrementPercent = indicator.getIncrementalVolume(16);
    if (
        mfi_short[mfi_short.length - 1] > 60 &&
        rsi_short[rsi_short.length - 1] > 60 &&
        mfi_long[mfi_long.length - 1] > 40 &&
        rsi_long[rsi_long.length - 1] > 40 && 
        volumeIncrementPercent[volumeIncrementPercent.length - 1] > 0.3
    ) {
        return true;
    } 
    return false;
}

function priceToRebuyFunction(priceClose, indicator) {

    const boolinguer = indicator.getBollingerBands(12);
    const middle = boolinguer[boolinguer.length - 1].middle;

    let rentabilidadMovimiento = ((priceClose - middle) / middle) * 0.3;
    if(rentabilidadMovimiento < 0.005){
        rentabilidadMovimiento = 0.005;
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
