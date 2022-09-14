const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        unique: true
    },
    img: {
        type:String,
        required: false
    },
    desc: {
        type:String,
        required:true 
    },
    price: {
        type: Number,
        required: true
    },
    categories:{
        type:Array
    },
    inStock: {
        type:Boolean,
        default: true
    }
},{timestamps:true})

module.exports = mongoose.model("Product", ProductSchema);