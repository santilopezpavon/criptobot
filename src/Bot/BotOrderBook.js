const getCoinsInformation = require("../Connector/CoinsInformation");
const getAccount = require("./../../src/Account/Account"); 
const getConnectionSpot = require("./../../src/Connector/ConnectorSpot");
const getFilesService = require("./../../src/Memory/Memory");

class BotOrderBook {
    
    #pair;

    #time;

    #coinsInfo;

    #firstCoin;

    #secondCoin;

    #truncates;

    #account = getAccount();

    #client;

    #memory;

    #timeactionSell;

    #timeactionBuy;


    constructor(firstCoin, secondCoin, time) {
        this.#pair = firstCoin + secondCoin;
        this.#firstCoin = firstCoin;
        this.#secondCoin = secondCoin;
        this.#time = time;
        this.#coinsInfo = getCoinsInformation();
        this.#truncates = {}
        this.#client = getConnectionSpot();
        this.#memory = getFilesService(this.#pair + time + "botorders");
        
        this.timeIntervalMinutes = 1;
        this.timetoresendminutes = 30;
        this.timetoresendminutesbuy = 2;

        this.#timeactionSell = null;
        this.#timeactionBuy = null;
        
    }

    async init() {
        const current = this;
        await this.#coinsInfo.getTruncates(this.#pair).then(function (res) {
            current.#truncates = {
                price: res.price,
                qty: res.qty
            };
        });  

        current.action();
        setInterval(function () {
            current.action();
        }, current.timeIntervalMinutes * 60 * 1000);
        
    }


    async action() {
        this.sell();
        this.buy();
    }



    async buy() {
        console.log("Voy a revisar acción de Compra");
        const current = this;

        let doAction = false;
        if (current.#timeactionBuy == null || current.#timeactionBuy <= Date.now()) { doAction = true;}

        if (doAction === true) {       
            console.log("Voy a revisar la memoria");
            // Cargar ordenes pendientes en memoria.
            const file = current.#memory.loadFileCheckEmpty(); 

            if(file == false) { return false;}

            // Actualizar la Memoria
            const responseUpdate = await current.#client.getOrder(file.symbol, {
                orderId: file.orderId
            }).then(function (response) {
                return response.data;
            }).catch(function (error) {
                return false;
            })
            
            if(responseUpdate == false) { return false;}
            current.#memory.saveFile(responseUpdate);
            current.#timeactionBuy = Date.now() + (current.timetoresendminutesbuy * 60 * 1000);
        }

        // Saber si está Filled.
        const fileUpdated = current.#memory.loadFileCheckEmpty(); 
        if(fileUpdated.status !== "FILLED") { return false; }

        // Observar el mercado
        const inforMarket = await this.getMarketInfo();

        const originQty = fileUpdated.origQty;

        const originPrice = fileUpdated.price;
        const normPrice20 = inforMarket["normPrice20"];
        const normPrice30 = inforMarket["normPrice30"];
        const minPrice = inforMarket["Min Price"];

        const rentabilidad = (originPrice - minPrice) / minPrice;
        const rentabilidad20 = (originPrice - normPrice20) / normPrice20;
        const rentabilidad30 = (originPrice - normPrice30) / normPrice30;


        let priceBuyCalculate = false;

        if( rentabilidad30 < originPrice && rentabilidad30 > 0.03) {
            priceBuyCalculate = rentabilidad30;
        } else if( rentabilidad20 < originPrice && rentabilidad20 > 0.03) {
            priceBuyCalculate = rentabilidad20;
        } else if( rentabilidad < originPrice && rentabilidad > 0.03) {
            priceBuyCalculate = rentabilidad;
        }

        
        if(priceBuyCalculate === false) {
            return false;
        }



        console.log("Preparar acción de Compra");


        const order = {
            "price": this.#truncate(priceBuyCalculate, "price"), 
            "quantity": this.#truncate(originQty, "qty"),
            "timeInForce": "GTC"
        };

        const orderBuy = await this.#client.newOrder(current.#pair, "BUY", 'LIMIT', order).then(function (response) {   
            current.#memory.saveFile({});      
            return response;
        }).catch(function (error) {
            return false;
        });                  
    }



    async sell() {
        console.log("Voy a revisar acción de venta");
        const current = this;
        let doAction = false;

        if (current.#timeactionSell == null || current.#timeactionSell <= Date.now()) { doAction = true; }
        if (doAction == false) {return false;}



        const inforMarket = await this.getMarketInfo();
        
        // Posibilidad de mercado para vender.
        if(
            inforMarket["Profit potencial min 2"] < 0.80) {
            return false;
        }

        let precioVenta = false;
        if(
            inforMarket["Current Price"] < inforMarket["normPrice70"]
        ) {
            precioVenta = inforMarket["normPrice70"];
        } else if(
            inforMarket["Current Price"] < inforMarket["normPrice80"]
        ) {
            precioVenta = inforMarket["normPrice80"];
        } else if(
            inforMarket["Current Price"] < inforMarket["Max Price"]
        ) {
            precioVenta = inforMarket["Max Price"];
        }

        

        

        if(precioVenta === false) {
            return false;
        }

        
        // Stock Para hacer la venta.
        const qty = await this.#account.getStockOf(this.#firstCoin);
        if(qty == false) { return false;}

        const value = await this.#coinsInfo.getTotalValueAsset(this.#firstCoin, qty);
        if(value < 10) { return false;}

        current.#timeactionSell = Date.now() + (current.timetoresendminutes * 60 * 1000);   

        // Preparar Acción de Venta

        console.log("Hay Stock, voy a hacer una orden de venta");
        const order = {
            "price": this.#truncate(precioVenta, "price"), 
            "quantity": this.#truncate(qty, "qty"),
            "timeInForce": "GTC"
        };

        const dataOrderSell = await this.#client.newOrder(current.#pair, "SELL", 'LIMIT', order).then(function (response) {   
               
            return response.data;
        }).catch(function (error) {
            console.log(error);
            return false;
        });       
        current.#memory.saveFile(dataOrderSell);      
    }

    #truncate(value, type) {

        let place = this.#truncates.price;
        if(type == 'qty') {
            place = this.#truncates.qty;
        } 
        return Math.trunc(value * Math.pow(10, place)) / Math.pow(10, place);
    }


    async getMarketInfo() {
        const book = await this.#coinsInfo.getBookOrder(this.#pair, 5000);
        const historical = await this.#coinsInfo.getHistoricalData(this.#pair, this.#time);

        const demanda = book.bids;
        const oferta = book.asks;
    
        const historicalReverted = historical.reverse();
        const precioCierre = historicalReverted[0].close;
        let volumenMedio = 0;
    
        for (let i = 0; i <= 6; i++) {
            volumenMedio += historicalReverted[i].volume;        
        }
    
        volumenMedio = (volumenMedio / 6);

        let initVolumenDemanda = volumenMedio;
        let initVolumenOferta = volumenMedio;


        let precioOferta = 0;
        let precioDemanda = 0;
        for (let i = 0; i < demanda.length; i++) {
            const volumenAPrecio = parseFloat(demanda[i][1])
            const precioAVolumen = parseFloat(demanda[i][0]);
            initVolumenDemanda = initVolumenDemanda - volumenAPrecio;
            if(initVolumenDemanda <= 0) {
                precioDemanda = precioAVolumen;
                break;
            }    
        }    
    
        for (let i = 0; i < oferta.length; i++) {
            const volumenAPrecio = parseFloat(oferta[i][1])
            const precioAVolumen = parseFloat(oferta[i][0]);    
            initVolumenOferta = initVolumenOferta - volumenAPrecio;            
            if(initVolumenOferta <= 0) {
                precioOferta = precioAVolumen;
                break;
            }    
        }    
    
        const normalizado = (precioCierre - precioDemanda)/(precioOferta - precioDemanda);
        const normPrice20 = 0.2 * (precioOferta - precioDemanda) + precioDemanda;
        const normPrice80 = 0.80 * (precioOferta - precioDemanda) + precioDemanda;
        const normPrice30 = 0.3 * (precioOferta - precioDemanda) + precioDemanda;
        const normPrice70 = 0.70 * (precioOferta - precioDemanda) + precioDemanda;


        return {
            "Mean Volume": volumenMedio,
            "Max Price": precioOferta,
            "Min Price": precioDemanda,
            "Current Price": precioCierre,
            "Normalize Price": normalizado,
            "Profit potencial": ((precioOferta - precioDemanda) / precioDemanda) * 100,
            "normPrice20": normPrice20,
            "normPrice30": normPrice30,
            "normPrice80": normPrice80,
            "normPrice70": normPrice70,
            "Profit potencial min": ((normPrice80 - normPrice20) / normPrice20) * 100,
            "Profit potencial min 2": ((normPrice70 - normPrice30) / normPrice30) * 100,
        };
    }
}
module.exports = {BotOrderBook}