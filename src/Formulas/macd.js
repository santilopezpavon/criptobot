function isOverBiddenByMacd(indicator) {
    const mcd = indicator.getMacd();

    if(
        mcd[mcd.length - 1].histogram > 0 &&
        mcd[mcd.length - 2].signal > mcd[mcd.length - 2].MACD &&
        mcd[mcd.length - 1].signal < mcd[mcd.length - 1].MACD &&
        mcd[mcd.length - 1].MACD > 0 
        ) {
            return true;
    }

    return false;
}

function isOverBiddenByMacdRsi(indicator) {
    const mcdRsiShort = indicator.macdRsi("close", 6);
    const mcdRsiLong = indicator.macdRsi("close", 40);
    if(
        mcdRsiShort[mcdRsiShort.length - 1] > 80 &&
        mcdRsiLong[mcdRsiLong.length - 1] > 60

        ) {
            return true;
    }

    return false;
}

function isDivergenceMacd(indicator) {
    const closeMacd = indicator.getMacd();
    const data = indicator.getData();
    

    const rsi = indicator.getRsi(10);
    const longRsi = rsi.length - 1;

    let initPosition = null;
    let lasPosition = null;


    if(closeMacd[closeMacd.length - 1].MACD <= 0 ) {
        return false;
    }

    for (let j = longRsi; j >= 0; j--) {
        if(j === longRsi && rsi[j] > 70 && rsi[j] > rsi[j-1] && lasPosition == null) {
            lasPosition = j;
            j = j - 10;
        }

        if(rsi[j] > 70 && rsi[j] > rsi[j-1] && initPosition == null) {
            initPosition = j;
            break;
        }            
    }

    if(initPosition == null  || lasPosition == null) {
        return false;
    }

    let diff = closeMacd.length - rsi.length;
    let diff2 = data["close"].length - rsi.length;

    if(
        closeMacd[lasPosition + diff] && 
        closeMacd[initPosition + diff] && 
        data["close"][lasPosition + diff2] && 
        data["close"][initPosition + diff2]) {
            const lastValueMacd = closeMacd[lasPosition + diff].MACD;
            const initValueMacd = closeMacd[initPosition + diff].MACD;
        
            const lastValueClose = data["close"][lasPosition + diff2];
            const initValueClose = data["close"][initPosition + diff2];     
         
        
            if(
                lastValueClose > initValueClose && 
                lastValueMacd < initValueMacd
                ) {
                    return true;
            }
    }

    
    return false;
}

module.exports = {isOverBiddenByMacd, isDivergenceMacd, isOverBiddenByMacdRsi}