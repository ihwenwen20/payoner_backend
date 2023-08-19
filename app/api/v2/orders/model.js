const mongoose = require('mongoose');

const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  inventory: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
			default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    totalWithShipping: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
		customer: {
			type: mongoose.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},
		personalDetail: {
			name: {
				type: String,
				required: [true, 'Please provide name'],
				minlength: 3,
				maxlength: 50,
			},
			email: {
				type: String,
				required: [true, 'Please provide email'],
			},
			role: {
				type: String,
				default: 'Client',
			},
		},
		// historyTransaction: {
		// 	title: {
		// 		type: String,
		// 		required: [true, 'Title is required '],
		// 		minlength: 3,
		// 		maxlength: 50,
		// 	},
		// 	date: {
		// 		type: Date,
		// 		required: [true, 'Date and time are required and cannot be empty'],
		// 	},
		// 	description: {
		// 		type: String,
		// 	},
		// 	publishedIn: {
		// 		type: String,
		// 		required: [true, 'This Published In is required'],
		// 	},
		// 	image: {
		// 		type: mongoose.Types.ObjectId,
		// 		ref: 'Image',
		// 		required: true,
		// 	},
		// 	category: {
		// 		type: mongoose.Types.ObjectId,
		// 		ref: 'SubCategory',
		// 		required: true,
		// 	},
		// 	company: {
		// 		type: String,
		// 		required: true,
		// 	},
		// },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);