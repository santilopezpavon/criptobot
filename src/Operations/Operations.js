const configuration = require("../../config.json");
const getFilesService = require("./../../src/Memory/Memory");
const getConnectionSpot = require("./../../src/Connector/ConnectorSpot");
const getCoinsInformation = require("./../../src/Connector/CoinsInformation");


function getOperations() {
    return Operations.getInstance();
}

class Operations {

    static #instance;

    #memory;

    #client;


    #qtyTruncate;

    #priceTruncate;

    static getInstance() {
        if (!Operations.#instance) {
            Operations.#instance = new Operations()
        }
        return Operations.#instance
    }

    constructor() {
        this.#memory = getFilesService();
        this.#client = getConnectionSpot();
        
        this.#qtyTruncate = configuration.operations.truncate.qty;
        this.#priceTruncate = configuration.operations.truncate.price;

              
    }

    setTruncateValues(truncateObject) {
        this.#qtyTruncate = truncateObject.qty;
        this.#priceTruncate = truncateObject.price;
    }

    async buyOperation(dataBuyOperation) {
        const current = this;

        dataBuyOperation.priceBuy = this.#truncate(dataBuyOperation.priceBuy, "price");
        dataBuyOperation.qty = this.#truncate(dataBuyOperation.qty, "qty");

        const order = {
            "price": dataBuyOperation.priceBuy, 
            "quantity": dataBuyOperation.qty,
            "timeInForce": "GTC"
        };

        console.log("Order real");
        console.log(order);
        return current.#client.newOrder(dataBuyOperation.pair, "BUY", 'LIMIT', order).then(function (response) {
            current.#memory.saveFile({});            
            return response;
        }).catch(function (error) {
            console.log(error);
            return false;
        });    


    }

    async sellOperation(dataSellOperation) {
        const current = this;

        dataSellOperation.priceSell = this.#truncate(dataSellOperation.priceSell , "price"); 
        dataSellOperation.qty = this.#truncate(dataSellOperation.qty, "qty");

        dataSellOperation.totalSell = dataSellOperation.priceSell * dataSellOperation.qty;

        const order = {
            "price": dataSellOperation.priceSell, 
            "quantity": dataSellOperation.qty,
            "timeInForce": "GTC"
        };

        return current.#client.newOrder(dataSellOperation.pair, "SELL", 'LIMIT', order).then(function (response) {
            current.#memory.saveFile({
                "response": response.data,
                "dataSellOperation": dataSellOperation
            });            
            return response;
        }).catch(function (error) {
            console.log(error);
            return false;
        });     
    }

    getPendingOperations() {
        const file = this.#memory.loadFile();    
        if(this.#isEmpty(file)) {
            return false;
        }
        return file.response;
    }

    getFileOperation() {
        const file = this.#memory.loadFile();    
        if(this.#isEmpty(file)) {
            return false;
        }
        return file;
    }

    isPendingOperationFilled() {
        const pendingOperation = this.getPendingOperations();
        if(pendingOperation == false) {
            return false;
        }
        if(pendingOperation.status === 'FILLED') {
            return true;
        }
        return false;
    }


    async updateMemoryOperation() {
        const operation = this.getPendingOperations();
        if(operation == false) {
            return false;
        }

        const updatedResponse = await this.getOrderById(operation.symbol, operation.orderId);
        if(updatedResponse == false) {
            return false;
        }

        let file = this.#memory.loadFile();    
        file.response = updatedResponse;
        this.#memory.saveFile(file);
        return  this.#memory.loadFile();
    }

    async getOrderById(pair, orderId) {
       return this.#client.getOrder(pair, {
            orderId: orderId
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            console.log(error);
            return false;
        })
    }

    #isEmpty(str) {
        if(!str || str.length === 0 ) {
            return true;
        }
        if(typeof str === 'object' && !str.hasOwnProperty("response")) {
            return true;
        }
        return false;
    }

    #truncate(value, type) {


        let place = this.#priceTruncate;
        if(type == 'qty') {
            place = this.#qtyTruncate;
        } 
        return Math.trunc(value * Math.pow(10, place)) / Math.pow(10, place);
    }

    

    /*async createOrder(order, type = "BUY") {
        if (order) {
            const symbol = order.par;
            delete order.par;
            order["timeInForce"] = "GTC";
            return this.#client.newOrder(symbol, type, 'LIMIT', order).then(function (response) {
                return response;
            }).catch(function (error) {
                console.log(error);
                return error;
            });
        } else {
            return false;
        }
    }*/

   

}
module.exports = getOperations;
