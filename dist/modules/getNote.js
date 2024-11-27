"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PackageBot_1 = __importDefault(require("../PackageBot"));
const sendStatus_1 = __importDefault(require("./sendStatus"));
const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const getNote = (channel) => {
    return new Promise((resolve) => {
        const noteEmbed = new Discord.MessageEmbed();
        noteEmbed.setColor('BLUE').setTitle('Add a Note!').setDescription(`Type \`${prefix}note <note>\` to add a note!`);
        channel.send({ embeds: [noteEmbed] }).then((message) => {
            var messageListner;
            const inactiveEmbed = new Discord.MessageEmbed();
            inactiveEmbed.setColor('YELLOW').setFooter('React to cancel!');
            const inactiveColors = ['RED', 'ORANGE', 'GOLD', 'YELLOW'];
            var timeoutInterval;
            var sentTimeoutMessage = false;
            var messageTimeout = setTimeout(() => {
                var counter = 3;
                timeoutInterval = setInterval(() => {
                    inactiveEmbed.setColor(inactiveColors[counter]);
                    inactiveEmbed.setTitle(`This message will auto-delete in ${counter} seconds because of inactivity!`);
                    if (message.editable == true) {
                        message.edit({ embeds: [inactiveEmbed] });
                    }
                    sentTimeoutMessage = true;
                    if (counter == 0) {
                        PackageBot_1.default.removeListener('messageCreate', messageListner);
                        if (message.deletable == true) {
                            message.delete();
                        }
                        clearTimeout(messageTimeout);
                        clearInterval(timeoutInterval);
                        resolve('');
                    }
                    counter--;
                }, 1000);
            }, 30000);
            const resetTimeout = () => {
                clearTimeout(messageTimeout);
                clearInterval(timeoutInterval);
                if (sentTimeoutMessage) {
                    if (message.editable == true) {
                        message.edit({ embeds: [noteEmbed] });
                    }
                    sentTimeoutMessage = false;
                }
                messageTimeout = setTimeout(() => {
                    var counter = 3;
                    timeoutInterval = setInterval(() => {
                        inactiveEmbed.setColor(inactiveColors[counter]);
                        inactiveEmbed.setTitle(`This message will auto-delete in ${counter} seconds because of inactivity!`);
                        if (message.editable == true) {
                            message.edit({ embeds: [inactiveEmbed] });
                        }
                        sentTimeoutMessage = true;
                        if (counter == 0) {
                            PackageBot_1.default.removeListener('messageCreate', messageListner);
                            clearTimeout(messageTimeout);
                            clearInterval(timeoutInterval);
                            if (message.deletable == true) {
                                message.delete();
                            }
                            resolve('');
                        }
                        counter--;
                    }, 1000);
                }, 30000);
            };
            messageListner = (msg) => {
                if (msg.content.toLowerCase().startsWith(`${prefix}note `)) {
                    resetTimeout();
                    if (msg.content.split(`${prefix}note `)[1] != '' && msg.content.split(`${prefix}note `)[1].length <= 40) {
                        PackageBot_1.default.removeListener('messageCreate', messageListner);
                        clearTimeout(messageTimeout);
                        clearInterval(timeoutInterval);
                        if (message.deletable == true) {
                            message.delete();
                        }
                        resolve(msg.content.split(`${prefix}note `)[1]);
                    }
                    else {
                        (0, sendStatus_1.default)('ERROR', channel, `A note must be at least 1 character long and can't be longer then 40!\nType \`${prefix}note <note>\` to try again.`, { timeout: 5000 });
                    }
                }
            };
            PackageBot_1.default.on('messageCreate', messageListner);
        });
    });
};
module.exports = getNote;
exports.default = getNote;
//# sourceMappingURL=getNote.js.map