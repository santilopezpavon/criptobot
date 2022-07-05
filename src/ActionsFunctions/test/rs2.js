function isUpperSellFunction(indicator) {  
    //if(indicator.rsiStrategy.checkPriceUpperRsi(48, 55) === false) {return false;}
    //if(indicator.rsiStrategy.checkPriceUpperRsi(48, 55) === false) {return false;}
    //if(indicator.rsiStrategy.checkCim(48) === false) {return false;}
   // if(indicator.rsiStrategy.velocityRsi(6, 2) < 4) {return false;}
   if(indicator.medianStrategy.checkPriceMantainsDownSMA(48, 8, 1) == false) {return false;}
   if(indicator.rsiStrategy.velocityRsi(6, 2) < 4) {return false;}
   //if(indicator.rsiStrategy.checkPriceUpperRsi(48, 55) === false) {return false;}
  // if(indicator.medianStrategy.checkPriceUpperSMA(48,0) === false) {return false;}
    return true;
}



module.exports = { isUpperSellFunction }