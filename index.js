'use strict';

const Discord = require('discord.js');
const collection = new Discord.Collection();
const db = require('megadb');
const EventEmitter = require('events');

class DiscordDm extends EventEmitter {
    constructor (client, options = {}) {
        super();
        if (!client) throw ReferenceError('INVALID_CLIENT: Client not defined');
        if (typeof client !== 'object') throw TypeError('INVALID_CLIENT: The client must be a object');
        if (!(client instanceof Discord.Client)) throw Error('INVALID_CLIENT: The client object is invalid');
        if (!Object.keys(options).length) options = {folder: 'database', keep: false, members: []};
        if (Object.keys(options).length) {
            if(!options.folder) {
                options.folder = 'database';
            } else {
                if(typeof options.folder !== 'string') options.folder = 'database';
            }
            if(!options.keep) {
                options.keep = false;
            } else {
                if (typeof options.keep !== 'boolean') options.keep = false;
            }
            if(!options.members) {
                options.members = [];
            } else {
                if(options.members instanceof Array) options.members = [];
            }
        };
        this.client = client;
        this.category = null;
        this.options = {
            folder: options.folder,
            keep: options.keep,
            members: options.members
        };
        this.database = new db.crearDB({
            nombre: 'discorddm',
            carpeta: this.options.folder
        });
    };
    start(category) {        
        if (!category) throw ReferenceError('INVALID_CATEGORY: Category not defined');
        if (typeof category !== 'string') throw TypeError('INVALID_CATEGORY: The category must be a string');
        if (!this.client.channels.cache.get(category)) throw Error('INVALID_CATEGORY: The category ID is invalid');
        if (this.client.channels.cache.get(category).type !== 'category') throw ReferenceError('INVALID_CATEGORY: The ID must be a category channel');
        this.category = this.client.channels.cache.get(category);
        this._checker(category);
        this.client.on('message', async message => {
            if(message.author.bot) return;
            if(message.channel.type == 'dm') {
                let getchannel = await this.database.get(`${message.author.id}.channels.guild`);
                if (!getchannel) {
                    this._createChannel(message, category);
                } else {
                    this._sendGuildMessage(message, getchannel, category);
                }
            } else if (message.guild) {
                if (message.channel.parentID !== category) return;
                let notdm = await this.database.find(false, u => u.channels.guild == message.channel.id); 
                if (!notdm) return;
                let userID = await this.database.findKey(false, u => u.channels.guild == message.channel.id)
                this._sendDirectMessage(message, userID, category);
            }
        });
        this.client.on('messageUpdate', async (oldmsg, newmsg) => {
            if (newmsg.author.bot) return;
            if (oldmsg.channel.type == 'dm' && newmsg.channel.type == 'dm') {
                if(oldmsg.id == newmsg.id) {
                    this._editGuildMessage(newmsg, category);
                } 
            } else if (newmsg.channel.parentID == category) {
                if (newmsg.channel.parentID !== category) return;
                let notdm = await this.database.find(false, u => u.channels.guild == newmsg.channel.id);
                this._editDirectMessage(newmsg, category);
            }
        });
        this.client.on('messageDelete', async message => {
            if (message.author.bot) return;
            if (message.channel.type == 'dm') {
                this._deleteGuildMessage(message); 
            } else if (message.channel.parentID == category) {
                if (message.channel.parentID !== category) return;
                let notdm = await this.database.find(false, u => u.channels.guild == message.channel.id);
                this._deleteDirectMessage(message);
            }
        })
        this.client.on('channelCreate', channel => {
            if(channel.type == 'dm') {
                this.emit('createDMChannel', channel, channel.recipient);
            }
        })
    };
    async _checker(categoryID) {
        let category = this.client.channels.cache.get(categoryID);
        let permissions = [{
            id: category.guild.id,
            deny: ['VIEW_CHANNEL']
        }];

        if(this.options.members.length) {
            for (const userID of this.options.members) {
                let user = this.client.users.cache.get(userID);
                if(user) {
                    let perm = {
                        id: userID,
                        allow: ['VIEW_CHANNEL']
                    };
                    permissions.push(perm);
                }
            }
        }
        category.overwritePermissions(permissions);
        category.children.each(g => g.lockPermissions());
        let guildchannels = await this.database.map(false, u => u.channels.guild);
        let dmchannels = await this.database.map(false, u => u.channels.dm);
        for(const channelID of guildchannels) {
            let channel = await this.client.channels.fetch(channelID);
            if(channel) {
                channel.messages.fetch({limit: 100});
            }
        }
        for(const channelID of dmchannels) {
            let channel = await this.client.channels.fetch(channelID);
            if(channel) {
                channel.messages.fetch({limit: 100});
            }
        }
    }
    async _createChannel(message, category) {
        let guild = this.client.channels.cache.get(category).guild;
        let newchannel = await guild.channels.create(message.author.tag, {parent: category});
        this.emit('createGuildChannel', newchannel, message.author);
        let msg = await newchannel.send(message.content, {files: message.attachments.map(a => a.url)})
        this.database.set(message.author.id, {
            channels: {dm: message.channel.id, guild: newchannel.id},
            messages: [{dm: message.id, guild: msg.id}]
        });
    }
    async _sendGuildMessage(message, channelID, category) {
        let guildchannel = this.client.channels.cache.get(channelID)
        if (!guildchannel || guildchannel.deleted) {
            this.database.delete(message.author.id);
            this._createChannel(message, category); 
            return;
        }
        let content = await this._checkEmoji(message, category);
        let msg = await guildchannel.send(content, {files: message.attachments.map(a => a.url)})
        if (msg) {
            this.database.push(`${message.author.id}.messages`, {dm: message.id, guild: msg.id})
            this.emit('directMessage', message);
            this._deleteEmojis(content, category);
        }
    }
    async _sendDirectMessage(message, userID, category) {
        let user = this.client.users.cache.get(userID);
        if (!user) throw Error('USER: User not found in the guild channel');
        let content = await this._checkEmoji(message, category);
        let msg = await user.send(content, {files: message.attachments.map(a => a.url)}).catch(e => {message.channel.send('User has closed DM\'s')});
        if (msg) {
            this.database.push(`${message.author.id}.messages`, {dm: msg.id, guild: message.id});
            this.emit('guildMessage', message);
            this._deleteEmojis(content, category);
        }
    }
    async _editGuildMessage(message, category) {
        let channelID = await this.database.get(`${message.author.id}.channels.guild`);
        let channel = this.client.channels.cache.get(channelID);
        let msg = await this.database.find(`${message.author.id}.messages`, a => a.dm == message.id);
        let msgedit = channel.messages.cache.get(msg.guild);
        let content = await this._checkEmoji(message, category);
        msgedit.edit(content, {files: message.attachments.map(a => a.url)});
    }
    async _editDirectMessage(message, category) {
        let user = await this.database.findKey(false, u => u.channels.guild == message.channel.id);
        let channelID = await this.database.get(`${user}.channels.dm`);
        let channel = this.client.channels.cache.get(channelID);
        let msg = await this.database.find(`${user}.messages`, a => a.guild == message.id);
        let msgedit = channel.messages.cache.get(msg.dm);
        let content = await this._checkEmoji(message, category);
        msgedit.edit(content, {files: message.attachments.map(a => a.url)});
    }
    async _deleteGuildMessage(message) {
        if(!this.options.keep) {
            let channelID = await this.database.get(`${message.author.id}.channels.guild`);
            let channel = this.client.channels.cache.get(channelID);
            let msg = await this.database.find(`${message.author.id}.messages`, a => a.dm == message.id);
            let msgedit = channel.messages.cache.get(msg.guild);
            msgedit.delete();
        }
    }
    async _deleteDirectMessage(message) {
        let user = await this.database.findKey(false, u => u.channels.guild == message.channel.id);
        let channelID = await this.database.get(`${user}.channels.dm`);
        let channel = this.client.channels.cache.get(channelID);
        let msg = await this.database.find(`${user}.messages`, a => a.guild == message.id);
        let msgedit = channel.messages.cache.get(msg.dm);
        msgedit.delete();
    }
    async dmChannel(userResolvable) {
        let user = this.client.users.resolve(userResolvable);
        if (!user) throw TypeError('INVALID_USER: Invalid user or not found');
        let userID = user.id;
        let channelID = await this.database.get(`${userID}.channels.dm`);
        return this.client.channels.cache.get(channelID);
    }
    async guildChannel(userResolvable) {
        let user = this.client.users.resolve(userResolvable);
        if (!user) throw TypeError('INVALID_USER: Invalid user or not found');
        let userID = user.id;
        let channelID = await this.database.get(`${userID}.channels.guild`);
        return this.client.channels.cache.get(channelID);
    }
    async _checkEmoji(message, category) {
        const listemojis = new Set();
        let content = message.content;
        let staticemojis = content.match(/<:.+?:\d+>/g);
        let animatedemojis = content.match(/<a:.+?:\d+>/g);
        if(staticemojis) {
            for (const stringemoji of staticemojis) {
                if(!listemojis.has(stringemoji)) {
                    let guild = this.client.channels.cache.get(category).guild;
                    let dataemoji = stringemoji.match(/\w+/g);
                    let name = dataemoji[0];
                    let id = dataemoji[1];
                    let url = `https://cdn.discordapp.com/emojis/${id}.png`;
                    let emoji = await guild.emojis.create(url, name);
                    let stringemojinew = emoji.toString();
                    let equals = staticemojis.filter(e => e == stringemoji);
                    for (const same of equals) {
                        content = content.replace(same, stringemojinew);
                    }
                    listemojis.add(stringemoji);
                }
            }
        }
        if(animatedemojis) {
            for (const stringemoji of animatedemojis) {
                if(!listemojis.has(stringemoji)) {
                    let guild = this.client.channels.cache.get(category).guild;
                    let dataemoji = stringemoji.match(/\w+/g);
                    let name = dataemoji[1];
                    let id = dataemoji[2];
                    let url = `https://cdn.discordapp.com/emojis/${id}.gif`;
                    let emoji = await guild.emojis.create(url, name);
                    let stringemojinew = emoji.toString();
                    let equals = animatedemojis.filter(e => e == stringemoji);
                    for (const same of equals) {
                        content = content.replace(same, stringemojinew);
                    }
                    listemojis.add(stringemoji)
                }
            }
        }
        listemojis.clear();
        return content;
    }
    async _deleteEmojis(content, category) {
        const listemojis = new Set();
        let staticemojis = content.match(/<:.+?:\d+>/g);
        let animatedemojis = content.match(/<a:.+?:\d+>/g);
        if(staticemojis) {
            for(const stringemoji of staticemojis) {
                if(!listemojis.has(stringemoji)) {
                    let dataemoji = stringemoji.match(/\w+/g)
                    let id = dataemoji[1];
                    let guild = this.client.channels.cache.get(category).guild;
                    let guildemoji = guild.emojis.cache.get(id);
                    if(guildemoji !== 'undefined') {
                        guildemoji.delete();
                    }
                    listemojis.add(stringemoji);
                }
            }
        }
        if(animatedemojis) {
            for(const stringemoji of animatedemojis) {
                if(!listemojis.has(stringemoji)) {
                    let dataemoji = stringemoji.match(/\w+/g)
                    let id = dataemoji[2];
                    let guild = this.client.channels.cache.get(category).guild;
                    let guildemoji = guild.emojis.cache.get(id);
                    if(guildemoji !== 'undefined') {
                        guildemoji.delete();
                    }
                    listemojis.add(stringemoji);
                }
            }
        }
        listemojis.clear();
    };
    get dmChannels() {
        return this.client.channels.cache.filter(c => c.type == 'dm');
    }
    get guildChannels() {
        return this.client.channels.cache.filter(c => c.parentID == this.category.id)
    }
}

module.exports = DiscordDm;