---
description: The main hub for interacting with the discord-dm package
---

# DiscordDM

#### Constructor

```javascript
new DiscordDM(client, options)
```

| **PARAMETER** | **TYPE** | **DESCRIPTION** | **OPTIONAL** |
| :--- | :--- | :--- | :--- |
| client | [Client](https://discord.js.org/#/docs/main/stable/class/Client) | The discord client | No |
| options | [DiscordDMOptions](others/discorddmoptions.md) | The discord-dm options | Yes |

#### Properties

* [client](properties/client.md)
* [category](properties/category.md)
* [database](properties/database.md)
* [dmChannels](properties/dmchannels.md)
* [guildChannels](properties/guildchannels.md)
* [options](properties/options.md)

#### Methods

* [dmChannel\(\)](methods/dmchannel.md)
* [guildChannel\(\)](methods/guildchannel.md)

#### Events

* [createDMChannel](events/createdmchannel.md)
* [createGuildChannel](events/createguildchannel.md)
* [directMessage](events/directmessage.md)
* [guildMessage](events/guildmessage.md)

