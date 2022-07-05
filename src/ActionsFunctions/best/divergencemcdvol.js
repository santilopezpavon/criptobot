const {isDivergenceMacd} = require("../../Formulas/macd");
const {rsimfi} = require("../../Formulas/rsimfi");

function isUpperSellFunction(indicator) {   
    if(
        rsimfi(indicator)
    ) {
        return isDivergenceMacd(indicator);
     }
     return false;

}



module.exports = { isUpperSellFunction }