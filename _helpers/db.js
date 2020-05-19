const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(config.connectionString, connectionOptions)
.catch((e) => {
    console.log("Error while DB connecting");
    console.log(e);
  });;
mongoose.Promise = global.Promise;

module.exports = {
    Account: require('../accounts/account.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}