---
description: >-
  Emitted when the discord client send a DM to an user and is received in the DM
  channel
---

# guildMessage

| PARAMETER | TYPE | DESCRIPTION |
| :--- | :--- | :--- |
| message | [Message](https://discord.js.org/#/docs/main/stable/class/Message) | The message sent |

```javascript
const dm = new DiscordDM(client);
dm.on('guildMessage', (message) => {
message.channel.send('Message succesfully sent!');
console.log(message.author.tag + ' sent a dm to an user');  
}
```

