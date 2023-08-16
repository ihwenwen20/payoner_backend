// const paginateData = async (model, query, page, size) => {
// 	const offset = size * page;

// 	const totalRows = await model.countDocuments(query);
// 	const totalPage = Math.ceil(totalRows / size);

// 	const result = await model.find(query)
// 		.skip(offset)
// 		.limit(size)
// 		.sort({ _id: -1 });

// 	return {
// 		data: result,
// 		pagination: {
// 			page,
// 			size,
// 			totalRows,
// 			totalPage,
// 		},
// 	};
// };
const paginateData = async (model, queryFields, search, page, size, additionalFilters) => {
	if (search) {
		page = 1;
	}
	// const offset = size * page;
	const offset = size * (page - 1);
	const query = { ...additionalFilters }; // Copy additional filters


	// const query = {};
	if (search) {
		const searchQuery = queryFields.map(field => ({ [field]: { $regex: search, $options: "i" } }));
		query['$or'] = searchQuery;
	}

	const totalRows = await model.countDocuments(query);
	const totalPage = Math.ceil(totalRows / size);

	const result = await model.find(query)
		.skip(offset)
		.limit(size)
		.sort({ _id: -1 });

	return {
		data: result,
		search,
		pagination: {
			totalRows,
			page,
			size,
			totalPage,
		},
	};
};

// Fungsi util untuk infinite scroll
// const infiniteScrollData = async (model, queryField, search, page, size) => {
// 	if (search) {
// 		// Jika terdapat parameter pencarian, atur halaman kembali ke 1
// 		page = 1;
// 	}

// 	const skip = (page - 1) * size;

// 	const query = {};
// 	if (search) {
// 		query[queryField] = { $regex: search, $options: "i" };
// 	}
// 	// const skip = (page - 1) * size;

// 	const totalRows = await model.countDocuments(query);
// 	const totalPage = Math.ceil(totalRows / size);
// 	const result = await model.find(query)
// 		.skip(skip)
// 		.limit(size)

// 	return {
// 		data: result,
// 		// totalRows,
// 		// page,
// 		// size,
// 		// totalPage,
// 		search,
// 		pagination: {
// 			totalRows,
// 			page,
// 			size,
// 			totalPage,
// 		},
// 	};
// };
const infiniteScrollData = async (model, queryFields, search, page, size) => {
	if (search) {
		page = 1;
	}

	const skip = (page - 1) * size;

	const query = {};
	if (search) {
		const searchQuery = queryFields.map(field => ({ [field]: { $regex: search, $options: "i" } }));
		query['$or'] = searchQuery;
	}

	const totalRows = await model.countDocuments(query);
	const totalPage = Math.ceil(totalRows / size);
	const result = await model.find(query)
		.skip(skip)
		.limit(size);

	return {
		data: result,
		search,
		pagination: {
			totalRows,
			page,
			size,
			totalPage,
		},
	};
};

module.exports = {
	paginateData,
	infiniteScrollData
};

/**!SECTION
 * Contoh implementasi paginate
const { paginateData } = require('./paginationUtils');

const index = async (req, res, next) => {
		try {
				const page = parseInt(req.query.page) || 0;
				const limit = parseInt(req.query.limit) || 10;
				const search = req.query.search_query || "";
				const query = {
						$or: [
								{ name: { $regex: search, $options: 'i' } },
								{ email: { $regex: search, $options: 'i' } }
						]
				};

				const result = await paginateData(Users, query, page, limit);
				res.status(StatusCodes.OK).json(result);
		} catch (err) {
				next(err);
		}
};


 */


/**!SECTION
 * Contoh implementasi Infinite
//  const Categories = require('../../v1/categories/model');
// const indexInfinite = async (req, res, next) => {
// 	try {
// 		let page = parseInt(req.query.page) || 1;
// 		const size = parseInt(req.query.size) || 10;
// 		const search = req.query.search_query || "";

// 		if (search) {
// 			// Jika terdapat parameter pencarian, atur halaman kembali ke 1
// 			page = 1;
// 		}

// 		const skip = (page - 1) * size;

// 		const query = {};
// 		if (search) {
// 			query.name = { $regex: search, $options: "i" };
// 		}

// 		const totalRows = await Categories.countDocuments(query);
// 		const totalPage = Math.ceil(totalRows / size);
// 		const result = await Categories.find(query).skip(skip).limit(size);
// 		res.status(StatusCodes.OK).json({
// 			data: result,
// 			totalRows,
// 			page,
// 			size,
// 			totalPage,
// 			search
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };

 */
