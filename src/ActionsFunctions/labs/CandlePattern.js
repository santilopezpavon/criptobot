function isUpperSellFunction(indicator) {  
    const pattern = indicator.getLastCandlePattern();

    if (
        pattern.patternLast == 'bearishKicker' ||
        pattern.patternLast == 'bearishHarami' ||
        pattern.patternLast == 'bearishEngulfing' ||
        pattern.patternLast == 'bearishKicker'
        ) {    
            const volumeOscilator = indicator.getVolumeOscilator();
            const volumeOscilatorValue = volumeOscilator[volumeOscilator.length - 1];
            const volumeOscilatorValuePre = volumeOscilator[volumeOscilator.length - 2];

           
            if(indicator.isLastPatternLastCandle(pattern) && volumeOscilatorValue > 100 || volumeOscilatorValuePre > 100) {
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