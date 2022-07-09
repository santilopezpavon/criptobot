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

        this.action();
        setInterval(function () {
            this.action();
        }, current.timeIntervalMinutes * 60 * 1000);
        
    }


    async action() {
        this.sell();
        this.buy();
    }



    async buy() {
        const current = this;

        let doAction = false;
        if (current.#timeactionBuy == null || current.#timeactionBuy <= Date.now()) { doAction = true;}

        if (doAction == true) {       

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
        const minPrice = inforMarket["Min Price"];

        let priceBuyCalculate = false;
        if( minPrice < originPrice) {
            priceBuyCalculate = minPrice;
        }

        if(priceBuyCalculate === false) {
            return false;
        }


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
        const current = this;
        let doAction = false;

        if (current.#timeactionSell == null || current.#timeactionSell <= Date.now()) { doAction = true; }
        if (doAction == false) {return false;}



        const inforMarket = await this.getMarketInfo();
        
        // Posibilidad de mercado para vender.
        if(
            inforMarket["Profit potencial min"] < 0.65 && 
            inforMarket["Normalize Price"] < 0.75
        ) {
            return false;
        }




        // Stock Para hacer la venta.
        const qty = this.#account.getStockOf(this.#firstCoin);
        if(qty == false) { return false;}

        const value = await this.#coinsInfo.getTotalValueAsset(this.#firstCoin, qty);
        if(value < 10) { return false;}

        current.#timeactionSell = Date.now() + (current.timetoresendminutes * 60 * 1000);   

        // Preparar Acción de Venta

        const order = {
            "price": this.#truncate(inforMarket["Max Price"], "price"), 
            "quantity": this.#truncate(qty, "qty"),
            "timeInForce": "GTC"
        };

        this.#client.newOrder(current.#pair, "SELL", 'LIMIT', order).then(function (response) {   
            current.#memory.saveFile(response);      
            return response;
        }).catch(function (error) {
            return false;
        });          
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
        return {
            "Mean Volume": volumenMedio,
            "Max Price": precioOferta,
            "Min Price": precioDemanda,
            "Current Price": precioCierre,
            "Normalize Price": normalizado,
            "Profit potencial": ((precioOferta - precioDemanda) / precioDemanda) * 100,
            "normPrice20": normPrice20,
            "normPrice80": normPrice80,
            "Profit potencial min": ((normPrice80 - normPrice20) / normPrice20) * 100,
        };
    }
}
module.exports = {BotOrderBook}