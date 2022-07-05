function isUpperSellFunction(indicator) {  
    return indicator.volumeProfileStrategy.isPriceCloseSuperiorThanRange(0.015); 
}



module.exports = { isUpperSellFunction }