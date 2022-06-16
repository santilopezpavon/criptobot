const Bot = require("./src/Bot/Bot");

const {
    isUpperSellFunction,
    priceToRebuyFunction
} = require("./src/ActionsFunctions/SimpleStrategy");

const bot = new Bot({
    "modulesFunctions": {
        "isUpperSellFunction": isUpperSellFunction,
        "priceToRebuyFunction": priceToRebuyFunction
    }
});
bot.init();