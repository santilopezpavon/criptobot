const {isOverBiddenByMacd, isDivergenceMacd, isOverBiddenByMacdRsi} = require("../../Formulas/macd");
const {rsimfi} = require("../../Formulas/rsimfi");
const {rsiVol} = require("../../Formulas/vol");

function isUpperSellFunction(indicator) {   
    const rsi_short = indicator.getRsi(6); //16
    const rsi_long = indicator.getRsi(30); //16
    const rsi_short_val = rsi_short[rsi_short.length - 1];
    const rsi_long_val = rsi_short[rsi_long.length - 1];
    if(
        rsi_short_val > 80 && 
        rsi_long_val > 60
    ) {
        return rsiVol(indicator, 35, 60);
     }
     return false;

}



module.exports = { isUpperSellFunction }