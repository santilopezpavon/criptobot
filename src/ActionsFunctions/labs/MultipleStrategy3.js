function isUpperSellFunction(indicator) {   
    const lastCandle = indicator.getLastCandle();
    const rsi_short = indicator.getRsi(6);
    const mfi_short = indicator.getMfi(6);
    const rsi_long = indicator.getRsi(40);
    const volumeOscilator = indicator.getVolumeOscilator();
    const volumeOscilatorValue = volumeOscilator[volumeOscilator.length - 1];
    if(
        rsi_short[rsi_short.length - 1] > 65 &&
        rsi_long[rsi_long.length - 1] > 60 &&
        mfi_short[mfi_short.length - 1] > 60 &&
        lastCandle.bullish === true &&
        volumeOscilatorValue > 0
    ) {
        return true;
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