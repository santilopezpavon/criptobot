function isUpperSellFunction(indicator) {  
    return indicator.volumeProfileStrategy.isPriceCloseSuperiorThanRange(0.02); 
}



module.exports = { isUpperSellFunction }