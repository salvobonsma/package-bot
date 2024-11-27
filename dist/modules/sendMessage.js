"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require('discord.js');
const PackageBot_1 = __importDefault(require("../PackageBot"));
const sendStatus_1 = __importDefault(require("./sendStatus"));
const sendMessage = async (embed, reactions, channel, { pcgNumList = [], deleteOnTimeout = true, infoReturnList = false, editRequireSelected = true }) => {
    var returnVal = { timedOut: true };
    await channel.send({ embeds: [embed] }).then(async (message) => {
        return new Promise(async (resolve) => {
            for (var i = 0; i < reactions.length; i++) {
                await message.react(reactions[i]);
            }
            var reactionAddListner;
            var reactionRemoveListner;
            var sentTimeoutMessage = false;
            const inactiveColors = ['RED', 'ORANGE', 'GOLD', 'YELLOW'];
            var timeoutInterval;
            const inactiveEmbed = new Discord.MessageEmbed();
            inactiveEmbed.setColor('YELLOW').setFooter('React to cancel!');
            var messageTimeout = setTimeout(() => {
                var counter = 3;
                if (deleteOnTimeout == false) {
                    message.reactions.removeAll();
                }
                else {
                    timeoutInterval = setInterval(async () => {
                        inactiveEmbed.setColor(inactiveColors[counter]);
                        inactiveEmbed.setTitle(`This message will auto-delete in ${counter} seconds because of inactivity!`);
                        message.edit({ embeds: [inactiveEmbed] });
                        sentTimeoutMessage = true;
                        if (counter == 0) {
                            PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                            PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                            if (message.deletable == true) {
                                await message.delete();
                            }
                            clearInterval(timeoutInterval);
                            resolve();
                        }
                        counter--;
                    }, 1000);
                }
            }, 300000);
            const resetTimeout = () => {
                clearTimeout(messageTimeout);
                clearInterval(timeoutInterval);
                if (sentTimeoutMessage) {
                    message.edit({ embeds: [embed] });
                    sentTimeoutMessage = false;
                }
                messageTimeout = setTimeout(() => {
                    var counter = 3;
                    if (deleteOnTimeout == false) {
                        message.reactions.removeAll();
                    }
                    else {
                        timeoutInterval = setInterval(async () => {
                            inactiveEmbed.setColor(inactiveColors[counter]);
                            inactiveEmbed.setTitle(`This message will auto-delete in ${counter} seconds because of inactivity!`);
                            message.edit({ embeds: [inactiveEmbed] });
                            sentTimeoutMessage = true;
                            if (counter == 0) {
                                PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                                PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                                if (message.deletable == true && deleteOnTimeout == true) {
                                    await message.delete();
                                }
                                clearInterval(timeoutInterval);
                                resolve();
                            }
                            counter--;
                        }, 1000);
                    }
                }, 300000);
            };
            const letters = ['🇦', '🇧', '🇨', '🇩', '🇪'];
            var selectedList = [];
            reactionAddListner = async (reaction, user) => {
                if (PackageBot_1.default.user.id == user.id)
                    return;
                if (reaction.message.id == message.id && reactions.includes(String(reaction.emoji.name))) {
                    if (letters.includes(reaction.emoji.name)) {
                        resetTimeout();
                        var index = letters.indexOf(reaction.emoji.name);
                        selectedList.push(pcgNumList[index]);
                    }
                    if (reaction.emoji.name == '🗑️') {
                        resetTimeout();
                        if (selectedList.length == 0) {
                            PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                            PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                            clearInterval(timeoutInterval);
                            clearTimeout(messageTimeout);
                            if (message.deletable == true) {
                                await message.delete();
                            }
                            returnVal = { action: 'DELETE-ALL' };
                            resolve();
                        }
                        else {
                            PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                            PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                            clearInterval(timeoutInterval);
                            clearTimeout(messageTimeout);
                            if (message.deletable == true) {
                                await message.delete();
                            }
                            returnVal = { action: 'DELETE', selectedList: selectedList };
                            resolve();
                        }
                    }
                    if (reaction.emoji.name == '➡️') {
                        resetTimeout();
                        PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                        PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                        clearInterval(timeoutInterval);
                        clearTimeout(messageTimeout);
                        if (message.deletable == true) {
                            await message.delete();
                        }
                        returnVal = { action: 'NEXT' };
                        resolve();
                    }
                    if (reaction.emoji.name == '⬅️') {
                        resetTimeout();
                        PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                        PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                        if (message.deletable == true) {
                            await message.delete();
                        }
                        clearInterval(timeoutInterval);
                        clearTimeout(messageTimeout);
                        returnVal = { action: 'PREVIOUS' };
                        resolve();
                    }
                    if (reaction.emoji.name == '✅') {
                        resetTimeout();
                        PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                        PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                        if (message.deletable == true) {
                            await message.delete();
                        }
                        clearInterval(timeoutInterval);
                        clearTimeout(messageTimeout);
                        returnVal = { action: 'CONFIRM' };
                        resolve();
                    }
                    if (reaction.emoji.name == 'ℹ️') {
                        if (infoReturnList == true) {
                            await message.reactions.cache.get('ℹ️').users.remove(user.id);
                            if (selectedList.length == 0) {
                                (0, sendStatus_1.default)('ERROR', channel, "You didn't select any package!", {
                                    footer: 'Select a package first!',
                                    timeout: 5000,
                                });
                            }
                            else {
                                resetTimeout();
                                PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                                PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                                if (message.deletable == true) {
                                    await message.delete();
                                }
                                clearInterval(timeoutInterval);
                                clearTimeout(messageTimeout);
                                returnVal = { action: 'MORE-INFO', selectedList: selectedList };
                                resolve();
                            }
                        }
                        else {
                            resetTimeout();
                            PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                            PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                            if (message.deletable == true) {
                                await message.delete();
                            }
                            clearInterval(timeoutInterval);
                            clearTimeout(messageTimeout);
                            returnVal = { action: 'MORE-INFO' };
                            resolve();
                        }
                    }
                    if (reaction.emoji.name == '❌') {
                        resetTimeout();
                        PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                        PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                        if (message.deletable == true) {
                            await message.delete();
                        }
                        clearInterval(timeoutInterval);
                        clearTimeout(messageTimeout);
                        returnVal = { action: 'CANCEL' };
                        resolve();
                    }
                    if (reaction.emoji.name == '📝') {
                        if (editRequireSelected) {
                            await message.reactions.cache.get('📝').users.remove(user.id);
                            if (selectedList.length == 0) {
                                (0, sendStatus_1.default)('ERROR', channel, "You didn't select any package!", {
                                    footer: 'Select a package first!',
                                    timeout: 5000,
                                });
                            }
                            else if (selectedList.length > 1) {
                                (0, sendStatus_1.default)('ERROR', channel, 'You can only edit one note at a time!', { timeout: 5000 });
                            }
                            else {
                                resetTimeout();
                                PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                                PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                                if (message.deletable == true) {
                                    await message.delete();
                                }
                                clearInterval(timeoutInterval);
                                clearTimeout(messageTimeout);
                                returnVal = { action: 'EDIT', selectedList: selectedList };
                                resolve();
                            }
                        }
                        else {
                            resetTimeout();
                            PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                            PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                            if (message.deletable == true) {
                                await message.delete();
                            }
                            clearInterval(timeoutInterval);
                            clearTimeout(messageTimeout);
                            returnVal = { action: 'EDIT' };
                            resolve();
                        }
                    }
                    if (reaction.emoji.name == '◀️') {
                        resetTimeout();
                        PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                        PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                        if (message.deletable == true) {
                            await message.delete();
                        }
                        clearInterval(timeoutInterval);
                        clearTimeout(messageTimeout);
                        returnVal = { action: 'BACK' };
                        resolve();
                    }
                    if (reaction.emoji.name == '▶️') {
                        resetTimeout();
                        PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                        PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                        if (message.deletable == true) {
                            await message.delete();
                        }
                        clearInterval(timeoutInterval);
                        clearTimeout(messageTimeout);
                        returnVal = { action: 'FORWARD' };
                        resolve();
                    }
                    if (reaction.emoji.name != null &&
                        reactions.includes(reaction.emoji.name) &&
                        !['🗑️', '➡️', '⬅️', '✅', 'ℹ️', '❌', '📝', '◀️', '▶️'].includes(reaction.emoji.name) &&
                        !letters.includes(reaction.emoji.name)) {
                        resetTimeout();
                        PackageBot_1.default.removeListener('messageReactionRemove', reactionRemoveListner);
                        PackageBot_1.default.removeListener('messageReactionAdd', reactionAddListner);
                        if (message.deletable == true) {
                            await message.delete();
                        }
                        clearInterval(timeoutInterval);
                        clearTimeout(messageTimeout);
                        returnVal = { actionIndx: reactions.indexOf(reaction.emoji.name) };
                        resolve();
                    }
                }
            };
            reactionRemoveListner = async (reaction, user) => {
                if (PackageBot_1.default.user.id == user.id)
                    return;
                if (reaction.message.id == message.id) {
                    if (letters.includes(reaction.emoji.name) && reactions.includes(String(reaction.emoji.name))) {
                        resetTimeout();
                        var index = letters.indexOf(reaction.emoji.name);
                        selectedList.splice(selectedList.indexOf(pcgNumList[index]), 1);
                    }
                }
            };
            PackageBot_1.default.on('messageReactionAdd', reactionAddListner);
            PackageBot_1.default.on('messageReactionRemove', reactionRemoveListner);
        });
    });
    return returnVal;
};
module.exports = sendMessage;
exports.default = sendMessage;
//# sourceMappingURL=sendMessage.js.map