---
description: Gets the guild channel for a user
---

# guildChannel

### guildChannel\(\[userResolvable\]\)

| PARAMETER | TYPE | DESCRIPTION |
| :--- | :--- | :--- |
| userResolvable | [UserResolvable](../others/userresolvable.md) | The user resolvable to get the guild channel |

**Return:** [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) &lt;[GuildChannel](https://discord.js.org/#/docs/main/stable/class/DMChannel)&gt;

```javascript
const dm = new DiscordDM(client, options)

client.on('message', (message) => {
    dm.guildChannel(message).then((channel) => {
        console.log(channel);
    });
});
```

