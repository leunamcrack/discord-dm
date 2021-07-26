---
description: >-
  Emitted when a guild channel was created in the category because an user
  create a DM channel
---

# createGuildChannel

| PARAMETER | TYPE | DESCRIPTION |
| :--- | :--- | :--- |
| channel | [GuildChannel](https://discord.js.org/#/docs/main/stable/class/GuildChannel) | The channel created |
| user | [User](https://discord.js.org/#/docs/main/stable/class/User) | The user who create the channel |

```javascript
const dm = new DiscordDM(client);
dm.on('createGuildChannel', (channel, user) => {
    channel.send('User: ' + user.toString());
    console.log(user.tag + ' created a new guild channel!');
});
```



