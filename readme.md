# Description

This is a Boot for trading with cripto.

# Configuration

Rename the config.example.json to config.json, this is the file of configuration.

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
    }      
}

```
# Use

In the index JS.
```js
// Import the boot.
const Bot = require("./src/Bot/Bot");

// Instance the boot with the pair and the time in minutes that the boot wait for resend and email after send one.
const bot = new Bot("DOTBUSD", 30);
// Init the interval to see the market, the parameter is the time in second of the interval to see the market.
bot.init(10);

```

# Versions

v1.0.0
The boot detect oportunities of oversold, when the cripto is in this state the boot will send an email, with the price of shell and the price of buyback for acumulation.


