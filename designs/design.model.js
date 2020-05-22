const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    designName: { type: String, required: true},
    userID: {type: Schema.Types.ObjectId, ref: 'Account'},
    //creatorID: { type: String, required: true, ref: 'Account.creatorID'},
    designID: { type: String, unique: true, required: true},
    designType: { type: String, required: true},
    designImage: { type: String, unique: true, required: true},
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Design', schema);