function isUpperSellFunction(indicator) {

    const resultado = indicator.medianStrategy.getInfoTrend("close", 48, 16, 0.75, 4, 2);


    if (resultado.alcista === false && resultado.rendimientoAlto === true && resultado.masGrande === true) {
        return {
            "profit": 0.004,
            "upperSell": true
        };
    }

    if(indicator.rsiStrategy.checkPriceUpperRsi(48, 55) === true) {
        
        if(
            indicator.medianStrategy.checkPriceUpperSMA(48, 0.015) === true   
        ) {
            return {
                "profit": 0.005,
                "upperSell": true
            };
        } 
        
        if(
            indicator.medianStrategy.checkPriceUpperSMA(48, 0.012) === true   
        ) {
            return {
                "profit": 0.0035,
                "upperSell": true
            };
        } 
        
    }


    return false;
}




module.exports = { isUpperSellFunction }