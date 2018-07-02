const mongoose = require('mongoose');

const idsSchema = new mongoose.Schema({
	book_id: Number,
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			book_id: 0,
		});
		newIds.save();
	}
})
module.exports = Ids