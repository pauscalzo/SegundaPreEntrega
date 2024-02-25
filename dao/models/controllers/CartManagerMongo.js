import cartModel from "../cart.model.js";
import productModel from "../product.model.js";

export class CartManagerMongo {
    constructor(){
        this.model = cartModel
    }
    //Mostrar carritos
    async getCarts(){
        try {
            return await this.model.find({})   
        } catch (error) {
            console.error("Error al mostrar carritos", error);
        }
    }
    //Mostrar un carrito por id
    async getCart(cid){
        return await this.model.findOne({_id: cid})
    }
    //Agregar un carrito nuevo
    async addCart(){
        const newCart = {
            products: []
        };
        return await this.model.create(newCart)
    }
    //Agregar un determinado producto a un determinado carrito
    async addToCart(cid, pid) {
        try {
            const cartExists = await this.model.findOne({ _id: cid });
            const productExists = await productModel.findOne({ _id: pid });
            if (!cartExists) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }

            if (!productExists) {
                throw new Error(`No se encontró el producto con id ${pid}`);
            }
    
            // Buscar el producto en el carrito

            const existingProduct = cartExists.products.find(product => product.productId.toString() === pid.toString());
           
            if (existingProduct) {
                // Si el producto ya está en el carrito, aumentar la cantidad
                existingProduct.quantity++;
            } else {
                // Si el producto no está en el carrito, agregarlo
               
                cartExists.products.push({
                    productId: pid,
                    quantity: 1
                });
            }
    
            await cartModel.updateOne({ _id: cid }, cartExists) 

            return "Producto agregado exitosamente";
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            
        }
    }
    //Borrar un determinado producto de un determinado carrito
    async deleteProduct(pid, cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }
    
            const productIndex = cart.product.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${pid} en el carrito`);
            }
    
            cart.product.splice(productIndex, 1); 
            await cart.save();
            return "Producto eliminado exitosamente del carrito";
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }
}


