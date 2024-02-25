import express from 'express';
import { ProductManager } from '../ProductManager.js';

const router = express.Router()

const p = new ProductManager();

router.get('/', async (req, res) => {
    const products = p.getProducts();
    res.render('realTimeProducts', {
        products
    });
});

export default router