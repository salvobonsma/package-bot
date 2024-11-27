"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deletePackage_1 = __importDefault(require("./deletePackage"));
const getNote_1 = __importDefault(require("./getNote"));
const sendMessage_1 = __importDefault(require("./sendMessage"));
const Discord = require('discord.js');
const updatePackage = require('./updatePackage');
const showMoreInfo = async (channel, packages, page, selectedIndx = 0) => {
    return new Promise(async (resolve) => {
        if (packages.length == 0) {
            resolve();
            return;
        }
        var reactionList = ['⬅️'];
        if (selectedIndx > 0) {
            reactionList.push('◀️');
        }
        reactionList.push('🗑️');
        reactionList.push('📝');
        if (packages.length > 0 && selectedIndx < packages.length - 1) {
            reactionList.push('▶️');
        }
        const pcg = packages[selectedIndx];
        var dateField = [];
        var statusField = [];
        var locationField = [];
        for (var i = 0; i < pcg.status.length; i += 4) {
            dateField.push(i / 4 + 1 + '. ' + pcg.status[i] + ' ' + pcg.status[i + 1]);
            statusField.push(i / 4 + 1 + '. ' + pcg.status[i + 2]);
            locationField.push(i / 4 + 1 + '. ' + pcg.status[i + 3]);
        }
        const moreInfoEmbed = new Discord.MessageEmbed();
        moreInfoEmbed
            .setTitle(`${pcg.courier} Package Number ${pcg.packageNum} Delivery History:`)
            .setDescription(pcg.note)
            .setColor('BLUE')
            .addFields({
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
        })
            .addField('React with:', [
            '⬅️ to go back to your tracking list!',
            '🗑️ to delete the package from your tracking list!',
            '📝 to edit the package note!',
            '◀️ or ▶️ to go back and forth between selected packages!',
        ].join('\n'), true);
        const returnValue = await (0, sendMessage_1.default)(moreInfoEmbed, reactionList, channel, { editRequireSelected: false });
        if (returnValue.timedOut) {
            resolve();
            return;
        }
        switch (returnValue.action) {
            case 'PREVIOUS':
                resolve();
                break;
            case 'BACK':
                await showMoreInfo(channel, packages, page, --selectedIndx);
                resolve();
                break;
            case 'FORWARD':
                await showMoreInfo(channel, packages, page, ++selectedIndx);
                resolve();
                break;
            case 'DELETE-ALL':
                await (0, deletePackage_1.default)([pcg.packageNum]);
                packages.splice(selectedIndx, 1);
                if (selectedIndx > 0 && selectedIndx == packages.length) {
                    selectedIndx--;
                }
                await showMoreInfo(channel, packages, page, selectedIndx);
                resolve();
                break;
            case 'EDIT':
                const newNote = await (0, getNote_1.default)(channel);
                if (newNote == '')
                    return;
                await updatePackage(pcg.packageNum, [], newNote);
                packages[selectedIndx].note = newNote;
                await showMoreInfo(channel, packages, page, selectedIndx);
                resolve();
                break;
        }
    });
};
exports.default = showMoreInfo;
//# sourceMappingURL=showMoreinfo.js.map