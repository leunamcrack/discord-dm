---
description: >-
  Emitted when an user send a DM to the discord client and is received in the
  guild channel
---

# directMessage

| PARAMETER | TYPE | DESCRIPTION |
| :--- | :--- | :--- |
| message | [Message](https://discord.js.org/#/docs/main/stable/class/Message) | The message sent |

```javascript
const dm = new DiscordDM(client);
dm.on('directMessage', (message) => {
    if(message.content == 'help') {
        message.channel.send('Please wait, a staff will answer you shortly.');
        console.log(message.author.tag + ' sent a dm to the bot');
    }
}
```

