const express = require('express');
const { ArduinoData } = require('./serial')
const router = express.Router();


router.get('/', (request, response, next) => {

    let sum = ArduinoData.List.reduce((a, b) => a + b, 0);

    response.json({
        data: ArduinoData.List,
        total: ArduinoData.List.length,
        sum: isNaN(sum) ? 0 : sum
    });

});

module.exports = router;