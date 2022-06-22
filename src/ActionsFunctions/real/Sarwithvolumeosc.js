function isUpperSellFunction(indicator) {
    const data = indicator.getData();
    const priceClose = data.close[data.close.length - 1];
    const pricePreClose = data.close[data.close.length - 2];

    const vol = indicator.getVolumeOscilator();
    const volOscilatorValue = vol[vol.length - 1];
    

    const sar = indicator.getParabolicSAR();
    const sar_value = sar[sar.length - 1];
    const sar_value_pre = sar[sar.length - 2];

    if(
        sar_value > priceClose && sar_value > sar_value_pre && 
        volOscilatorValue > 0
        
    ) {
        return true;
    }
    return false;  
    
}

function priceToRebuyFunction(priceClose, indicator) {   
   
        let rentabilidadMovimiento = 0.007;
    
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    }

}


module.exports = { isUpperSellFunction, priceToRebuyFunction }