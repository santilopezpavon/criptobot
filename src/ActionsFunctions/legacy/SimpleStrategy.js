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


module.exports = { isUpperSellFunction }
