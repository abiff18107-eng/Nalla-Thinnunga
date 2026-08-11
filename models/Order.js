const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  image: { type: String }
});

const OrderSchema = new mongoose.Schema(
  {
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    customer: {
      name: { type: String },
      email: { type: String }
    },
    status: { type: String, default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
