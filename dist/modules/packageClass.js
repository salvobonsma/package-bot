"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const getCourier_1 = require("./getCourier");
const packageBotError_1 = __importDefault(require("./packageBotError"));
const trackPackage = require('./trackPackage');
const couriers = ['dpd', 'gls', 'ups', ''];
class Package {
    packageNum;
    courier;
    status;
    note;
    deleted;
    constructor(data) {
        if (data.packageNum == undefined) {
            throw new packageBotError_1.default('You did not specify the package number!\nProper usage `(p!add / p!track) <package number> <courier>`');
        }
        var tempCourier = data.courier.toLowerCase();
        if (!couriers.includes(tempCourier)) {
            throw new packageBotError_1.default(`We don't support the courier "${data.courier}"!\nType \`p!couriers\` to see which couriers we support!`);
        }
        if (tempCourier == '') {
            var matchCourier = (0, getCourier_1.getCourier)(data.packageNum);
            if (matchCourier.length == 0) {
                throw new packageBotError_1.default(`Couldn't match any courier to this package number!\nTry specifying the courier or check the list of supported couriers.`);
            }
            else if (matchCourier.length > 1) {
                throw new packageBotError_1.default(`Your tracking number format matches multiple couriers!\tPlease specify the courier`);
            }
            else {
                tempCourier = matchCourier[0];
            }
        }
        this.packageNum = data.packageNum;
        this.courier = tempCourier;
        this.note = data.note;
        this.deleted = data.deleted;
        if (data.deleted == undefined) {
            this.deleted = false;
        }
        if (data.status != undefined) {
            this.status = data.status;
        }
    }
    async getCurrentStatus() {
        try {
            const currentStatus = await trackPackage(this.packageNum, this.courier);
            this.status = currentStatus;
            return currentStatus;
        }
        catch (err) {
            throw err;
        }
    }
}
const PackageSchema = new mongoose.Schema({
    packageNum: String,
    courier: String,
    status: Array,
    note: String,
    deleted: Boolean,
});
module.exports.PackageModel = mongoose.model('PackageModel', PackageSchema);
module.exports.Package = Package;
//# sourceMappingURL=packageClass.js.map