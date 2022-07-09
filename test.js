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
    
    let dineroInicial = 0;
    let cantidadInicial = 7;

    let first = true;

    for (let j = 50; j < coinData.length - 50; j++) {
        const currentDataPeriod = coinData.slice(0, j + 1);
        const indicator = getIndicator();
        indicator.setData(currentDataPeriod);
        const lastCandle = indicator.getLastCandle();
        if(first === true) {

            console.log(lastCandle.close * cantidadInicial) ;
            first = false;
        }

        let venta = true;
        if(indicator.medianStrategy.checkPriceUpperSMA(48, 0.015) === false) {venta = false} 
        if(indicator.rsiStrategy.checkPriceUpperRsi(48, 55) === false) {venta = false} 

        if(venta === true && cantidadInicial !== 0) {
            dineroInicial = lastCandle.close * cantidadInicial;
            cantidadInicial = 0;
        }


        let compra = true;
        if(indicator.medianStrategy.checkPriceDownSMA(48, -0.010) === false) {compra = false} 
        if(compra === true && dineroInicial !== 0) {
            cantidadInicial =  dineroInicial / lastCandle.close;
            dineroInicial = 0;
        }


        
     

       

    }

    console.log("dineroInicial " + dineroInicial);
    console.log("cantidadInicial " + cantidadInicial);
}

