
const Bot = require("./src/Bot/Bot");

const bot = new Bot();
bot.init();


/*const getCoinsInformation = require("./src/Connector/CoinsInformation"); 
const getAccount = require("./src/Account/Account"); 

const coinInformation = getCoinsInformation();

const account = getAccount().getStockOf("DOT").then(async function (qty){
    const total = await coinInformation.getTotalValueAsset("DOT", qty);
    console.log(total);
});*/

