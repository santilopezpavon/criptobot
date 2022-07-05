function isUpperSellFunction(indicator) {
 
    const data = indicator.getData();
    const priceClose = data.close[data.close.length - 1];

    const sar = indicator.getParabolicSAR();
    const sar_value = sar[sar.length - 1];
    const sar_value_pre = sar[sar.length - 2];
    if(sar_value > priceClose && sar_value > sar_value_pre) {
        return true;
    }
    return false;    
}


module.exports = { isUpperSellFunction }