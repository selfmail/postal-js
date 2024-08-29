# postal-js

A simple libray for sending emails with the postal api or accessing the informations of a message.

## Documentation

Install the library with your favourite package manager:

```bash
npm install postal-js
pnpm add postal-js
bun add postal-js
```

Then import it in your code and fill out the required informations to connect to the api:

```ts
import Postal from "postal-js";

export const postal = new Postal({
  key: "YOUR_API_KEY",
  url: "https://postal.example.com",
});
```

You can use the exported class in your project to send emails.

### Sending an email

To send an email, you need to provide the following information:

- `to`: The email address of the recipient.
- `from`: The email address of the sender.
- `subject`: The subject of the email.
- `html_body` or `plain_body`: The HTML body of the email.

There are also some optional parameters you can provide:

- `reply_to`: The email address to use as the reply-to address.
- `attachments`: An array of attachments to include in the email.
- `headers`: An object of headers to include in the email.
- `tag`
- `sender`
- `bounce`
- `cc`
- `bcc`

```ts
const msg = await postal.sendMessage({
  to: "user@example.com",
  from: "me@example.com",
  subject: "Hello",
  html_body: "<h1>Hello World</h1>",
});
```

If you ran this code, you will receive a response like this:

```ts
console.log(msg); /* => {
  success: boolean,
    flags: Record<string, any>,
    time: number
    status: "success" | "error",
    data: {
        // error fields
        message?: string,
        code?: string,

        // success fields
        messages?: Record<string, {
            id: Number,
            token: string
        }>,
        messages_id?: string,
    },
    error: string
} */
```

### Send a raw email

If you want to send a raw email, an RFC2822 formatted email, encoded as a base64 string is also possible.

> [!TIP] When you should using an raw email?
> Raw emails are useful when you want to send emails that are not RFC2822 formatted. For example, if you want to send an email with a subject that contains a colon, you will need to use a raw email.

This is an example for a RFC2822 formatted email:

```
From: sender@example.com
To: recipient@example.com
Subject: Hey!
Date: Mon, 28 Aug 2023 12:34:56 +0000
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
```

And this is an example for a base64 encoded RFC2822 formatted email:

```
RnJvbTogc2VuZGVyQGV4YW1wbGUuY29tClRvOiByZWNpcGllbnRAZXhhbXBsZS5jb20KU3ViamVjdDogSGV5IQpEYXRlOiBNb24sIDI4IEF1ZyAyMDIzIDEyOjM0OjU2ICswMDAwCk1JTUUtVmVyc2lvbjogMS4wCkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD1VVEYtOA==
```

You can give following informations to this function:

- `rcpt_to`: The email address of the recipient.
- `mail_from` the adress of the sender.
- `bounce` a boolean indicating if the email should be bounced.
- `data` the base64 encoded RFC2822 formatted email.

You are now able to send your email with this function:

```ts
const msg = await postal.sendRawEmail({
  to: "user@example.com",
  from: "me@example.com",
  subject: "Hey!",
  raw_email:
    "RnJvbTogc2VuZGVyQGV4YW1wbGUuY29tClRvOiByZWNpcGllbnRAZXhhbXBsZS5jb20KU3ViamVjdDogSGV5IQpEYXRlOiBNb24sIDI4IEF1ZyAyMDIzIDEyOjM0OjU2ICswMDAwCk1JTUUtVmVyc2lvbjogMS4wCkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD1VVEYtOA==",
});
```

The response is the same as the previous example.

### Message Details

You can also get the details of an message with this library. This is useful if you want to access certain informations about the message, like the body or subject.

```ts
const msg = await postal.getMessageDetails({
  id: "MESSAGE_ID",
});
```

You can get your message id from the response of the `sendMessage` or `sendRawEmail` function. You can find the id in the `id` field of the response.

This is an example to get the id of a message:

```ts
console.log(msg); /* => {
  success: boolean,
    flags: Record<string, any>,
    time: number
    status: "success" | "error",
    data: {
        // error fields
        message?: string,
        code?: string,

        // success fields
        messages?: Record<string, {
            id: Number, <== This is the id of the message
            token: string
        }>,
        messages_id?: string, <== NOT THE ID !!!
    },
    error: string
} */
```

You can also select what informations you want to receive from this function. For example, if you only want to get the subject of the message, you can do this:

```ts
const msg = await postal.getMessageDetails({
  id: "MESSAGE_ID",
  expansions: ["subject"],
});
```

These are all the possible expansions:

"status" | "details" | "inspection" | "plain_body" | "html_body" | "attachments" | "headers" | "raw_message" | "activity_entries"

If you want to get all of the informations you can simply do this:

```ts
const msg = await postal.getMessageDetails({
  id: "MESSAGE_ID",
  expansions: true,
});
```

A response will look like this:

```ts
console.log(msg); /* => {
    success: boolean,
    flags: Record<string, any>,
    time: number
    status: "success" | "error",
    data: {
        id: number,

        // error fields
        message?: string,
        code?: string,

        // fields which are only avaiable is the status is success
        status?: {
            status: string;
            last_delivery_attempt: number;
            held: boolean;
            hold_expiry: number | null;
        };
        details?: {
            rcpt_to: string;
            mail_from: string;
            subject: string;
            message_id: string;
            timestamp: number;
            direction: string;
            size: string;
            bounce: boolean;
            bounce_for_id: number;
            tag: string | null;
            received_with_ssl: boolean;
        };
        inspection?: {
            inspected: boolean;
            spam: boolean;
            spam_score: number;
            threat: boolean;
            threat_details: string | null;
        };
        plain_body?: string;
        html_body?: string | null;
        attachments?: any[];
        headers?: {
            received: string[];
            date: string[];
            from: string[];
            to: string[];
            "message-id": string[];
            subject: string[];
            "mime-version": string[];
            "content-type": string[];
            "content-transfer-encoding": string[];
            "dkim-signature": string[];
            "x-postal-msgid": string[];
        };
        raw_message?: string;
        activity_entries?: {
            loads: any[];
            clicks: any[];
        };
    },
    error: string
```

Based on the selection of the expansions, you will receive different fields in the response. This example of an response contains all fields.

### Receiving the deliveries of a message

You can also receive the deliveries of a message. This is useful if you want to know when a message was delivered.

```ts
const msg = await postal.getMessageDeliveries({
  id: "MESSAGE_ID",
});
```

A response will look like this:

```ts
console.log(msg); /* => {
    success: boolean,
    flags: Record<string, any>,
    time: number
    status: "success" | "error",
    data: {
        id: number;

        // error fields
        message?: string,
        code?: string,

        // fields which are only avaiable is the status is success
        status?: string;
        details?: string;
        output?: string;
        sent_with_ssl?: boolean;
        log_id?: string;
        time?: number;
        timestamp?: number;
    }[],
    error: string
}
```

Please note that the `data` field is an array of objects. Each object represents a delivery of the message.

## License

The Project is licensed under the MIT License.

---

<sub>
  This project is part of the <a href="https://selfmail.app">selfmail</a> project. We made this library with much ♥️ and appreciate any feedback or contributions.
</sub>
