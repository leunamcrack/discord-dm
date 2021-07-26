---
description: The user resolvable
---

# UserResolvable

Data that resolves to return a [User](https://discord.js.org/#/docs/main/stable/class/User) object  
This can be:

* [User](https://discord.js.org/#/docs/main/stable/class/User)  `an user object`
* [Snowflake ](https://discord.js.org/#/docs/main/stable/typedef/Snowflake) `an user id`
* [GuildMember ](https://discord.js.org/#/docs/main/stable/class/GuildMember) `a guild member object`
* [Message ](https://discord.js.org/#/docs/main/stable/class/Message) `a message object (resolves to the message author)`

```javascript
const dm = new DiscordDM(client)

dm.guildChannel(message); //message
dm.dmChannel(message.author); //user
dm.dmChannel('123456789012345678'); //snowflake
```

**More info:** [Click here](https://discord.js.org/#/docs/main/stable/typedef/UserResolvable)

