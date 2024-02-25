
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "product";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    description: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    thumbnail: { type: String, required: true }, 
    code: { type: Number, required: [true, "código único de producto"], unique: true }, 
    stock: { type: Number, required: true }, 
    category: {
        type: String,
        enum: ["Barbie", "Playmobil", "Lego", "Play-Doh"]
    },
    status: { type: String, required: true }
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;