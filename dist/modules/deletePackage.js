"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PackageModel } = require('./packageClass');
const deletePackage = async (packageNums, markAsDeleted = true) => {
    if (packageNums.length == 0) {
        await PackageModel.deleteMany({}, function (err) {
            if (err)
                console.log(err);
        });
    }
    else {
        if (markAsDeleted == true) {
            await PackageModel.updateMany({ packageNum: { $in: packageNums } }, { deleted: true }, function (err) {
                if (err)
                    console.log(err);
            });
        }
        else {
            await PackageModel.deleteMany({ packageNum: { $in: packageNums } }, function (err) {
                if (err)
                    console.log(err);
            });
        }
    }
};
exports.default = deletePackage;
//# sourceMappingURL=deletePackage.js.map