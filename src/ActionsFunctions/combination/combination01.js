function isUpperSellFunction(indicator) {   
    const strategies = [
        "closed/smaUpper", "closed/median", "closed/smaUpperShort"
    ];

    for (let index = 0; index < strategies.length; index++) {
        const strategy = strategies[index];
        const {isUpperSellFunction} = require("../" + strategy);
        if(isUpperSellFunction(indicator)) {
            return true;
        }
        
    }
    return false;

}


module.exports = { isUpperSellFunction }