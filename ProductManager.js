import fs from "fs"

export class ProductManager {
    constructor () {
    this.products = [];
    this.path = "./data/products.json"
    };

    getProducts(){
        try {
            const data = fs.readFileSync("./data/products.json", "utf8");
            this.products = JSON.parse(data);
            return this.products;              
        }
        catch (error) {
            console.error("error al leer el archivo", error);
            return []; 
        }
    };

    getProductById(pid){
        this.getProducts()
        const productId = this.products.find (product => product.id === pid);

        if (productId) {
            return productId;
        } else {
            console.log("Producto no encontrado");
        }    
    };

    addProduct(product) {
        const { title, description, price, thumbnail, code, stock, category, status } = product;


        if (title === "" || description === "" || price === "" || thumbnail === "" || code === "" || stock === "" || category === "" || status === "") {
            throw new Error("Debe completar todos los campos.");
        } else if (this.products.some((product) => product.code === code)) {
            throw new Error("El producto ya existe");
        } else {
            const newProduct = {
                id: this.products.length + 1,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                status: status,
                category: category,
            };


            this.products.push(newProduct);
            console.log("Producto agregado correctamente.");


            try {
                fs.writeFileSync(this.path, JSON.stringify(this.products));
                console.log("Producto guardado exitosamente");
                return newProduct;
            } catch (error) {
                console.error("No se guardó el producto", error);
                throw error;
            }
        }
    }

    updateProduct(id, productUpdate) {
        this.getProducts();
        const productId = this.products.find (product => product.id === id);
        if (productId) {
            const Index = this.products.findIndex (product => product.id === id);
            this.products[Index] = {id, ...productUpdate};
            try {
                fs.writeFileSync(this.path, JSON.stringify(this.products));
                console.log("Archivo actualizado con éxito")    
            } catch (error) {
                console.error("no se pudo actualizar el archivo", error)
            }
        } else {
            console.error("No se encontro el producto");
        }   
    };

    deleteProduct(id) {
        this.getProducts();
        const productId = this.products.find((product) => product.id === id);
        if (productId) {
            const Index = this.products.findIndex((product) => product.id === id);
            this.products.splice(Index, 1);
            try {
                fs.writeFileSync(this.path, JSON.stringify(this.products));
                console.log("El producto se ha borrado con éxito");
            } catch (error) {
                console.error("No se pudo borrar el producto", error);
            }
        } else {
            throw new Error("No se encontró el producto");
        }
    }
    
};
