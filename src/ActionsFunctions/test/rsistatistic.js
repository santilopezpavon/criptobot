function isUpperSellFunction(indicator) {  
   // if(indicator.zoneStrategy.isUpperResistance(48) === false) {return false;}
    //if(indicator.zoneStrategy.isUpperResistanceVolume(48) === false) {return false;}
    const dataIni = indicator.getDataInit();
    const lastPos = dataIni.length - 1;
    const close = dataIni[lastPos].close;
    const regresion = indicator.zoneStrategy.getLinearRegresion(10, "high");

    const lastPosRegresion = regresion.length - 1;


    if(
        regresion[regresion.length - 1] < close && 
        ((close - regresion[lastPosRegresion]) / regresion[lastPosRegresion]) > 0.002
        
    ) {
        return true;
    }
    //console.log(indicator.zoneStrategy.getLinearRegresion(10, "high"));
    //dsadasda
    return false;
}



module.exports = { isUpperSellFunction }