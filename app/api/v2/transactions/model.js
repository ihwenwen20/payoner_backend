const mongoose = require('mongoose');

const historyTransactionSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: 3,
        maxlength: 50,
    },
    date: {
        type: Date,
        required: [true, 'Date and time are required and cannot be empty'],
    },
    description: {
        type: String,
    },
    publishedIn: {
        type: String,
        required: [true, 'This Published In is required'],
    },
    subCategory: {
			type: mongoose.Types.ObjectId,
			ref: 'SubCategory',
			// required: true,
		},
    category: {
			type: mongoose.Types.ObjectId,
			ref: 'Category',
			// required: true,
		},
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Success', 'Failed', 'Pending', 'Cancelled'],
        default: 'Pending',
    },
    additionalInfo: {
        type: String,
    },
    company: {
			type: mongoose.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
});

module.exports = mongoose.model('HistoryTransaction', historyTransactionSchema);