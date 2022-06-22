function isUpperSellFunction(indicator) {  
   if (indicator.isInvertedHammer()) {
    const volumeOscilator = indicator.getVolumeOscilator();
    const volumeOscilatorValue = volumeOscilator[volumeOscilator.length - 1];
    const volumeOscilatorValuePre = volumeOscilator[volumeOscilator.length - 2];
    if(volumeOscilatorValue > 20 || volumeOscilatorValuePre > 20) {
        return true;
    }    
   }
   return false;
}

function priceToRebuyFunction(priceClose, indicator) {      
    let rentabilidadMovimiento = 0.007;   
    /*const volumeOscilator = indicator.getVolumeOscilator();
    const volumeOscilatorValue = volumeOscilator[volumeOscilator.length - 1];
    if(volumeOscilatorValue < 40) {
        rentabilidadMovimiento = 0.007;  
    } */   
 
    return {
        "price": priceClose - (priceClose * rentabilidadMovimiento),
        "rentabilidadMovimiento": rentabilidadMovimiento
    }
}

module.exports = { isUpperSellFunction, priceToRebuyFunction }