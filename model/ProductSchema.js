const mongoose = require('mongoose');
const {Schema} = mongoose;


const productSchema = new Schema({
    title: { type : String, required: true},
    description: { type : String, required: true},
    price: { type: Number, min:[1, 'wrong min price'], max:[200000, 'wrong max price']},
    cuttedprice: { type: Number, min:[1, 'wrong min price'], max:[200000, 'wrong max price']},
    discount: { 
        type: Number,
        //  min:[1, 'wrong min discount'], 
        //  max:[99, 'wrong max discount']
        },
    rating: { type: Number, 
        // min:[0, 'wrong min rating'], 
        // max:[5, 'wrong max price'], 
        default:0
    },
    stock: { type: Number, min:[0, 'wrong min stock'], default:0},
    brand: { type : String, required: true},
    category: { type : String,
        // enum: ['vegetables', 'fruits', 'meat', 'electronics','grocery','localitems','cosmetics','fragrances'],
        required: true 
    },
    unit: { type : String,
        // enum: ['KG', 'Liters', 'Item', 'Gram'],
    },
    thumbnail: { type : String, required: true},
    // images:{ type : [String], required: true},
    // colors:{ type : [Schema.Types.Mixed] },
    // sizes:{ type : [Schema.Types.Mixed]},
    // highlights:{ type : [String] },
    // discountPrice: { type: Number},
    deleted: { type : Boolean, default: false},
},{
    timestamps : true
})



exports.Product = mongoose.model('Product',productSchema)