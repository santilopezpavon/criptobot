const getCoinsInformation = require("./src/Connector/CoinsInformation");
const getIndicator = require("./src/Indicators/Indicator");

const coinsInfo = getCoinsInformation();
const indicator = getIndicator();
/*
coinsInfo.getHistoricalData("DOTBUSD", "3m").then(async function (data) {
    indicator.setData(data);
    const mfi = indicator.getEMAForProperty("volume", 16);
    const mfi2 = indicator.getEMAForProperty("volume", 30);

    console.log(indicator.getIncrementalVolume(16));
});


*/

[]