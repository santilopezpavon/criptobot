function isUpperSellFunction(indicator) {
    const mfi_short = indicator.getMfi(16);
    const rsi_short = indicator.getRsi(16);    

    if (
        mfi_short[mfi_short.length - 1] > 60 &&
        rsi_short[rsi_short.length - 1] > 60 
    ) {
        return true;
    } 
    return false;
}



module.exports = { isUpperSellFunction }
