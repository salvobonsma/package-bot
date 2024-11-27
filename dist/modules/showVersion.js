"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendMessage_1 = __importDefault(require("./sendMessage"));
const Discord = require('discord.js');
const showVersion = async (channel, versions, pageIndx) => {
    const versionEmbed = new Discord.MessageEmbed();
    versionEmbed.setTitle(versions[pageIndx].version).setDescription(versions[pageIndx].changelog).setColor('GREEN');
    var reactionsList = [];
    if (pageIndx == 0) {
        if (versions.length > 1) {
            reactionsList = ['➡️'];
        }
    }
    else {
        if (pageIndx < versions.length - 1) {
            reactionsList = ['⬅️', '➡️'];
        }
        else {
            reactionsList = ['⬅️'];
        }
    }
    var returnVal = await (0, sendMessage_1.default)(versionEmbed, reactionsList, channel, {});
    if (returnVal.timedOut)
        return;
    switch (returnVal.action) {
        case 'PREVIOUS':
            showVersion(channel, versions, --pageIndx);
            return;
        case 'NEXT':
            showVersion(channel, versions, ++pageIndx);
            return;
    }
};
module.exports = showVersion;
//# sourceMappingURL=showVersion.js.map