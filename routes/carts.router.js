import { Router } from "express";
import { CartManagerMongo } from "../../dao/models/controllers/CartManagerMongo.js";

const cartRouter = Router()
const cartMM = new CartManagerMongo()

cartRouter.get ("/", async (req, res) => {
    try {
        let result = await cartMM.getCarts()
        res.send ({result: "success", payload: result})
    } catch (error){
        console.error ("error en cargar los carritos", error)
    }
})

cartRouter.get ('/:cid', async (req, res)=>{
    let {cid} = req.params
    let result = await cartMM.getCart(cid)
    res.send ({result: "success", payload: result})
})

cartRouter.post ("/", async (req, res) => {
    let result = await cartMM.addCart ()
    res.send ({result: "success", payload: result})
})

cartRouter.post ("/:cid/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params;
        
        let result = await cartMM.addToCart (cid, pid)
        
        res.send ({result: "success", payload: result})
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
    }
    
})

cartRouter.delete("/:cid/:pid", async(req, res) => {
    let {cid, pid} = req.params 
    let result = await cartMM.deleteProduct(pid, cid) 
    res.send ({result:"success", payload: result})
})

export default cartRouter