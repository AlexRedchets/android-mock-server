const express = require('express');
const controller = require('../controllers/sample_controller');
const router  = express.Router();

router.get('/accounts', controller.getAccounts);
router.get('/chart', controller.getChart);
router.get('/orders', controller.getOrders);

router.get('/', (req, res) => {
    res.send('SWM Mock server is running!');
})

module.exports = router;
