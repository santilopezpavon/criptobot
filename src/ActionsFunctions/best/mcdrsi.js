function isUpperSellFunction(indicator) {   
    const mcd = indicator.getMacd();
    const mcd_last = mcd[mcd.length - 1];

    const volMcd = indicator.getMacd("volume");
    const volMcd_last = volMcd[volMcd.length - 1];

    const rsi_short = indicator.getRsi(12); //16
    const rsi_short_val = rsi_short[rsi_short.length - 1];
    const rsi_short_val_pre = rsi_short[rsi_short.length - 3];

    if(
        mcd_last.histogram > 0 &&
        mcd[mcd.length - 2].signal > mcd[mcd.length - 2].MACD &&
        mcd[mcd.length - 1].signal < mcd[mcd.length - 1].MACD &&
        mcd[mcd.length - 1].MACD > 0 &&      
        rsi_short_val_pre > 60 
        ) {
            return true;
    }

    /*console.log(mcd);
    dadasd*/
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