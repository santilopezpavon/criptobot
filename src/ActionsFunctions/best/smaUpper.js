function isUpperSellFunction(indicator) {  
    return indicator.medianStrategy.checkPriceUpperSMA(48, 0.02); 
 }
 
 function priceToRebuyFunction(priceClose, indicator) {      
     let rentabilidadMovimiento = 0.007;     
  
     return {
         "price": priceClose - (priceClose * rentabilidadMovimiento),
         "rentabilidadMovimiento": rentabilidadMovimiento
     }
 }
 
 module.exports = { isUpperSellFunction, priceToRebuyFunction }