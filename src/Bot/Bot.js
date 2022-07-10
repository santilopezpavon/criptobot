const getCoinsInformation = require("../Connector/CoinsInformation");
const getIndicator = require("./../../src/Indicators/Indicator");
const getAccount = require("./../../src/Account/Account");
const getOperations = require("./../../src/Operations/Operations");
const configuration = require("../../config.json");

class Bot {

    #coinsInfo = getCoinsInformation();

    #indicator = getIndicator();

    #account = getAccount();

    #timeactionSell = null;

    #timeactionBuy = null;

    #operations = getOperations();

    #potectedQty = null;

    #modulesFunctions = {};


    constructor(configurationBot) {
        this.asset = configuration.analize.asset.first;
        this.pair = configuration.analize.asset.first + "" + configuration.analize.asset.second;
        this.timetoresendminutes = 30;
        this.timetoresendminutesbuy = 2;
        this.timeIntervalMinutes = 1;
        this.#potectedQty = configuration.analize.asset.potectedQty;
        this.#modulesFunctions = configurationBot.modulesFunctions;
    }


    /**
     * Function to initialize the Bot.
     * This function runs in interval, and execute the rest of funcionalities.
     */
    async init() {
        const current = this;

        await this.#coinsInfo.getTruncates(configuration.analize.asset.first + configuration.analize.asset.second).then(function (res) {
            current.#operations.setTruncateValues({
                price: res.price,
                qty: res.qty
            });
        });

        current.#action();
        setInterval(function () {
            current.#action();
        }, current.timeIntervalMinutes * 60 * 1000);
    }

    /**
     * This functions verify the posibility of do a Sell Operation, and if is possible
     * runs the operation in Binance account. 
     */
    async #sell() {
        let doAction = false;
        const current = this;

        if (current.#timeactionSell == null || current.#timeactionSell <= Date.now()) { doAction = true; }

        if (doAction == false) { return false; }

        // Mirar si hay operaciones Pendientes. Solo se avanza si no hay.
        if (current.#operations.getPendingOperations() != false) { return false; }

        console.log("Voy a revisar una acción de Venta");

        this.#coinsInfo.getHistoricalData(this.pair, configuration.analize.asset.temporality).then(async function (data) {
            current.#indicator.setData(data);

            let sellFunctionUpper = isUpperSellFunction(current.#indicator);
            if (typeof sellFunctionUpper === 'object') {
                pattern = sellFunctionUpper.upperSell;
            } else {
                pattern = sellFunctionUpper;
            }


            if (pattern == false) {
                return false;
            }
            console.log("Sobreventa!!!");

            console.log("Voy a mirar si hay Stock para vender");

            // ¿Hay Stock?
            let qty = await current.#getQty();
            if (qty == false) { return false; }

            if (current.#potectedQty != 0) { qty = qty - current.#potectedQty; }

            if (qty < 0) { return false; }

            current.#timeactionSell = Date.now() + (current.timetoresendminutes * 60 * 1000);

            // ¿Hay Suficiente Stock?
            const value = await current.#coinsInfo.getTotalValueAsset(current.asset, qty);
            if (value < 10) { return false; }

            // Hacer la venta 
            console.log("Voy a hacer la venta");
            const price_close = data[data.length - 1]["close"] * 1.001;

            let profitClose = null;
            if (typeof sellFunctionUpper === 'object') {
                profitClose = sellFunctionUpper.profit;
            } 

            const recompra = current.#priceToReBuy(price_close, profitClose);


            current.#operations.sellOperation(
                {
                    "priceReBuy": recompra,
                    "priceSell": price_close,
                    "qty": qty,
                    "pair": current.pair,
                    "totalSell": price_close * qty
                }
            );
        });
    }

    /**
     * This functions verify the posibility of do a Buy Operation, and if is possible
     * runs the operation in Binance account. 
     */
    async #buy() {

        const current = this;

        let doAction = false;
        if (current.#timeactionBuy == null || current.#timeactionBuy <= Date.now()) { doAction = true; }

        if (doAction == false) { return false; }

        console.log("Voy a revisar una acción de Compra");

        // Hay operaciones pendinetes?
        if (current.#operations.getPendingOperations() === false) { return false; }

        // Actualizar la operación
        await current.#operations.updateMemoryOperation();
        console.log("He actualizado la memoria");

        const isPendingOperationFilled = current.#operations.isPendingOperationFilled();
        current.#timeactionBuy = Date.now() + (current.timetoresendminutesbuy * 60 * 1000);

        if (isPendingOperationFilled == false) { return false; }

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
    }

    /**
     * Call the sell and buy functions.
     */
    #action() {
        this.#sell();
        this.#buy();
    }


    /**
     * Get the quantity available in the Account.
     * 
     * @returns {number} The quantity in Account.
     */
    async #getQty() {
        return await this.#account.getStockOf(this.asset);
    }

    /**
     * Check using tradings indicators if the Market is UpperShell and have an Sell
     * oportunity.
     * 
     * @returns {bool}
     */
    #isUpperShell() {
        return this.#modulesFunctions.isUpperSellFunction(this.#indicator);
    }

    /**
     * Calculate the price of rebuy operations, starting the priceClose parameter.
     * 
     * @param {float} priceClose. Is the Sell Price, for calculate the Rebuy price.
     * @returns {{rentabilidadMovimiento: number, price: number}} The Object has two properties.
     */
    #priceToReBuy(priceClose, profit = null) {
        if(profit === null) {
            profit = configuration.analize.asset.profit;
        }
        let rentabilidadMovimiento = profit;
        this.rentabilidadMovimiento = rentabilidadMovimiento;
        return priceClose - (priceClose * rentabilidadMovimiento);
    }


}

module.exports = Bot;

