const mongoose = require('mongoose')

const telegramSchema = mongoose.Schema({
	token: {
		type: String,
		require: [true, 'Telegram token is required']
	},
	usernameBot: {
		type: String,
		require: [true, 'Bot username is required']
	},
	usernameOwner: {
		type: String,
		require: [true, 'Owner username is required']
	},
	telegramOwnerId: {
		type: String,
		require: [true, 'Telegram OwnerID is required']
	},
	telegramGroupId: {
		type: String,
		require: [true, 'Telegram GroupID is required']
	},
	publisher: {
		type: String,
		require: [true, 'Publisher is required']
	},
}, { timestamps: true })

module.exports = mongoose.model('Telegram', telegramSchema)