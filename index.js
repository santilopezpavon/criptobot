
/*const Bot = require("./src/Bot/Bot");

const bot = new Bot("DOTBUSD", 30);
bot.init(60*3);*/

const getAccount = require("./src/Account/Account"); 
const account = getAccount().getStockOf("BTC").then(function (res){
    console.log(res);
});

