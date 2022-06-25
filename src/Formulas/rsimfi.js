function rsimfi(
    indicator,
    rsi_short_period = 6,
    mfi_short_period = 6,
    rsi_long_period = 40,
    volumeOscilatorValueIsGreatherThan = 0,
    isBullish = true
) {
    const lastCandle = indicator.getLastCandle();
    const rsi_short = indicator.getRsi(rsi_short_period);
    const mfi_short = indicator.getMfi(mfi_short_period);
    const rsi_long = indicator.getRsi(rsi_long_period);
    const volumeOscilator = indicator.getVolumeOscilator();
    const volumeOscilatorValue = volumeOscilator[volumeOscilator.length - 1];
    if(
        rsi_short[rsi_short.length - 1] > 65 &&
        rsi_long[rsi_long.length - 1] > 60 &&
        mfi_short[mfi_short.length - 1] > 65 &&
        lastCandle.bullish === isBullish &&
        volumeOscilatorValue > volumeOscilatorValueIsGreatherThan
    ) {
        return true;
     }
     return false;
}

module.exports = {rsimfi}