const getStrategiesStatisticalTestService = require("./src/Backtest/StrategiesStatisticalTest");
const getIndicator = require("./src/Indicators/Indicator");



init();
async function init() {
    const strategies = getStrategiesStatisticalTestService();
    const coinData = await strategies.getCoin("DOTBUSD", "5m");
    let veces = {
        "trueRsi": [],
        "falseRsi": [], 
        "num": 0     
    };
    

    for (let j = 50; j < coinData.length - 50; j++) {
        const currentDataPeriod = coinData.slice(0, j + 1);
        const indicator = getIndicator();
        indicator.setData(currentDataPeriod);
        
        const lastCandle = indicator.getLastCandle();
        const reduction = lastCandle.close - (lastCandle.close * 0.05);
        const position = lastCandle.pos;

        let bajada = false;
        for (let k = 1; k <= 50; k++) {
            if(reduction > coinData[position + k].low ) {
                bajada = true;               
                break;
            }
            
        }


        const rsi = indicator.rsiStrategy.getRsi(48, "close");
        const valueRsi = rsi[rsi.length - 1];


        const mediaClose = indicator.medianStrategy.getSMAForProperty("close", 48)

       
        
        // return indicator.medianStrategy.checkPriceUpperSMA(48, 0.015); 

        if(bajada === true) {
            const lastPos = mediaClose.length - 1;
            console.log("-- Bien");
            console.log((lastCandle.close - mediaClose[lastPos]) / mediaClose[lastPos]);
            console.log(valueRsi);
        } else {
            const lastPos = mediaClose.length - 1;
            console.log("-- Mal");
            console.log((lastCandle.close - mediaClose[lastPos]) / mediaClose[lastPos]);
            console.log(valueRsi);
        }

        veces["num"]++;
    }

    //console.log(veces);

}

