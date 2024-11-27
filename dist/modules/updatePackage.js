const { PackageModel } = require('./packageClass');
const mongoose = require('mongoose');
const updatePackage = async (packageNum, newStatus, note = '') => {
    mongoose.set('useFindAndModify', false);
    if (note == '') {
        await PackageModel.findOneAndUpdate({ packageNum: packageNum }, { status: newStatus, deleted: false });
    }
    else {
        await PackageModel.findOneAndUpdate({ packageNum: packageNum }, { note: note, deleted: false });
    }
};
module.exports = updatePackage;
//# sourceMappingURL=updatePackage.js.map