function rsiVol(indicator, period = 16, signal = 70){
    const data = indicator.getData()["volume"];
    const rsi = indicator.getRsi(period, data);
    if(rsi[rsi.length -1] > signal) {
        return true;
    }
    return false;
}

module.exports = {rsiVol}