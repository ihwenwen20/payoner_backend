const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/uploads');
	},
	// filename: function (req, file, cb) {
	// 	cb(null, Math.floor(Math.random() * 99999999) + '-' + file.originalname);
	// },
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname.toLowerCase());
	},
	// filename: function (req, file, cb) {
	//   cb(null, Date.now() + path.extname(file.originalname));
	// }
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/svg+xml' ||
		file.mimetype === 'image/jpg'
	) {
		cb(null, true);
	} else {
		//reject file
		cb(
			{
				message: 'Unsupported file format',
			},
			false
		);
	}
};

const uploadMiddleware = multer({
	storage,
	limits: {
		fileSize: 5000000,
	},
	fileFilter: fileFilter,
});

// const uploadSingle = multer({
//   storage: storage,
//   // limits: { fileSize: 5000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single("image");

// const uploadMultiple = multer({
//   storage: storage,
//   // limits: { fileSize: 5000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).array("image");

// function checkFileType(file, cb) {
//   const fileTypes = /jpeg|jpg|png|gif/;
//   const extName = fileTypes.test(Date.now() + path.extname(file.originalname).toLowerCase());
//   const mimeType = fileTypes.test(file.mimetype);
//   if (mimeType && extName) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only !!!");
//   }
// }

module.exports = uploadMiddleware;