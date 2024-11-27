"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packageBotError_1 = __importDefault(require("./packageBotError"));
const sendMessage_1 = __importDefault(require("./sendMessage"));
const sendStatus_1 = __importDefault(require("./sendStatus"));
const Discord = require('discord.js');
const addPackage = require('./addPackage');
const { prefix } = require('../../config.json');
const showPackage = async (pcg, channel, status = [], moreInfo = false) => {
    if (status.length == 0) {
        status = await pcg.getCurrentStatus();
    }
    const packageEmbed = new Discord.MessageEmbed();
    packageEmbed.setColor('BLUE').setTitle(`${pcg.courier.toUpperCase()} Package Number ${pcg.packageNum}:`);
    var reactions;
    var dateField = [];
    var statusField = [];
    var locationField = [];
    if (moreInfo) {
        packageEmbed.addField('React with:', ['✅ to add the package to your tracking list!', '⬅️️ to go back to general information about the package!'].join('\n'));
        for (var i = 0; i < status.length; i += 4) {
            dateField.push(i / 4 + 1 + '. ' + status[i] + ' ' + status[i + 1]);
            statusField.push(i / 4 + 1 + '. ' + status[i + 2]);
            locationField.push(i / 4 + 1 + '. ' + status[i + 3]);
        }
        reactions = ['⬅️', '✅'];
    }
    else {
        packageEmbed
            .addField('React with:', ['✅ to add the package to your tracking list!', 'ℹ️ to see the full delivery history!'].join('\n'))
            .setFooter('To remove the item from your tracking list, select the package you want to delete and react with the trash can emoji!');
        dateField.push(status[0] + ' ' + status[1]);
        statusField.push(status[2]);
        locationField.push(status[3]);
        reactions = ['✅', 'ℹ️'];
    }
    packageEmbed.addFields({
        name: 'Date:',
        value: dateField.join('\n'),
        inline: true,
    }, {
        name: 'Status:',
        value: statusField.join('\n'),
        inline: true,
    }, {
        name: 'Location:',
        value: locationField.join('\n'),
        inline: true,
    });
    const returnValue = await (0, sendMessage_1.default)(packageEmbed, reactions, channel, { deleteOnTimeout: false });
    if (returnValue.timedOut)
        return;
    switch (returnValue.action) {
        case 'CONFIRM':
            try {
                await addPackage(pcg, channel);
                (0, sendStatus_1.default)('SUCCESS', channel, `Succesfully added a package to your tracking list!\nType \`${prefix}list\` to view it!`, {});
            }
            catch (err) {
                showPackage(pcg, channel, status);
                if (err instanceof packageBotError_1.default)
                    (0, sendStatus_1.default)('ERROR', channel, err.errorMsgDescription, { timeout: 5000, footer: err.errorMsgFooter });
                else {
                    console.error(err);
                    (0, sendStatus_1.default)('ERROR', channel, 'An error has uccurred', { timeout: 10000 });
                }
            }
            return;
        case 'MORE-INFO':
            showPackage(pcg, channel, status, true);
            return;
        case 'PREVIOUS':
            showPackage(pcg, channel, status);
            return;
    }
};
module.exports = showPackage;
//# sourceMappingURL=showPackage.js.map