
const Bot = require("./src/Bot/Bot");

const bot = new Bot("DOTBUSD", 30);
bot.init(60*3);


//console.log(Date.now());
//console.log(Date.now() + (60 * 60 * 1000));

/*

const connector = getConnection();
connector.getHistoricalData("DOTBUSD", "3m").then(function (data) {
    const indicator = getIndicator();  
    indicator.setData(data);
    const rsi = indicator.getMfi(100);
    console.log(rsi[rsi.length - 1]);
    console.log(rsi[0]);

});
const connector2 = getConnection();*/