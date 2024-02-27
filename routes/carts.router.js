import { Router } from "express";
import { CartManagerMongo } from "../dao/models/controllers/CartManagerMongo.js";
import { ProductManagerMongo } from "../dao/models/controllers/ProductManagerMongo.js";


const cartRouter = Router()
const c = new CartManagerMongo()
const p = new ProductManagerMongo()

cartRouter.get ("/", async (req, res) => {
    try {
        let result = await c.getCarts()
        res.send ({result: "success", payload: result})
    } catch (error){
        console.error ("error en cargar los carritos", error)
    }
})


cartRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await c.getCart(cid);
        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send({ error: error.message });
    }
});


cartRouter.post ("/", async (req, res) => {
    let result = await c.addCart ()
    res.send ({result: "success", payload: result})
})

cartRouter.post ("/:cid/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params;
        
        let result = await c.addToCart (cid, pid)
        
        res.send ({result: "success", payload: result})
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
    }
    
})

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const result = await c.updateProductQuantity(cid, pid, quantity);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
        res.status(500).send({ error: error.message });
    }
});

cartRouter.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await c.updateCart(cid);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).send({ error: error.message });
    }
});

cartRouter.delete("/:cid/products/:pid", async(req, res) => {
    let {cid, pid} = req.params 
    let result = await c.deleteProduct(pid, cid) 
    res.send ({result:"success", payload: result})
})


cartRouter.delete("/:cid", async(req, res) => {
    try {
        const { cid } = req.params;
        const result = await c.deleteAllProducts(cid);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).send({ error: error.message });
    }
});


export default cartRouter