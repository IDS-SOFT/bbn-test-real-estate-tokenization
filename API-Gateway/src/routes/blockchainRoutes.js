const express = require('express');
const router = express.Router();
const {
    distributeDividends,
    withdrawDividends,
    transferTokens
} = require('../controllers/blockchainController');

// Route to handle the distribution of dividends
router.post('/distribute-dividends', distributeDividends);

// Route to handle withdrawal of dividends
router.post('/withdraw-dividends', withdrawDividends);

// Route to handle token transfer
router.post('/transfer-tokens', transferTokens);

module.exports = router;
