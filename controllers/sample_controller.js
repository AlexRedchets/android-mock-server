const fs = require('fs');

const getAccounts = (req, res, next) => {
    fs.readFile('./responses/accounts.json', (err, data) => {
        if (err) throw err;
        let account = JSON.parse(data);
        res.send(account);
      });
};

const getOrders = (req, res, next) => {
    fs.readFile('./responses/orders.json', (err, data) => {
        if (err) throw err;
        let order = JSON.parse(data);
        res.send(order);
      });
};

const getChart = (req, res, next) => {
    fs.readFile('./responses/chart.json', (err, data) => {
        if (err) throw err;
        let chart = JSON.parse(data);
        res.send(chart);
      });
};

module.exports = {
    getAccounts,
    getOrders,
    getChart
};