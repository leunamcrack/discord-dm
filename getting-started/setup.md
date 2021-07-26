---
description: Information about how to setup discord-dm in your discord bot
---

# Setup

Once you have installed the package correctly you must setup the package for it to work.

First, you will have to import the package and define it

```javascript
const DiscordDM = require('discord-dm');
```

Then, you must create a new discord-dm client:

| **PARAMETER** | **TYPE** | **DESCRIPTION** | **OPTIONAL** |
| :--- | :--- | :--- | :--- |
| client | [Client](https://discord.js.org/#/docs/main/stable/class/Client) | The discord client | No |
| options | [DiscordDMOptions](../others/discorddmoptions.md) | The discord-dm client options | Yes |

```javascript
const dm = new DiscordDM(client, options)
```

After, in the ready event of your discord client need to start the discord-dm client

| **PARAMETER** | **TYPE** | **DESCRIPTION** | **OPTIONAL** |
| :--- | :--- | :--- | :--- |
| category | [Snowflake](https://discord.js.org/#/docs/main/stable/typedef/Snowflake) | The category channel ID when the DM's channels will be created | No |

```javascript
//client is your discord client
client.on('ready', () => {
    dm.start(category);
})
```

