import cartModel from "../cart.model.js";
import productModel from "../product.model.js";

export class CartManagerMongo {
    constructor(){
        this.model = cartModel
    }
    //Mostrar carritos
    async getCarts(){
        try {
            return await this.model.find({}).populate('products');
        } catch (error) {
            console.error("Error al mostrar carritos", error);
            throw error;
        }
    }

    //Mostrar un carrito por id

    async getCart(cid) {
        try {
            return await this.model.findById(cid).populate('products');
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            throw error;
        }
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
            if (!cartExists) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }
    
            const productExists = await productModel.findOne({ _id: pid });
            if (!productExists) {
                throw new Error(`No se encontró el producto con id ${pid}`);
            }
    
            const existingProduct = cartExists.products.find(product => product.productId.toString() === pid.toString());
           
            if (existingProduct) {
                // Si el producto ya está en el carrito, aumentar la cantidad
                existingProduct.quantity++;
            } else {
                // Si el producto no está en el carrito, agregarlo
               
                cartExists.products.push({
                    productId: pid,
                    product: productExists,
                    quantity: 1
                });
            }
    
            await cartExists.save(); 
            return "Producto agregado exitosamente";
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            
        }
    }
    
    async updateCart(cart) {
        try {
            await this.model.findByIdAndUpdate(cart._id, cart);
            return "Carrito actualizado exitosamente";
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw error;
        }
    }

    //Borrar un determinado producto de un determinado carrito
    async deleteProduct(pid, cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }
    
            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${pid} en el carrito`);
            }
    
            cart.products.splice(productIndex, 1); 

            await this.updateCart(cart);

            return "Producto eliminado exitosamente del carrito";
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }

    //Editar un determinado producto de un determinado carrito

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }

            const productIndex = cart.products.findIndex(product => product.productId.toString() === pid.toString());
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${pid} en el carrito`);
            }

            cart.products[productIndex].quantity = quantity;

            await this.updateCart(cart);

            return "Cantidad de producto actualizada exitosamente";

        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }

    async deleteAllProducts(cid) {
        try {
            const cart = await this.model.findById(cid);
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${cid}`);
            }
    
            cart.products = []; 
    
            await this.updateCart(cart);
    
            return "Todos los productos fueron eliminados del carrito exitosamente";
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito:", error);
            throw error;
        }
    }
    


}


