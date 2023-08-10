const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
	address: {
    type: String,
    // validate: {
    //   validator: async function (address) {
    //     const count = await mongoose.models.Address.countDocuments({
    //       _id: { $ne: this._id }, // Menyertakan kondisi untuk memeriksa kecuali alamat yang sedang diperbarui
    //       address: { $eq: address },
    //     });
    //     return count === 0;
    //   },
    //   message: 'Duplicate address.',
    // },
  },
	desa: {
		type: String,
	},
	kecamatan: {
		type: String,
	},
  city: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  province: {
    type: String,
  },
  country: {
    type: String,
  },
  geo: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
});

// Fungsi untuk mendapatkan alamat dari lokasi pengguna
// addressSchema.statics.getAddressFromCoordinates = async function(latitude, longitude) {
//   const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`);
//   const data = await response.json();

//   if (data.results && data.results.length > 0) {
//     const result = data.results[0];
//     const addressComponents = result.address_components;

//     let address = {
//       street: '',
//       city: '',
//       state: '',
//       postalCode: '',
//       country: ''
//     };

//     for (let component of addressComponents) {
//       if (component.types.includes('street_number')) {
//         address.street += component.long_name + ' ';
//       } else if (component.types.includes('route')) {
//         address.street += component.long_name;
//       } else if (component.types.includes('locality')) {
//         address.city = component.long_name;
//       } else if (component.types.includes('administrative_area_level_1')) {
//         address.state = component.long_name;
//       } else if (component.types.includes('postal_code')) {
//         address.postalCode = component.long_name;
//       } else if (component.types.includes('country')) {
//         address.country = component.long_name;
//       }
//     }

//     return address;
//   }

//   return null;
// };

module.exports = mongoose.model('Address', addressSchema);
