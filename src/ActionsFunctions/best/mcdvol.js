function isUpperSellFunction(indicator) {   
    const mcd = indicator.getMacd();
    const mcd_last = mcd[mcd.length - 1];

    const volMcd = indicator.getMacd("volume");

    const rsi_short = indicator.getRsi(10); //16
    const rsi_short_val_pre = rsi_short[rsi_short.length - 3];

    if(
        mcd_last.histogram > 0 &&
        mcd[mcd.length - 2].signal > mcd[mcd.length - 2].MACD &&
        mcd[mcd.length - 1].signal < mcd[mcd.length - 1].MACD &&
        mcd[mcd.length - 1].MACD > 0 &&      
        rsi_short_val_pre > 60 &&
        volMcd[volMcd.length - 1].signal < volMcd[volMcd.length - 1].MACD 
        ) {
            return true;
    }

    return false;

}

function priceToRebuyFunction(priceClose, indicator) {
    let rentabilidadMovimiento = 0.005;      
 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    } 

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }