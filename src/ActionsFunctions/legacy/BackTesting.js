function isUpperSellFunction(indicator) {
    const mfi_long = indicator.getMfi(50);
    const rsi_long = indicator.getRsi(50);
    const mfi_short = indicator.getMfi(16);
    const rsi_short = indicator.getRsi(16);
    const volumeIncrementPercent = indicator.getIncrementalVolume(16);
    
    const sumVolmus =  volumeIncrementPercent[volumeIncrementPercent.length - 1] +  volumeIncrementPercent[volumeIncrementPercent.length - 2]
    if (
        mfi_short[mfi_short.length - 1] > 60 &&
        rsi_short[rsi_short.length - 1] > 60 &&
        sumVolmus > 0
       // mfi_long[mfi_long.length - 1] > 50 &&
        //rsi_long[rsi_long.length - 1] > 50 && 
        // volumeIncrementPercent[volumeIncrementPercent.length - 1] > 0.50
    ) {
        return true;
    } 
    return false;
}


module.exports = { isUpperSellFunction }
