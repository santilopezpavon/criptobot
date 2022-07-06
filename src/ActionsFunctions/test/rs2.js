function isUpperSellFunction(indicator) {  
  //if(indicator.rsiStrategy.checkPriceUpperRsi(48, 60) === false) {return false;}

  const rsiValue48 = indicator.rsiStrategy.getRsiValue(48, "close");
  if(rsiValue48 < 55 ){
      return false;
  } 

  
  const close = indicator.rsiStrategy.getRsi(8, "close");
  const pos = close.length - 1;

  for (let index = pos; index > pos - 10; index--) {
      if(close[index] < 30) {
          return true;
      }
      
  }


  return false;
}


module.exports = { isUpperSellFunction }