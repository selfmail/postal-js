# postal-js

A libray for sending emails with the postal api.

## Documentation

Install the library with your favourite package manager:

```bash
npm install postal-js
pnpm add postal-js
bun add postal-js
```

Then import it in your code and fill out the required informations to connect to the api:

```js
import Postal from "postal-js";

export const postal = new Postal({
  key: "YOUR_API_KEY",
  url: "https://postal.example.com",
});
```

### Sending an email

```js
const msg = await postal.sendMessage({
  to: "user@example.com",
  from: "me@example.com",
  subject: "Hello",
  html_body: "<h1>Hello World</h1>",
});
```
