# Description

This is a Boot for trading with cripto.

The Philosophy of this is the acumulation (increase the quantity). 

If you Sell and repurchase (with a lower price than price Sell) frequently your Stock will increase with the same inversion. 

# Phases

1. The Boot detect an oversold situation in the Market
2. Next, prepare and Sell Action and calc the price of repurchase from the price of Sell (the repurchase price it's lower than price Sell)
3. Create a Sell Order
4. When the Sell Order it's done, prepare and Buy order with the price of repurchase calculated in the second step.

# Configuration

Rename the config.example.json to config.json, this is the configuration file.

```js
{
    "information": {
        "urlbaseapi": "https://api.binance.com/api/v1/" // The URL from the boot get the market information. This parameter from the moment is fixed.
    },
    "email": {
       "user": "user smtp",
        "pass": "pass smtp",
        "to": "email to send emails",
        "from": "Name from email <email from>",   
        "host": "in-v3.mailjet.com",
        "port" : 587,
        "secure": false,
        "active": true,
        "notification": {
            "operations": true,
            "error": true
        }
    } ,
    "account": {
        "apiKey": "your api key binance",
        "apiSecret": "your api secret binance"
    },
    "operations": { // The values of default for truncate data for sell and buy operations.
        "truncate": {
            "price": 2,
            "qty": 2
        }
    },
    "analize": {
        "asset": {
            "first": "DOT",
            "second": "BUSD",
            "potectedQty": 0
        }
    }      
}

```
# Use

For launch

```bash
node runbot.js
```




