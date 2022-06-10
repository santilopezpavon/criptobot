const getConnection = require("./../../src/Connector/Connector");
const getIndicator = require("./../../src/Indicators/Indicator");
const getComunication = require("./../../src/Communication/Communication");

class Bot {

    #conection = getConnection();

    #indicator = getIndicator();

    #comunication = getComunication();

    #timeaction = null;

    constructor(pair, timetoresendminutes) {
        this.pair = pair;
        this.timetoresendminutes = timetoresendminutes;
    }


    /**
     * 
     * @param {int} timeInterval in seconds
     */
    init(timeInterval) {
        const current = this;
        current.#action();
        setInterval(function () {
            current.#action();
        }, timeInterval * 1000);
    }


    #action() {
        let doAction = false;
        const current = this;

        if (current.#timeaction == null || current.#timeaction <= Date.now()) {
            doAction = true;
        }

        if (doAction == false) {
            return false;
        }


        this.#conection.getHistoricalData(this.pair, "3m").then(function (data) {
            current.#indicator.setData(data);


            const price_close = data[data.length - 1]["close"];


            if (current.#isUpperShell() == true) {
                const recompra = price_close - (price_close * 0.01);
                console.log(
                    {
                        price: price_close,
                        upperShell: current.#isUpperShell()
                    }

                );


                current.#comunication.sendEmail(
                    "Oportunidad de compra " + current.pair,
                    current.pair + " a precio " + price_close + " para recomprar a " + recompra

                );
                current.#timeaction = Date.now() + (current.timetoresendminutes * 60 * 1000);

            }
        });
    }

    #isUpperShell() {
        const mfi_long = this.#indicator.getMfi(50);
        const rsi_long = this.#indicator.getRsi(50);

        const mfi_short = this.#indicator.getMfi(16);
        const rsi_short = this.#indicator.getRsi(16);

        /*console.log(mfi_long[mfi_long.length - 1]);
        console.log(rsi_long[rsi_long.length - 1]);
        console.log(mfi_short[mfi_short.length - 1]);
        console.log(rsi_short[rsi_short.length - 1]);*/

        if (
         //   mfi_long[mfi_long.length - 1] > 50 &&
           // rsi_long[rsi_long.length - 1] > 50 &&
            mfi_short[mfi_short.length - 1] > 60 &&
            rsi_short[rsi_short.length - 1] > 60
        ) {
            return true;
        }
        return false;


    }


}

module.exports = Bot;

