---
description: Emitted when a user creates a DM channel between the discord client and him
---

# createDMChannel

| **PARAMETER** | **TYPE** | **DESCRIPTION** |
| :--- | :--- | :--- |
| channel | [DMChannel](https://discord.js.org/#/docs/main/stable/class/DMChannel) | The DM channel created |
| user | [User](https://discord.js.org/#/docs/main/stable/class/User) | The user who create the channel |

```javascript
const dm = new DiscordDM(client);
dm.on('createDMChannel', (channel, user) => {
    channel.send(user.tag + ', a staff will answer you shortly.');
    console.log(user.tag + ' created a new dm channel!');
}
```

