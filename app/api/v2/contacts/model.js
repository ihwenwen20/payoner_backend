const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		// validate: {
    //   validator: function (value) {
    //     // eslint-disable-next-line no-useless-escape
    //     const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    //     return EMAIL_RE.test(value);
    //   },
    //   message: attr => `${attr.value} must be a valid email!`,
    // },
	},
	phone: {
		type: String,
		unique: true,
	},
	address: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Address',
	},
});

module.exports = mongoose.model('Contact', contactSchema);
