import productModel from "../product.model.js";

export class ProductManagerMongo {
    constructor(){
        this.model = productModel
    }
    
    //Mostrar productos
    async getProducts(page, limit, sortOrder, category) {
        try {
            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: sortOrder ? { price: sortOrder === 'asc' ? 1 : -1 } : null
            };
    
            const query = category ? { category: category } : {};
    
            return await this.model.paginate(query, options);
        } catch (error) {
            console.error("Error al mostrar los productos", error);
        }
    }

    //Mostrar un producto por id
    async getProduct(pid){
        return await this.model.findOne({_id: pid}).lean(); 
    }
    //Agregar un nuevo producto a la base de datos
    async addProduct(newProduct){
        return await this.model.create(newProduct);
    }
    //Editar un producto existente
    async updateProduct(pid, updatedProduct){
        return await this.model.updateOne({_id: pid}, updatedProduct);
    }
    //Borrar un producto existente
    async deleteProduct(pid){
        return await this.model.deleteOne({_id: pid});
    }
}
