const { ethers, JsonRpcProvider } = require('ethers');
require('dotenv').config();
const contractABI = require('../abi/real_estate_token.sol/RealEstateToken.json');  // Ensure you have the ABI in your project

console.log(process.env.RPC_URL);
// Set up wallet and provider
const provider = new JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, wallet);

exports.distributeDividends = async (req, res) => {
    const { amount } = req.body;
    try {
        const transaction = await contract.distributeDividends({ value: ethers.utils.parseEther(amount) });
        const result = await transaction.wait();
        res.json({ message: 'Dividends distributed', transaction: result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.withdrawDividends = async (req, res) => {
    try {
        const transaction = await contract.withdrawDividends();
        const result = await transaction.wait();
        res.json({ message: 'Dividends withdrawn', transaction: result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.transferTokens = async (req, res) => {
    const { to, amount } = req.body;
    try {
        const transaction = await contract.transfer(to, parseInt(amount));
        const result = await transaction.wait();
        res.json({ message: `Transferred ${amount} tokens to ${to}`, transaction: result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
