class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filtering() {
		const queryObj = { ...this.queryString };

		const excludedFields = ['page', 'sort', 'limit'];
		excludedFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lt|lte|regex)\b/g,
			(match) => '$' + match
		);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	sorting() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	paginating() {
		const page = parseInt(this.queryString.page) || 1;
		const limit = parseInt(this.queryString.limit) || 10;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}

	selecting() {
		if (this.queryString.select) {
			const fields = this.queryString.select.split(',').join(' ');
			this.query = this.query.select(fields);
		}

		return this;
	}

	counting() {
		this.query = this.query.countDocuments();

		return this;
	}

	grouping(groupBy) {
		if (groupBy) {
			const groupFields = groupBy.split(',').join(' ');
			this.query = this.query.group(groupFields);
		}

		return this;
	}

	aggregating(pipeline) {
		if (pipeline) {
			this.query = this.query.aggregate(pipeline);
		}
		return this;
	}

	join(collection, localField, foreignField, as) {
		this.query = this.query.lookup({
			from: collection,
			localField,
			foreignField,
			as,
		});
		return this;
	}

	periode(periodeField, startDate, endDate) {
		const periodeQuery = {};
		if (startDate !== undefined) {
			periodeQuery['$gte'] = new Date(startDate);
		}
		if (endDate !== undefined) {
			periodeQuery['$lte'] = new Date(endDate);
		}
		this.query = this.query.find({ [periodeField]: periodeQuery });
		return this;
	}

	selectAll() {
    this.query = this.query.select('-__v').lean();
    return this;
  }

  edit(data) {
    this.query = this.query.update(data);
    return this;
  }

  create(data) {
    this.query = this.query.create(data);
    return this;
  }

  delete() {
    this.query = this.query.delete();
    return this;
  }
}

module.exports = APIFeatures;


// contoh
// const features = new APIFeatures(Model.find(), req.query)
//   .filtering()
//   .sorting()
//   .paginating()
//   .selecting()
//   .counting()
//   .populating('relatedModel')
//   .periode('createdAt', '2022-01-01', '2022-12-31');

// contoh d tulism pada model
// const userSchema = new mongoose.Schema({
//   // Definisikan skema user di sini...
// });

// // Tambahkan method `generate` untuk menghasilkan data user yang dibutuhkan
// userSchema.methods.generate = function () {
//   // Implementasikan logika untuk menghasilkan data yang dibutuhkan
//   // dalam konteks tabel user
//   // Contoh:
//   const userData = {
//     id: this._id,
//     name: this.name,
//     email: this.email,
//     // ... tambahkan properti lain yang diperlukan
//   };

//   return userData;
// };

// // Tambahkan static method `selectAll` untuk mengambil semua data user
// userSchema.statics.selectAll = function () {
//   return this.find({});
// };

// // Tambahkan method `edit` untuk mengubah data user yang dipilih
// userSchema.methods.edit = function (data) {
//   // Implementasikan logika untuk mengubah data user yang dipilih
//   // berdasarkan data yang diberikan
//   // Contoh:
//   this.name = data.name;
//   this.email = data.email;
//   // ... tambahkan properti lain yang ingin diubah

//   return this;
// };

// // Tambahkan static method `create` untuk membuat data user baru
// userSchema.statics.create = function (data) {
//   return this.create(data);
// };

// // Tambahkan method `delete` untuk menghapus data user yang dipilih
// userSchema.methods.delete = function () {
//   return this.remove();
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;