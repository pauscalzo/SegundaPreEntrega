import { Router } from "express";
import { ChatManagerMongo } from "../dao/models/controllers/ChatManagerMongo.js";

const chatRouter = Router()
const chatMM = new ChatManagerMongo()

chatRouter.get ("/", async (req, res) => {
    res.render("chat.handlebars")
})

chatRouter.post("/", async (req, res) => {
    const { username, message } = req.body; 
    try {
        const result = await chatMM.addChat(username, message); 
        res.json({ result: "success", payload: result }); 
    } catch (error) {
        console.error("Error al guardar el mensaje en la base de datos:", error);
        
    }
});


export { chatRouter, chatMM };