function isUpperSellFunction(indicator) {
    const mfi_long = indicator.getMfi(50);
    const rsi_long = indicator.getRsi(50);
    const mfi_short = indicator.getMfi(16);
    const rsi_short = indicator.getRsi(16);
    const volumeIncrementPercent = indicator.getIncrementalVolume(16);
    
    if (
        mfi_short[mfi_short.length - 1] > 65 &&
        rsi_short[rsi_short.length - 1] > 65 &&
        mfi_long[mfi_long.length - 1] > 50 &&
        rsi_long[rsi_long.length - 1] > 50 && 
        volumeIncrementPercent[volumeIncrementPercent.length - 1] > 0.50
    ) {
        return true;
    } 
    return false;
}

function priceToRebuyFunction(priceClose, indicator) {

    const boolinguer = indicator.getBollingerBands(10);
    const middle = boolinguer[boolinguer.length - 1].middle;

    let rentabilidadMovimiento = ((priceClose - middle) / middle) * 1;
    if(rentabilidadMovimiento < 0.005){
        rentabilidadMovimiento = 0.005;
    }

    if(rentabilidadMovimiento > 0.015){
        rentabilidadMovimiento = 0.015;
    }
    //rentabilidadMovimiento = 0.005;
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    }

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }
