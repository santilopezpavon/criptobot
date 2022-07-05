const technicalIndicators = require("technicalindicators");
const tulind = require('tulind');
const cs = require('candlestick');
const {getIndicatorMedian} = require('../Strategies/MedianStrategy');
const {getIndicatorVolumeProfileStrategy} = require('../Strategies/VolumeProfileStrategy');
const {getIndicatorRSIStrategy} = require('../Strategies/RSIStrategy');


function getIndicator() {
    return Indicator.getInstance();
}

class Indicator {

    static #instance;
    
    #data;

    #dataIni;

    medianStrategy;

    volumeProfileStrategy;

    rsiStrategy;

    static getInstance() {
        if (!Indicator.#instance) {
            Indicator.#instance = new Indicator()
        }
        return Indicator.#instance
    }

    setData(data) {
        this.#dataIni = data;
        this.#data = this.#prepareData(data);
        this.medianStrategy = getIndicatorMedian(this.#dataIni, this.#data);
        this.volumeProfileStrategy = getIndicatorVolumeProfileStrategy(this.#dataIni, this.#data);
        this.rsiStrategy = getIndicatorRSIStrategy(this.#dataIni, this.#data);
    }

    #prepareData(data) {
        let input = {
            "high": [],
            "low": [],
            "close":[],
            "volume": [],
            "open": [],
            "higherShadow": [],
            "total": [],
            "lowerShadow": []
            //"period": 14
        };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            input["high"].push(element["high"]);
            input["low"].push(element["low"]);
            input["close"].push(element["close"]);
            input["volume"].push(element["volume"]);        
            input["open"].push(element["open"]);      
            input["higherShadow"].push(element["higherShadow"]);
            input["total"].push(element["total"])
            input["lowerShadow"].push(element["lowerShadow"])
        }
        return input;
    }

    getData() {
        return this.#data;
    }

    getDataInit() {
        return this.#dataIni;
    }

    getLastCandle() {
        return this.#dataIni[this.#dataIni.length - 1];
    }

    getParabolicSAR() {
        let resultsReturn = [];
        tulind.indicators.psar.indicator([this.#data["high"], this.#data["low"]], [.02, 2], function(err, results) {
            resultsReturn =  results[0];
        });
        return resultsReturn;
    }


    getADX(period) {
        const inputRSI =  {
            "high": this.#data["close"],
            "low": this.#data["low"],
            "close": this.#data["close"],
            "period": period
        };

        const ADX = technicalIndicators.ADX;
        return ADX.calculate(inputRSI)

    }

    getRsi(period, arrayData = null) {
        if(arrayData == null) {
            arrayData = this.#data["close"];
        }
        const inputRSI =  {
            "values": arrayData,
            "period": period
        };

        const RSI = technicalIndicators.RSI;
       return RSI.calculate(inputRSI)

    }

    getKST() {
        const KST = technicalIndicators.KST;
        return KST.calculate({
            values      : this.#data["close"],
            ROCPer1     : 10,
            ROCPer2     : 15,
            ROCPer3     : 20,
            ROCPer4     : 30,
            SMAROCPer1  : 10,
            SMAROCPer2  : 10,
            SMAROCPer3  : 10,
            SMAROCPer4  : 15,
        })
    } 

    getMfi(period) {
        //his.#data["period"] = period;

        const inputRSI =  {
            "high": this.#data["high"],
            "low": this.#data["low"],
            "close": this.#data["close"],
            "volume": this.#data["volume"],
            "period": period
        };

        const MFI = technicalIndicators.MFI;
       return MFI.calculate(inputRSI)
    }

    getEMAForProperty(property, period) {
        const values = this.#data[property];  
        return technicalIndicators.SMA.calculate({period : period, values : values}); 

    }

  
    getIncrementalVolume(period){
        const volumenEma = this.getEMAForProperty("volume", period);
        let count = 0;
        let incrementalVolume = [];
        for (let index = period - 1; index < this.#data["volume"].length; index++) {
            const element = this.#data["volume"][index];
            incrementalVolume[count] = (element - volumenEma[count]) / volumenEma[count];
            count++;            
        }
        return incrementalVolume;
    }

    getBollingerBands(period) {
        var BB = technicalIndicators.BollingerBands;
        var input = {
            period : period, 
            values : this.#data["close"],
            stdDev : 2
                
        }
        return BB.calculate(input);

    }

    getVolumeOscilator() {
        let resultsReturn = [];
        tulind.indicators.vosc.indicator([this.#data["volume"]], [3, 8], function(err, results) {
            resultsReturn =  results[0];
        });
        return resultsReturn;
    }

    isInvertedHammer() {        
        const lastCandle = this.#dataIni[this.#dataIni.length - 1];
        
        const prevCandle = this.#dataIni[this.#dataIni.length - 2];
        const pastCandle = this.#dataIni[this.#dataIni.length - 5];
        const pastCandle10 = this.#dataIni[this.#dataIni.length - 10];

        if(
            lastCandle["higherShadow"] / lastCandle["total"] > 0.6 &&
            // lastCandle["lowerShadow"] / lastCandle["total"] < 0.15 && 
            //lastCandle["lowerShadow"] <= lastCandle["total"] &&
            //lastCandle["close"] > pastCandle["close"] && 
            lastCandle["close"] > pastCandle10["close"]// && 
            //prevCandle["body"] > lastCandle["total"] * 0.5 &&
           // prevCandle["body"] / prevCandle["total"] > 0.8
            )
        {
            return true;
        }
        return false;

    }

    getPatternsCandle() {
        const dataArray = this.#dataIni;
        const candlePatterns = {
            "hammer": cs.hammer(dataArray),
            "invertedHammer": cs.invertedHammer(dataArray),
            "bullishHammer": cs.bullishHammer(dataArray),
            "bearishHammer": cs.bearishHammer(dataArray),
            "bullishInvertedHammer": cs.bullishInvertedHammer(dataArray),
            "bearishInvertedHammer": cs.bearishInvertedHammer(dataArray),
            "hangingMan": cs.hangingMan(dataArray),
            "shootingStar": cs.shootingStar(dataArray),
            "bullishEngulfing": cs.bullishEngulfing(dataArray),
            "bearishEngulfing": cs.bearishEngulfing(dataArray),
            "bullishHarami": cs.bullishHarami(dataArray),
            "bearishHarami": cs.bearishHarami(dataArray),
            "bullishKicker": cs.bullishKicker(dataArray),
            "bearishKicker": cs.bearishKicker(dataArray)
        };

        return candlePatterns;
    }

    getLastCandlePattern() {
        const patterns = this.getPatternsCandle();
        let lastPos = null;
        let patternLast = false;
        let patternCandle = false;
        for (const key in patterns) {
            if (Object.hasOwnProperty.call(patterns, key)) {
                const element = patterns[key];
                if(element.length > 0 && element[0] != undefined) {
                    for (let index = 0; index < element.length; index++) {
                        const candle = element[index];
                        if(candle.pos > lastPos || lastPos == null) {
                            lastPos = candle.pos;
                            patternLast = key;
                            patternCandle = candle;
                        }
                    }   
                }                
            }
        }

    
        return {
            patternLast: patternLast,
            patternCandle: patternCandle,
            lastPos: lastPos
        };
    }

    isLastPatternLastCandle(candlePattern) {
        const lastCadnle = this.getLastCandle();
        return candlePattern.lastPos === lastCadnle.pos;
    }

    getMacd(prop = "close") {
        const inputRSI =  {
            "values": this.#data[prop],
            fastPeriod        : 12,
            slowPeriod        : 23,
            signalPeriod      : 9 ,
            SimpleMAOscillator: false,
            SimpleMASignal    : false
        };

        const MACD = technicalIndicators.MACD;
       return MACD.calculate(inputRSI)
    
    }

    macdRsi(prop = "close", rsiPeriod = 16) {
        const macd = this.getMacd(prop);
        const arrayData = [];
        for (let index = 0; index < macd.length; index++) {
            if(typeof macd[index].MACD !== 'undefined') {
                arrayData.push(macd[index].MACD);
            }
            
        }
        return this.getRsi(rsiPeriod, arrayData) 
    }

    

    isUpperShell() {      

        const mfi_short = this.getMfi(16);
        const rsi_short = this.getRsi(16);
        if (
            mfi_short[mfi_short.length - 1] > 60 &&
            rsi_short[rsi_short.length - 1] > 60
        ) {
            return true;
        }
        return false;
    }
}

module.exports = getIndicator;

