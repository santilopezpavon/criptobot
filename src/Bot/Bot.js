const getCoinsInformation = require("../Connector/CoinsInformation");
const getIndicator = require("./../../src/Indicators/Indicator");
const getComunication = require("./../../src/Communication/Communication");
const getAccount = require("./../../src/Account/Account"); 
const getOperations = require("./../../src/Operations/Operations"); 
const configuration = require("../../config.json");

class Bot {

    #coinsInfo = getCoinsInformation();

    #indicator = getIndicator();

    #comunication = getComunication();

    #account = getAccount();

    #timeactionSell = null;

    #timeactionBuy = null;

    #operations = getOperations();

    constructor() {
        this.asset = configuration.analize.asset.first;
        this.pair = configuration.analize.asset.first + "" +  configuration.analize.asset.second;
        this.timetoresendminutes = 30;
        this.timetoresendminutesbuy = 2;
        this.timeIntervalMinutes = 3;
    }


    /**
     * 
     * @param {int} timeInterval in seconds
     */
    init() {
        const current = this;
        current.#action();
        setInterval(function () {
            current.#action();
        }, current.timeIntervalMinutes * 60 * 1000);
    }

    async #sell() {
        let doAction = false;
        const current = this;

        if (current.#timeactionSell == null || current.#timeactionSell <= Date.now()) {
            doAction = true;
        }

        if (doAction == false) {
            return false;
        }
        
        
        

        console.log("Voy a revisar una acción de Venta");

        this.#coinsInfo.getHistoricalData(this.pair, "3m").then(async function (data) {
            current.#indicator.setData(data);
            
            if (current.#isUpperShell() == false) {                
                return false; 
            }
            console.log("Sobreventa!!!");

            console.log("Voy a mirar si hay Stock para vender");

                // ¿Hay Stock?
                const qty = await current.#getQty();            
                if(qty == false) { return false;}


            current.#timeactionSell = Date.now() + (current.timetoresendminutes * 60 * 1000);

            

            // ¿Hay Suficiente Stock?
            const value = await current.#coinsInfo.getTotalValueAsset(current.asset, qty);
            if(value < 11) { return false;}

            // Hacer la venta 
            console.log("Voy a hacer la venta");
            const price_close = data[data.length - 1]["close"];
            const recompra = price_close - (price_close * 0.01);
            current.#operations.sellOperation(
                {
                    "priceReBuy": recompra,
                    "priceSell": price_close,
                    "qty": qty,
                    "pair": current.pair,
                    "totalSell": price_close * qty
                }
            ); 
            
            console.log("Venta hecha");
            console.log({
                "priceReBuy": recompra,
                "priceSell": price_close,
                "qty": qty,
                "pair": current.pair,
                "totalSell": price_close * qty
            });
        });
    }

    async #buy() {
        const current = this;

        let doAction = false;

        if (current.#timeactionBuy == null || current.#timeactionBuy <= Date.now()) {
            doAction = true;
        }

        if (doAction == false) {
            return false;
        }

        console.log("Voy a revisar una acción de Compra");

        // Hay operaciones pendinetes?
        const pendingResponse = current.#operations.getPendingOperations(); 
        if(current.#operations.getPendingOperations() === false) {
            return false;
        }

        // Actualizar la operación
        await current.#operations.updateMemoryOperation();
        console.log("He actualizado la memoria");

        const isPendingOperationFilled = current.#operations.isPendingOperationFilled(); 
        current.#timeactionBuy = Date.now() + (current.timetoresendminutesbuy * 60 * 1000);

        if(isPendingOperationFilled == false) {
            return false; 
        }

        console.log("Puedo comprar!!!");

        const pendingOperationFilled = current.#operations.getFileOperation(); 
        console.log(pendingOperationFilled);

        const dataSell = pendingOperationFilled.dataSellOperation;

        const buyPrice = dataSell.priceReBuy;
        const pairBuy = dataSell.pair;
        const qtyBuy = dataSell.totalSell / buyPrice;

        current.#operations.buyOperation(
            {
                "priceBuy": buyPrice,
                "qty": qtyBuy,
                "pair": pairBuy,
            }
        );  

        console.log("He comprado");
        console.log({
            "priceBuy": buyPrice,
            "qty": qtyBuy,
            "pair": pairBuy,
        });




        // Checkear el Estado real de la operacion.
     /*   const symbol = pendingResponse.symbol;
        const orderId = pendingResponse.orderId;

        const operationUpdated = await current.#operations.getOrderById(symbol, orderId);



        console.log(pendingResponse);
        console.log(operationUpdated);*/

    }

    #action() {
        
        this.#sell();

        this.#buy();

        /*let doAction = false;
        const current = this;

        if (current.#timeaction == null || current.#timeaction <= Date.now()) {
            doAction = true;
        }

        if (doAction == false) {
            return false;
        }

        this.#coinsInfo.getHistoricalData(this.pair, "3m").then(async function (data) {
            current.#indicator.setData(data);
            
            if (current.#isUpperShell() == false) {
                //return false; // TODO: UNCOMMENT
            }

            current.#timeaction = Date.now() + (current.timetoresendminutes * 60 * 1000);

            // ¿Hay Stock?
            const qty = await current.#getQty();            
            if(qty == false) { return false;}

            // ¿Hay Suficiente Stock?
            const value = await current.#coinsInfo.getTotalValueAsset(current.asset, qty);
            if(value < 11) { return false;}

            // Hacer la Venta


            console.log(value);
            

            
            const price_close = data[data.length - 1]["close"];
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

        });*/
    }

    async #getQty() {
        return await this.#account.getStockOf(this.asset);
    }

    #isUpperShell() {
        const mfi_long = this.#indicator.getMfi(50);
        const rsi_long = this.#indicator.getRsi(50);

        const mfi_short = this.#indicator.getMfi(16);
        const rsi_short = this.#indicator.getRsi(16);

        console.log(mfi_short[mfi_short.length - 1], rsi_short[rsi_short.length - 1]);
       
        if (
            mfi_short[mfi_short.length - 1] > 60 &&
            rsi_short[rsi_short.length - 1] > 60
        ) {
            return true;
        }
        return false;
    }


}

module.exports = Bot;

