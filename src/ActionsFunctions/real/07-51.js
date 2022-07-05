function isUpperSellFunction(indicator) {

    const rsi_short = indicator.getRsi(16);
    const mfi_short = indicator.getMfi(16);
    
    if (
        rsi_short[rsi_short.length - 1] > 60 &&
        mfi_short[mfi_short.length - 1] > 65 
        
    ) {
        const data = indicator.getDataInit();
        return true;
    } 
    return false;
}


module.exports = { isUpperSellFunction }