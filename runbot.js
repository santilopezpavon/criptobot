const Bot = require("./src/Bot/Bot");

const {
    isUpperSellFunction,
    priceToRebuyFunction
} = require("./src/ActionsFunctions/real/Sar007");

const bot = new Bot({
    "modulesFunctions": {
        "isUpperSellFunction": isUpperSellFunction,
        "priceToRebuyFunction": priceToRebuyFunction
    }
});
bot.init();