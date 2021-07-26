---
description: The discord-dm client options
---

# DiscordDMOptions

| **OPTION** | **TYPE** | **DESCRIPTION** | **OPTIONAL** | **DEFAULT** |
| :--- | :--- | :--- | :--- | :--- |
| folder | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | The folder name where the discord-dm database located | Yes | `"database"` |
| keep | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | The option to keep messages in the guild channel even if the user has deleted them in the DM channel | Yes | `false` |
| members | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) &lt;[Snowflake](https://discord.js.org/#/docs/main/stable/typedef/Snowflake)&gt; | The array with user IDs that will have permissions on the category | Yes | `null` |

```javascript
const dm = new DiscordDM(client, {
    folder: 'stuff', //folder name
    keep: true, //keep messages
    members: ['1234567890', '9876543210'] //user IDs
})
```

