# discord-dm

> This package is under development, so if you find any bug or need help, please go to the [github issues](https://github.com/leunamcrack/discord-dm/issues).<br>

`discord-dm will help you to manage DM's between users and your bot, just need your discord client and the category channel ID where the guild channels will be created`

🍏 Install: [Click here](https://www.npmjs.com/package/discord-dm)<br>
📕 Documentation: [Click here](https://leunamcrack.gitbook.io/discord-dm/)<br>
📁 GitHub: **You are already here**<br>
🎫 Server support: [Click here](https://dsc.gg/snakeeworld)<br>

#### Installation
```sh
npm install discord-dm
```

#### Setup
```js
const Discord = require('discord.js');
const client = new Discord.Client();
const DiscordDM = require('discord-dm');
const dm = new DiscordDM(client, {
  folder: 'stuff',
  members: ['123456789012345678', '123456789012345678']
});

client.on('ready' () => {
  dm.start('123456789012345678');
})

//More info in the documentation page
```

#### Features
- Send and receive DMs with your bot
- You can edit or eliminate a DM
- Support for external emojis
- Customizable channel and category
