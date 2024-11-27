"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packageBotError_1 = __importDefault(require("./packageBotError"));
const { PackageModel } = require('./packageClass');
const getPackage = require('./getPackage');
const getNote = require('./getNote');
const updatePackage = require('./updatePackage');
const addPackage = async (data, channel, debug = false) => {
    const pcgExists = await getPackage(data.packageNum);
    if (debug == false) {
        if (pcgExists != null) {
            if (pcgExists.deleted == true) {
                const note = await getNote(channel);
                if (note == '') {
                    throw new packageBotError_1.default('No note added!\nFalied to add package to list.');
                }
                await updatePackage(data.packageNum, [], note);
                return;
            }
            else {
                throw new packageBotError_1.default(`The package you trying to add to the list is already in it!`);
            }
        }
        try {
            await data.getCurrentStatus();
        }
        catch (err) {
            throw err;
        }
        const note = await getNote(channel);
        if (note == '') {
            throw new packageBotError_1.default('No note added!\nFalied to add package to list.');
        }
        data.note = note;
    }
    const pcg = new PackageModel({
        packageNum: data.packageNum,
        courier: data.courier,
        status: data.status,
        note: data.note,
        deleted: false,
    });
    try {
        await pcg.save();
        console.log('Added Package!');
        return;
    }
    catch (err) {
        throw err;
    }
};
module.exports = addPackage;
//# sourceMappingURL=addPackage.js.map