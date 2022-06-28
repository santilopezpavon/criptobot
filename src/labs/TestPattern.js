const getCoinsInformation = require("../Connector/CoinsInformation");
const getIndicator = require("./../../src/Indicators/Indicator");


const coinsInformation = getCoinsInformation();
const indicator = getIndicator();

let coins = ["DOTBUSD"];
/*coins = [
    "DOTBUSD", "BTCBUSD", "ADABUSD", "GLMRBUSD",
    "BNBBUSD", "XRPBUSD", "DOGEBUSD", "AVAXBUSD",
    "SOLBUSD", "ETHBUSD", "TRXBUSD", "LINKBUSD",
    "MATICBUSD", "UNIBUSD", "FTTBUSD", "XLMBUSD",
    "NEARBUSD", "HBARBUSD"
];*/

init();

async function init() {
    let subidaPrecio = 0;
    let bajadaPrecio = 0;

    for (let index = 0; index < coins.length; index++) {
        const coin = coins[index];
        await coinsInformation.getHistoricalData(coin, configuration.analize.asset.temporality).then(async function (data) {
            for (let index = 50; index < data.length - 10; index++) {
                const currentDataPeriod = data.slice(0, index + 1);
                indicator.setData(currentDataPeriod);
                
                const candles = indicator.getDataInit();
                const lastCandle = indicator.getLastCandle();
        
                // Pattern
                let patternMatch = false;
                const rsi_short = indicator.getRsi(16);
                const mfi_short = indicator.getMfi(40);
                const rsi_long = indicator.getRsi(40);
                const volumeOscilator = indicator.getVolumeOscilator();
                const volumeOscilatorValue = volumeOscilator[volumeOscilator.length - 1];
                if(
                    rsi_short[rsi_short.length - 1] > 65 &&
                    rsi_long[rsi_long.length - 1] > 60 &&
                    mfi_short[mfi_short.length - 1] > 50 &&
                    lastCandle.bullish === true &&
                    volumeOscilatorValue > 0
                ) {
                    patternMatch = true;
                }
                /*let patternMatch = false;
                if (indicator.isInvertedHammer()) {
                    const volumeOscilator = indicator.getVolumeOscilator();
                    const volumeOscilatorValue = volumeOscilator[volumeOscilator.length - 1];
                    const volumeOscilatorValuePre = volumeOscilator[volumeOscilator.length - 2];
                    if(volumeOscilatorValuePre > 20 && volumeOscilatorValue < 0) {
                        patternMatch = true;
                    }    
                }*/
        
        
                // Future
                if(patternMatch === true) {
                    const position = lastCandle.pos;
                    const pastCandle = data[position - 1];
                    const pastCandle2 = data[position - 2];
                    const pastCandle3 = data[position - 3];
                    const pastCandle4 = data[position - 10];

                    const futureCandle = data[position + 1];
                    const futureCandle2 = data[position + 2];
                    const futureCandle3 = data[position + 3];
                    const futureCandle4 = data[position + 10];
        
                    console.table({
                        "pC4": pastCandle4,
                        "pC3": pastCandle3,
                        "pC2": pastCandle2,

                        "pC": pastCandle,

                        "lC": lastCandle,
                        "fC": futureCandle,
                        "fC2": futureCandle2,
                        "fC3": futureCandle3,
                        "fC4": futureCandle4,

                    }
                    );
        
                    if(lastCandle.close < futureCandle4.close) {
                        console.log("Ha subido el precio");
                        subidaPrecio++;
                    } else {
                        console.log("Ha bajado el precio");
                        bajadaPrecio++;
                    }
            
                } 
        
            }
                
        });
    }

    

    console.table(
        [
            {"subidaPrecio": subidaPrecio, "bajadaPrecio": bajadaPrecio},
        ]
    );

    console.table(
        [
            {"subidaPrecio%": (subidaPrecio ) / (bajadaPrecio + subidaPrecio), "bajadaPrecio%": (bajadaPrecio) / (subidaPrecio + bajadaPrecio)}
        ]
    );
    
}
