var Discord = require('discord.js');
var logger = require('winston');
var fs = require('fs');
var nhl = require('./nhl.js');

var prefix = '!';
var configPath = './config.json';

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Load config
if (process.env.DISCORD_BOT_TOKEN) {
    // heroku config:set DISCORD_BOT_TOKEN=<token>
    var token = process.env.DISCORD_BOT_TOKEN;
} else if (fs.existsSync(configPath)){
    var config = require(configPath);
    /*
    {
        "token": "<token>"
    }
    */
    if (config.token) {
        var token = config.token;
    } else {
        logger.error('token in '+configPath+" not found !");
        process.exit(1);
    }
} else {
    logger.error(configPath+" not found !");
    process.exit(1);
}

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', () => {
    logger.info('Logged in as ' + bot.user.username + ' - (' + bot.user.tag + ')');
});

bot.on('message', message => {
    if (bot.user.id != message.author.id) {
        var args = message.content.slice(prefix.length).trim().split(/\s+/g);
        if (args.length > 0) {
            switch (args[0]) {
                case 'nhl':
                    nhl(args[1] || '', args[2] || '', function (data) {
                        if (data.length) {
                            message.channel.send(data.concat('\n'));
                        } else {
                            message.channel.send('Not found');
                        }
                    });
                    break;

            }
        }
    }
});

bot.login(token);
