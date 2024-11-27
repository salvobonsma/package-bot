"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLanguage = void 0;
const packageBotError_1 = __importDefault(require("./packageBotError"));
const sendMessage_1 = __importDefault(require("./sendMessage"));
const sendStatus_1 = __importDefault(require("./sendStatus"));
const settings_1 = require("./settings");
const Discord = require('discord.js');
const setLanguage = async (channel) => {
    const currentSettings = await (0, settings_1.getSettings)();
    const languageList = ['🇬🇧', '🇵🇱', '🇩🇪'];
    const languageTxt = ['EN', 'PL', 'DE'];
    const languageFullTxt = ['English', 'Polish', 'German'];
    var langStr = `**Current language: ${languageFullTxt[languageTxt.indexOf(currentSettings.lang)]}**\nReact with a flag to change language!`;
    for (var i = 0; i < languageList.length; i++) {
        langStr += `\n*${languageList[i]} for ${languageFullTxt[i]}*`;
    }
    langStr += '\nAs of now the German language only supports UPS parcels!';
    const languageEmbed = new Discord.MessageEmbed();
    languageEmbed.setColor('BLURPLE').setTitle('Language').setDescription(langStr).setFooter('Support for more languages coming soon!');
    const returnVal = await (0, sendMessage_1.default)(languageEmbed, languageList, channel, {});
    if (returnVal.timedOut)
        return;
    try {
        await (0, settings_1.updateSettings)(languageTxt[returnVal.actionIndx]);
        (0, sendStatus_1.default)('SUCCESS', channel, `Changed language to ${languageFullTxt[returnVal.actionIndx]}`, { timeout: 10000 });
    }
    catch (err) {
        if (err instanceof packageBotError_1.default) {
            (0, sendStatus_1.default)('ERROR', channel, err.errorMsgDescription, { timeout: 5000, footer: err.errorMsgFooter });
        }
        else {
            (0, sendStatus_1.default)('ERROR', channel, 'An error has occurred', { timeout: 10000 });
            console.error(err);
        }
    }
    return;
};
exports.setLanguage = setLanguage;
//# sourceMappingURL=setLanguage.js.map