
/*const Bot = require("./src/Bot/Bot");

const bot = new Bot();
bot.init();*/


const getCoinsInformation = require("./src/Connector/CoinsInformation");
const conection = getCoinsInformation();


setTimeout(async function () {
    console.log("GLMRBUSD");
    await conection.getFilters("GLMRBUSD").then(function (res) {
        let truncate = {
            "price": 0,
            "qty": 0
        };

        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            if(element.filterType == 'PRICE_FILTER') {
                let tickSize = element.tickSize;
                let decimals = tickSize.split(".");
                let position = 0;
                for (let j = 0; j < decimals[1].length; j++) {
                    if(decimals[1][j] == '1') {
                        position = j + 1;
                        break;
                    }                    
                }
                truncate["price"] = position;
            }

            if(element.filterType == 'LOT_SIZE') {
                let tickSize = element.stepSize;
                let decimals = tickSize.split(".");
                let position = 0;
                for (let j = 0; j < decimals[1].length; j++) {
                    if(decimals[1][j] == '1') {
                        position = j + 1;
                        break;
                    }                    
                }
                truncate["qty"] = position;
            }
            
        }

        console.log(truncate);
    });
    /*console.log("DOTBUSD");
    await conection.getFilters("DOTBUSD").then(function (res) {
        console.log(res);
    });*/
    
});



/*const getCoinsInformation = require("./src/Connector/CoinsInformation"); 
const getAccount = require("./src/Account/Account"); 

const coinInformation = getCoinsInformation();

const account = getAccount().getStockOf("DOT").then(async function (qty){
    const total = await coinInformation.getTotalValueAsset("DOT", qty);
    console.log(total);
});*/

