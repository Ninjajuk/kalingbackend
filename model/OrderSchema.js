const mongoose = require('mongoose');
const { Schema } = mongoose;


const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    items: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // paymentMethod: { type: String, required: true, enum: paymentMethods },
    paymentStatus: { type: String, default: 'pending' },
    status: { type: String, default: 'pending' },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
    date: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);




exports.Order = mongoose.model('Order', orderSchema);