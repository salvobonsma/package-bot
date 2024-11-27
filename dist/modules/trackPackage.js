"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trackDPD = require('./trackDPD');
const trackGLS = require('./trackGLS');
const trackUPS = require('./trackUPS');
const packageBotError_1 = __importDefault(require("./packageBotError"));
const settings_1 = require("./settings");
const trackPackage = async (packageNum, courier) => {
    var status = [];
    const settings = await (0, settings_1.getSettings)();
    switch (courier.toLowerCase()) {
        case 'dpd':
            status = await trackDPD(packageNum, settings.lang);
            break;
        case 'gls':
            status = await trackGLS(packageNum, settings.lang);
            break;
        case 'ups':
            status = await trackUPS(packageNum, settings.lang);
            break;
    }
    if (status[1] != '' || status[0].length == 0) {
        throw new packageBotError_1.default(`Incorrect ${courier} package tracking number (${packageNum})!`, `Make sure to check if the package number is correct!`);
    }
    return status[0];
};
module.exports = trackPackage;
//# sourceMappingURL=trackPackage.js.map