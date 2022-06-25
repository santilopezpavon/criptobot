function isDivergenceRSI(indicator) {
    const data = indicator.getData();
    

    const rsi = indicator.getRsi(10);
    const rsi_long = indicator.getRsi(40);
    const longRsi = rsi.length - 1;

    let initPosition = null;
    let lasPosition = null;


   

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


    let diff = rsi_long.length - rsi.length;
    let diff2 = data["close"].length - rsi.length;

    const lastValueMacd = rsi_long[lasPosition + diff];
    const initValueMacd = rsi_long[initPosition + diff];

    const lastValueClose = data["close"][lasPosition + diff2];
    const initValueClose = data["close"][initPosition + diff2];
   /* console.log("---");
    console.log(rsi_long.length);
    console.log(lasPosition);
    console.log(lastValueMacd);
    console.log(initValueMacd);*/

    if(
        lastValueClose > initValueClose && 
        lastValueMacd < initValueMacd
        ) {
            return true;
    }
    return false;
}
module.exports = {isDivergenceRSI}