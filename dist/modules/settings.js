"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = exports.updateSettings = void 0;
const mongoose = require('mongoose');
const SettingsSchema = new mongoose.Schema({
    id: Number,
    lang: String,
});
const SettingsModel = mongoose.model('SettingsModel', SettingsSchema);
const updateSettings = async (lang = '') => {
    const exists = await SettingsModel.findOne({ id: 0 });
    if (exists == null) {
        const newSettings = new SettingsModel({ id: 0, lang: lang });
        try {
            await newSettings.save();
        }
        catch (err) {
            throw err;
        }
    }
    else {
        try {
            mongoose.set('useFindAndModify', false);
            await SettingsModel.findOneAndUpdate({ id: 0 }, { id: 0, lang: lang == '' ? exists.lang : lang });
        }
        catch (err) {
            throw err;
        }
    }
};
exports.updateSettings = updateSettings;
const getSettings = async () => {
    var settings = await SettingsModel.findOne({ id: 0 });
    if (settings == null) {
        const newSettings = new SettingsModel({ id: 0, lang: 'EN' });
        try {
            await newSettings.save();
        }
        catch (err) {
            throw err;
        }
        return { id: 0, lang: 'EN' };
    }
    return settings;
};
exports.getSettings = getSettings;
//# sourceMappingURL=settings.js.map