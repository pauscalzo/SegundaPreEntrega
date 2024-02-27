import  express from 'express';
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ProductManager } from './ProductManager.js';
import router from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import { chatRouter, chatMM } from "./routes/chatMongo.router.js"
import routerRealTimesProducts from"./routes/realTimeProducts.router.js";
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import path from 'path';


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();
const port = 8080;

//Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views') 
app.set('view engine', "handlebars")
app.use(express.static(__dirname + '/views'))
app.use(express.static(path.join(__dirname, "public")))

//Midlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))


//Routes
app.use("/" ,router)
app.use('/api/carts', cartRouter);
app.use('/api/chat', chatRouter);
app.use("/realTimeProducts" , routerRealTimesProducts)


const httpServer = app.listen(port, () => console.log("servidor con express"))

const p = new ProductManager();

//Socket.io realTimeProducts

const socketServer = new Server(httpServer) 

socketServer.on("connection" , (socket) => {
    console.log("Nueva Conexion")

    try {
        const products = p.getProducts();
        socketServer.emit("products", products);
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }

    
    socket.on("new-Product", async (newProduct) => {
        try {
            const objectProductNew = {
                    title: newProduct.title,
                    description: newProduct.description,
                    code: newProduct.code,
                    price: newProduct.price,
                    status: newProduct.status,
                    stock: newProduct.stock,
                    category: newProduct.category,
                    thumbnail: newProduct.thumbnail,
    
            }
            const pushProduct = p.addProduct(objectProductNew);
            const updatedListProd = p.getProducts();
            socketServer.emit("products", updatedListProd);
            socketServer.emit("response", { status: 'success' , message: pushProduct});

        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })

    socket.on("delete-product", async(id) => {
        try {
            const pid = parseInt(id)
            const deleteProduct = p.deleteProduct(pid)
            const updatedListProd = p.getProducts()
            socketServer.emit("products", updatedListProd)
            socketServer.emit('response', { status: 'success' , message: "producto eliminado correctamente"});
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    } )

})

//Socket.io chat

const io = new Server(httpServer);

const users = {}

io.on("connection", (socket)=>{
    console.log("un usuario se ha conectado")
    socket.on("newUser", (username)=>{
        users[socket.id] = username
        io.emit("userConnected", username)
    })

    socket.on("chatMessage", async (data) => {
        const { username, message } = data;
        try {
            await chatMM.addChat(username, message);
            io.emit("message", { username, message });
        } catch (error) {
            console.error("Error al procesar el mensaje del chat:", error);
        }
    });

    socket.on("disconnect", ()=>{
        const username = users[socket.id]
        delete users[socket.id]
        io.emit("userDisconnected", username)
    })
})


const environment = async () => {
    await mongoose.connect("mongodb+srv://pauscalzo:Eloisa2014Amanda2017@clustercoder.wvj1vet.mongodb.net/ecommerce?retryWrites=true&w=majority")
        .then (() => {
            console.log ("Conectado a la Base de Datos")
        })
        .catch (error => {
            console.error ("Error al conectarse", error)
        })
}

environment ();




    
      
    
    