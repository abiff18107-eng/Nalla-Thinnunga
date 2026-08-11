const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    items: [
      {
        id: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentMeta: { type: String },
    status: { type: String, default: 'COMPLETED' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
