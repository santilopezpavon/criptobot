const Bot = require("./src/Bot/Bot");

const {
    isUpperSellFunction,
    priceToRebuyFunction
} = require("./src/ActionsFunctions/best/smaUpperShort");

const bot = new Bot({
    "modulesFunctions": {
        "isUpperSellFunction": isUpperSellFunction,
        "priceToRebuyFunction": priceToRebuyFunction
    }
});
bot.init();