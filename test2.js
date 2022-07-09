const {BotOrderBook} = require("./src/Bot/BotOrderBook");

const borOrderBook = new BotOrderBook("DOT", "BUSD", "15m");
borOrderBook.getMarketInfo().then(function (res) {
    console.log(res);
});


/*const getCoinsInformation  = require("./src/Connector/CoinsInformation");
const coinInfo = getCoinsInformation();

let pair = null;
if(process.argv.length > 2) {
    pair = process.argv[2];
}

init(pair);

async function init(pair) {
    const book = await coinInfo.getBookOrder(pair, 5000);
    const historical = await coinInfo.getHistoricalData(pair, "15m");

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
    console.log(oferta.length);
    console.log(volumenMedio);
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

    console.table(
        {
            "Mean Volume": volumenMedio,
            "Max Price": precioOferta,
            "Min Price": precioDemanda,
            "Current Price": precioCierre,
            "Normalize Price": normalizado,
            "Profit potencial": ((precioOferta - precioDemanda) / precioDemanda) * 100
        }
    );






}
*/