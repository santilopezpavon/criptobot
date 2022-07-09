let first = null;
let second = null;

let checked = false;
if(process.argv.length > 3) {
    first = process.argv[2];
    second = process.argv[3];
    checked = true;
} else {
    console.log("Faltan parametros");
}

if(checked === true) {
    const {BotOrderBook} = require("./src/Bot/BotOrderBook");

    const borOrderBook = new BotOrderBook(first, second, "15m");
    borOrderBook.init();
}
