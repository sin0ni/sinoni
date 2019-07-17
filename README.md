# Sinoni for NodeJS

<p align="center">
    <img src="https://raw.githubusercontent.com/sin0ni/sinoni/master/logo.png" width="400">
</p>

### Installation
```
npm i sinoni
```

### Usage

```javascript
const sinoni = require('sinoni');

sinoni({
    token: "8aee7ab77891731083d21b853d6ef12ca044beff",
    text: "Your article",
    lang: "en"
}).then(res => {
    console.log(res.rewrite); // Your rewrite
    
    // If after 5 minutes you do not get the result,
    // the check is terminated.
    console.log(res); //=> {"token": "XXX", "id": "YYY"}
}).catch(console.error);
```

EN: https://rewriter.tools/en/api.html

RU: https://sinoni.men/ru/api.html

###### 2019, Sinoni