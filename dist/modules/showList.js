"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deletePackage_1 = __importDefault(require("./deletePackage"));
const getNote_1 = __importDefault(require("./getNote"));
const sendMessage_1 = __importDefault(require("./sendMessage"));
const sendStatus_1 = __importDefault(require("./sendStatus"));
const showMoreinfo_1 = __importDefault(require("./showMoreinfo"));
const Discord = require('discord.js');
const paginateList = require('./paginateList');
const getPackage = require('./getPackage');
const updatePackage = require('./updatePackage');
const { prefix } = require('../../config.json');
const showList = async (channel, page = 0) => {
    var packageList = await getPackage();
    packageList = paginateList(packageList);
    if (page >= packageList.length - 1) {
        page = packageList.length - 1;
    }
    if (packageList.length == 0) {
        (0, sendStatus_1.default)('WARN', channel, `Your list is empty and you want to see the contents of it!? Good luck with that!
Type \`p!add <tracking number> <courier>\` to add a package to your tracking
list or add it via the tracking GUI by typing \`p!track <package number> <courier>!\``, { title: 'Your Tracking List is Empty!', timeout: 25000 });
        return;
    }
    const letterList = ['A', 'B', 'C', 'D', 'E'];
    var pcgNumList = [];
    var listFields = [];
    for (var i = 0; i < packageList[page].length; i++) {
        var letter = letterList[i];
        var pcg = packageList[page][i];
        pcgNumList.push(pcg.packageNum);
        listFields.push({
            name: `----------------------------------------------`,
            value: `**${letter}. ${pcg.courier.toUpperCase()} Package Number ${pcg.packageNum}:**\n${pcg.note}`,
            inline: false,
        });
        listFields.push({
            name: 'Date:',
            value: pcg.status[0] + ' ' + pcg.status[1],
            inline: true,
        });
        listFields.push({
            name: 'Status:',
            value: pcg.status[2],
            inline: true,
        });
        listFields.push({
            name: 'Location:',
            value: pcg.status[3],
            inline: true,
        });
    }
    const listEmbed = new Discord.MessageEmbed();
    listEmbed
        .setTitle('Your Package Tracking List:')
        .setColor('GREEN')
        .setDescription([
        '***React with:***',
        '⬅️ to go back a page!',
        '➡️ to go to the next page!',
        'ℹ️ to get info about the selected packages!',
        '🗑️ to delete selected packages\n(if nothing is selected deletes all packages)!',
        '📝 to edit the selected package note!',
        '🇦-🇪 to select specific packages!',
    ].join('\n'))
        .addFields(listFields)
        .setFooter(`Page ${page + 1}/${packageList.length}`);
    var reactionList = ['🇦', '🇧', '🇨', '🇩', '🇪'];
    reactionList.splice(packageList[page].length);
    reactionList.push('ℹ️');
    reactionList.push('🗑️');
    reactionList.push('📝');
    if (page > 0) {
        reactionList.unshift('⬅️');
    }
    else if (packageList.length > 1) {
        reactionList.push('➡️');
    }
    const returnValue = await (0, sendMessage_1.default)(listEmbed, reactionList, channel, { pcgNumList: pcgNumList, infoReturnList: true });
    if (returnValue.timedOut)
        return;
    switch (returnValue.action) {
        case 'DELETE':
            await (0, deletePackage_1.default)(returnValue.selectedList);
            showList(channel, page);
            return;
        case 'DELETE-ALL':
            const deleteEmbed = new Discord.MessageEmbed();
            deleteEmbed
                .setTitle('Are you sure you want to delete all packages from your tracking list?')
                .setDescription('React with ✅ to confirm!\nReact with ❌ to cancel!')
                .setFooter('NOTE! Deleting every package IS PERMANENT!')
                .setColor('YELLOW');
            const returnVal = await (0, sendMessage_1.default)(deleteEmbed, ['✅', '❌'], channel, {});
            if (returnVal.timedOut)
                return;
            switch (returnVal.action) {
                case 'CONFIRM':
                    await (0, deletePackage_1.default)([]);
                    const successMessage = `Deleted every package in your tracking list!
Type \`${prefix}add <package number> <courier>\` to add a package to your tracking list or add it via the tracking GUI by tying \`${prefix}track <package number> <courier>\`!`;
                    (0, sendStatus_1.default)('SUCCESS', channel, successMessage, {});
                    return;
                case 'CANCEL':
                    await (0, sendStatus_1.default)('SUCCESS', channel, 'You will be taken back to your tracking list in 5 seconds! 📦', {
                        title: 'Canceled deleting every package from your tracking list!',
                        footer: 'Your packages are in a safe place!',
                        timeout: 5000,
                    });
                    showList(channel);
                    return;
            }
            return;
        case 'EDIT':
            const newNote = await (0, getNote_1.default)(channel);
            if (newNote == '')
                return;
            await updatePackage(returnValue.selectedList[0], [], newNote);
            showList(channel, page);
            return;
        case 'MORE-INFO':
            var moreInfoList = [];
            for (var i = 0; i < returnValue.selectedList.length; i++) {
                moreInfoList.push(packageList[page][pcgNumList.indexOf(returnValue.selectedList[i])]);
            }
            await (0, showMoreinfo_1.default)(channel, moreInfoList, page);
            showList(channel, page);
            return;
        case 'NEXT':
            showList(channel, page + 1);
            return;
        case 'PREVIOUS':
            showList(channel, page - 1);
            return;
    }
};
module.exports = showList;
//# sourceMappingURL=showList.js.map