"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PackageModel, Package } = require('./packageClass');
const getPackage = async (packageNum = '') => {
    if (packageNum == '') {
        try {
            const data = await PackageModel.find();
            var newData = [];
            for (var i = 0; i < data.length; i++) {
                const pcg = new Package(data[i]);
                newData.push(pcg);
            }
            return newData;
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        try {
            return await PackageModel.findOne({ packageNum: packageNum });
        }
        catch (err) {
            console.log(err);
        }
    }
};
module.exports = getPackage;
//# sourceMappingURL=getPackage.js.map