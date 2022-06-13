# Description

This is a Boot for trading with cripto.

# Configuration

Rename the config.example.json to config.json, this is the configuration file.

```js
{
    "information": {
        "urlbaseapi": "https://api.binance.com/api/v1/" // The URL from the boot get the market information. This parameter from the moment is fixed.
    },
    "email": {
        "user": "user smtp", // The user SMTP
        "pass": "password smtp", // The password SMTP
        "to": "email destination", // Email destination of notifications
        "from": "Name from email <email from>", // Email from appears in email        
        "active": true // Active or disable the email service
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
            "second": "BUSD"
        }
    }       
}

```
# Use

For launch

```bash
node runbot.js
```

# Versions

v1.0.0
The boot detect oportunities of oversold, when the cripto is in this state the boot will send an email, with the price of shell and the price of buyback for acumulation.


