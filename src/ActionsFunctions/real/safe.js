function isUpperSellFunction(indicator) {   
    const rsi_short = indicator.getRsi(7);
    const mfi_short = indicator.getMfi(16);

    if (
        rsi_short[rsi_short.length - 1] > 75 &&
        mfi_short[mfi_short.length - 1] > 60 
        
    ) {
        return true;
    } 
    return false;
}


module.exports = { isUpperSellFunction }