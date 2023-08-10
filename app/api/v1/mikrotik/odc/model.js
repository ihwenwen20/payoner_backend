const mongoose = require('mongoose');

const odcSchema = new mongoose.Schema({
	odcCode: {
    type: String,
		unique: true,
    required: [true, 'Please provide the ODC code'],
  },
  oltPortNumber: {
    type: Number,
    maxLength: [20, 'OLT port number must be a maximum of 20 characters'],
  },
  totalPort: {
    type: Number,
    maxLength: [20, 'Total port must be a maximum of 20 characters'],
  },
	tubeFoColor: {
		type: String,
	},
	poleNumber: {
		type: String,
	},
	photo: {
		type: String,
		// required: [true, 'Please include documentary evidence'],
	},
	description: {
		type: String,
	},
	publisher: {
		type: String,
	},
	// publisher: {
  //   type: mongoose.Types.ObjectId,
  //   ref: 'Employee',
  //   required: [true, 'Please provide the publisher'],
  // },
  coverage: {
    type: mongoose.Types.ObjectId,
    ref: 'Coverage',
    required: [true, 'Please provide the Area Name'],
  },
}, { timestamps: true }
);

module.exports = mongoose.model('ODC', odcSchema);
