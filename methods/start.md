---
description: The main hub for operate the discord-dm package
---

# start

### start\(\[categoryID\]\)

| **PARAMETER** | **TYPE** | **DESCRIPTION** |
| :--- | :--- | :--- |
| categoryID | [Snowflake](https://discord.js.org/#/docs/main/stable/typedef/Snowflake) | The category channel ID when the guild channels will be created |

**Return:** [Void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

```javascript
const dm = new DiscordDM(client, options)

client.on('ready', () => {
    dm.start('123456789012345678');
});
```

