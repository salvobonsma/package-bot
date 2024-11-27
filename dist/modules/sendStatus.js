"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require('discord.js');
const sendStatus = async (status, channel, message, { footer = '', timeout = -1, title = '' }) => {
    return new Promise((resolve) => {
        const statusEmbed = new Discord.MessageEmbed().setDescription(message);
        if (footer != '')
            statusEmbed.setFooter(footer);
        switch (status) {
            case 'SUCCESS':
                statusEmbed.setColor('GREEN').setTitle('Success!');
                break;
            case 'WARN':
                statusEmbed.setColor('YELLOW');
                break;
            case 'ERROR':
                statusEmbed.setColor('RED').setTitle('Error!');
                break;
        }
        if (title != '')
            statusEmbed.setTitle(title);
        if (timeout != -1) {
            channel.send({ embeds: [statusEmbed] }).then((msg) => {
                setTimeout(async () => {
                    if (msg.deletable) {
                        await msg.delete();
                    }
                    resolve();
                }, timeout);
            });
        }
        else {
            channel.send({ embeds: [statusEmbed] });
        }
    });
};
module.exports = sendStatus;
exports.default = sendStatus;
//# sourceMappingURL=sendStatus.js.map