function isUpperSellFunction(indicator) {   
    const rsi_short = indicator.getRsi(6);
    const mfi_short = indicator.getMfi(6);

    if (
        rsi_short[rsi_short.length - 1] > 70 &&
        mfi_short[mfi_short.length - 1] > 70         
    ) {
        return true;
    } 
    return false;
}

function priceToRebuyFunction(priceClose, indicator) {
    //let rentabilidadMovimiento = 0.007;

    const max = 0.006;
    const min = 0.003;

    const rsi_short = indicator.getRsi(7);
    const rsi_short_value = rsi_short[rsi_short.length - 1] / 100;
    let reduccionInicial = 0.015;
    let rentabilidadMovimiento = reduccionInicial * rsi_short_value;



    /*

    const mfi_short = indicator.getMfi(16);

    const boolinguer = indicator.getBollingerBands(10);
    const middle = boolinguer[boolinguer.length - 1].middle;
    const middleCalculate = middle;
    let rentabilidadMovimiento = ((middleCalculate - priceClose)/ priceClose ) * -1;

    rentabilidadMovimiento = rentabilidadMovimiento * 1.5 * rsi_short_value


*/

if(rentabilidadMovimiento > max) {
    rentabilidadMovimiento = max;
}
    if(rentabilidadMovimiento < min) {
        rentabilidadMovimiento = min;
    }

 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    }

}

module.exports = { isUpperSellFunction, priceToRebuyFunction }