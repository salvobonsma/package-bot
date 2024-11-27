"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: __dirname + '/../.env' });
const packageBotError_1 = __importDefault(require("./modules/packageBotError"));
const sendStatus_1 = __importDefault(require("./modules/sendStatus"));
const setLanguage_1 = require("./modules/setLanguage");
const settings_1 = require("./modules/settings");
const Discord = require('discord.js');
const { debugPrefix, prefix } = require('../config.json');
const mongoose = require('mongoose');
const token = process.env.BOT_TOKEN;
const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING',
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'DIRECT_MESSAGE_TYPING',
    ],
    presence: {
        status: 'online',
        activity: {
            name: 'Tracking Packages!',
            type: 'PLAYING',
        },
    },
});
var calls = 0;
var rateLimiterTime = 5;
var limitReached = false;
const maxCalls = 8;
const resetLimit = () => {
    calls = 0;
};
var limitReset = setInterval(() => {
    resetLimit();
}, 300000);
const rateLimiter = () => {
    limitReached = true;
    clearInterval(limitReset);
    const interval = setInterval(() => {
        rateLimiterTime -= 1;
    }, 60000);
    setTimeout(() => {
        clearInterval(interval);
        limitReached = false;
        calls = 0;
        rateLimiterTime = 5;
        limitReset = setInterval(() => {
            resetLimit();
        }, 300000);
        return;
    }, 300000);
};
const sendRateLimitMessage = (channel) => {
    if (limitReached)
        rateLimiter();
    (0, sendStatus_1.default)('WARN', channel, [
        `You have exceeded the maximum of ${maxCalls} calls per 5 minutes!`,
        `You will be able to track your packages in ${rateLimiterTime}` + (rateLimiterTime > 1 ? ' minutes' : ' minute'),
    ].join('\n'), { timeout: 5000, footer: `This doesn't affect the auto status checking!` });
};
mongoose
    .connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
    await (0, settings_1.getSettings)();
})
    .catch((err) => {
    console.log(err);
});
process.on('unhandledRejection', (err) => {
    console.log('Uncaught error:');
    console.log(err);
});
client.once('ready', async () => {
    console.log('PackageBot is ready!');
});
const versions = [
    { version: 'Version 3.3.0 (Current)', changelog: ' - Auto Detect Coureir' },
    { version: 'Version 3.2.0', changelog: ' - Added Spam Protection' },
    { version: 'Version 3.1.1', changelog: ' - Bugfixes Regarding Reactions' },
    { version: 'Version 3.1.0', changelog: ' - English Language Support' },
    { version: 'Version 3.0.0', changelog: ' - Uses Discord.js v13' },
    { version: 'Version 2.1.1', changelog: ' - Changed status-checking interval to 5 minutes' },
    { version: 'Version 2.1.0', changelog: [` - Added UPS support!`].join('\n') },
    { version: 'Version 2.0.0', changelog: [' - Rewritten in TypeScript', ' - Uses MongoDB'].join('\n') },
    { version: 'Version 1.0.0', changelog: ['***First release***', ` - Type ${prefix}help to view all commands!`].join('\n') },
];
var init = false;
client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase().startsWith(`${prefix}init`)) {
        if (init) {
            message.delete();
            (0, sendStatus_1.default)('ERROR', message.channel, 'The bot is already on!', { footer: 'No need to turn it on twice!', timeout: 10000 });
        }
        else {
            init = true;
            checkStatus(message);
            (0, sendStatus_1.default)('SUCCESS', message.channel, 'PackageBot is ready!', {
                footer: 'Now the bot is going to alert you of any package status change!',
            });
        }
    }
    if (message.content.toLowerCase().startsWith(`${prefix}track`)) {
        if (calls >= maxCalls) {
            if (!limitReached)
                limitReached = true;
            sendRateLimitMessage(message.channel);
            return;
        }
        calls++;
        try {
            const command = message.content.split(/ +/);
            const pcg = new Package({ packageNum: command[1], courier: command.length > 2 ? command[2] : '' });
            await showPackage(pcg, message.channel);
        }
        catch (err) {
            await message.delete();
            if (err instanceof packageBotError_1.default) {
                (0, sendStatus_1.default)('ERROR', message.channel, err.errorMsgDescription, { timeout: 5000, footer: err.errorMsgFooter });
            }
            else {
                (0, sendStatus_1.default)('ERROR', message.channel, 'An error has occurred', { timeout: 10000 });
                console.error(err);
            }
        }
    }
    if (message.content.toLowerCase().startsWith(`${prefix}version`) || message.content.toLowerCase().startsWith(`${prefix}v`)) {
        await showVersion(message.channel, versions, 0);
    }
    if (message.content.toLowerCase().startsWith(`${prefix}couriers`)) {
        const couriersEmbed = new Discord.MessageEmbed();
        couriersEmbed
            .setTitle('Supported Couriers:')
            .setDescription(['*DPD*', '*GLS*', '*UPS*'].join('\n'))
            .setColor('GREEN')
            .setFooter('Support for more couriers coming soon!');
        message.channel.send({ embeds: [couriersEmbed] });
    }
    if (message.content.toLowerCase().startsWith(`${prefix}add`)) {
        if (calls >= maxCalls) {
            if (!limitReached)
                limitReached = true;
            sendRateLimitMessage(message.channel);
            return;
        }
        calls++;
        try {
            const command = message.content.split(/ +/);
            const pcg = new Package({
                packageNum: command[1],
                courier: command.length > 2 ? command[2] : '',
            });
            await addPackage(pcg, message.channel);
            (0, sendStatus_1.default)('SUCCESS', message.channel, `Succesfully added a package to your tracking list!\nType \`${prefix}list\` to view it!`, {});
        }
        catch (err) {
            if (err instanceof packageBotError_1.default) {
                (0, sendStatus_1.default)('ERROR', message.channel, err.errorMsgDescription, { timeout: 5000, footer: err.errorMsgFooter });
            }
            else {
                (0, sendStatus_1.default)('ERROR', message.channel, 'An error has occurred', { timeout: 10000 });
                console.error(err);
            }
            await message.delete();
        }
    }
    if (message.content.toLowerCase().startsWith(`${prefix}help`)) {
        const helpEmbed = new Discord.MessageEmbed();
        helpEmbed
            .setTitle('PackageBot Commands:')
            .setColor('GREEN')
            .setDescription([
            `\t- \`${prefix}help\` - shows this message!`,
            `\t- \`${prefix}couriers\` - shows the list of supported couriers!`,
            `\t- \`${prefix}stats\` - shows statistics about the bot!`,
            `\t- \`${prefix}track <package number> <courier>\` - shows info about the package!`,
            `\t- \`${prefix}add <package number> <courier>\` - add the package to your tracking list!`,
            `\t- \`${prefix}list\` - shows your tracking list!`,
            `\t- \`${prefix}init\` - turns the bot on!`,
            `\t- \`${prefix}version\`, \`${prefix}v\` - shows release notes for PackageBot!`,
            `\t- \`${prefix}debug <super secret parms> <other secret parms>\` - super secret stuff, only for authorised people!`,
        ].join('\n'));
        message.channel.send({ embeds: [helpEmbed] });
    }
    if (message.content.toLowerCase().startsWith(`${prefix}list`)) {
        showList(message.channel);
        await message.delete();
    }
    if (message.content.toLowerCase().startsWith(`${debugPrefix} add`)) {
    }
    if (message.content.toLowerCase().startsWith(`${prefix}lang`) || message.content.toLowerCase().startsWith(`${prefix}language`)) {
        (0, setLanguage_1.setLanguage)(message.channel);
    }
});
client.login(token);
exports.default = client;
var { Package } = require('./modules/packageClass');
var addPackage = require('./modules/addPackage');
var showList = require('./modules/showList');
var showPackage = require('./modules/showPackage');
var checkStatus = require('./modules/checkStatus');
var showVersion = require('./modules/showVersion');
//# sourceMappingURL=PackageBot.js.map