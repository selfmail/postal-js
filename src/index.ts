
import { MessageDeliveris, MessageDeliveryResponse, MessageDetails, MessageDetailsResponse, RawMessage, RawMessageResponse, SendMessage, SendMessageResponse } from "./types";

export default class Postal {
    /**
     * Private api key to access the postal api.
     */
    private key: string;

    /**
     * The url to the postal api.
     */
    private url: string;

    /**
     * Please insert here your postal api key and the url to your web dashboard. Keep in mind, that your api key must
     * be private and not shared with anyone. You can use enviroment variables
     * to store your key. 
     * 
     * ### Get the api key:
     * You can get your api key from the postal web dashboard. For this please go 
     * to the tab "Credentials" and create a new api credential. Copy the api key
     * and insert it here.
     * 
     * ### Example:
     *
     * ```ts
     * import Postal from 'postal-js';
     * 
     * // example values
     * export const postal = new Postal({
     *     key: process.env.POSTAL_API_KEY,
     *     url: 'https://api.postalserver.io'
     * });
     * ```
     */
    constructor({
        key,
        url
    }: {
        /**Your private postal api key. */
        key: string,
        /**Your postal api url. */
        url: string
    }) {
        this.key = key;
        this.url = url;
    }

    /**
     * Sends an email to the specified address. This will create an api call 
     * to your given url with the given key. If an error occurs, we will return 
     * the error.
     * 
     * Example:
     * 
     * ```ts
     * import { postal } from './postal';
     * 
     * const send = async () => {
     *     const msg = await postal.sendMessage({        
     *         to: 'test@test.com',
     *         subject: 'Test',
     *         html_body: '<h1>Hello World</h1>'
     *     });
     * 
     *     // log the error if it occured
     *     if (!msg.success) {
     *         return console.error(msg.data.error);
     *     }
     *     // process everything
     * }
     * ```
     */
    public async sendMessage({
        to,
        subject,
        cc,
        bcc,
        from,
        sender,
        html_body,
        attachments,
        bounce,
        plain_body,
        reply_to,
        tag
    }: SendMessage): Promise<SendMessageResponse> {
        const msg = await fetch(`${this.url.startsWith("http") ? "" : "https://"}${this.url}/api/v1/send/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Server-API-Key": this.key
            },
            body: JSON.stringify({
                to,
                subject,
                cc,
                bcc,
                from,
                sender,
                html_body,
                attachments,
                bounce,
                plain_body,
                reply_to,
                tag
            })
        });

        if (!msg.ok) {
            throw new Error(`Fetch error. We could not reach the postal api. Please check your internet connection and the given url. The given url is: ${this.url} and this is the status text: ${msg.statusText} (${msg.status})`);
        }

        const data = await msg.json() as Omit<SendMessageResponse, "success">;

        // throw error if api key is wrong, or the url
        if (data.data.code === "InvalidServerAPIKey") {
            throw new Error("Invalid server api key. When you don't now how to create an api key, please visit https://github.com/selfmail/postal-js.");
        }

        return {
            success: data.status === "error" ? false : true,
            ...data
        }
    }

    /**
     * Get the details of a message, you can choose which details you want to receive. The id means the id of the email. 
     * 
     * 
     * Here's an example how to get the id: 
     * ```json
     * {
     *     "status": "success",
     *     "time": 0.000,
     *     "flags": {},
     *     "data": {
     *         "message_id": "---", <= not your id !!!!
     *         "messages": {
     *             "mail@example.com": {
     *                 "id": 1, <= your id
     *                 "token": "_______"
     *             }
     *         }
     *     }
     * }
     * ```
     */
    public async messageDetails({
        id,
        expansions
    }: MessageDetails): Promise<MessageDetailsResponse> {
        const msg = await fetch(`${this.url.startsWith("http") ? "" : "https://"}${this.url}/api/v1/messages/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Server-API-Key": this.key
            },
            body: JSON.stringify({
                id,
                _expansions: expansions
            })
        });

        if (!msg.ok) {
            throw new Error("Fetch error. We could not reach the postal api. Please check your internet connection and the given url. The given url is: " + this.url);
        }

        const data = await msg.json() as Omit<MessageDetailsResponse, "success">;

        // throw error if api key is wrong, or the url
        if (data.data.code === "InvalidServerAPIKey") {
            throw new Error("Invalid server api key. When you don't now how to create an api key, please visit https://github.com/selfmail/postal-js.");
        }

        return {
            ...data,
            success: data.status === "error" ? false : true
        }
    }

    /**
     * With this endpoint you can check if the message was delivered. You need the id of the message. 
     * 
     * Here's an example how to get the id: 
     * ```json
     * {
     *     "status": "success",
     *     "time": 0.000,
     *     "flags": {},
     *     "data": {
     *         "message_id": "---", <= not your id !!!!
     *         "messages": {
     *             "mail@example.com": {
     *                 "id": 1, <= your id
     *                 "token": "_______"
     *             }
     *         }
     *     }
     * }
     * ```
     * 
     * The response is an array of objects which contains the informations about the delivery. A array is used to show the multiple deliveries.
     */
    public async messageDelivery({
        id
    }: MessageDeliveris): Promise<MessageDeliveryResponse> {
        const msg = await fetch(`${this.url.startsWith("http") ? "" : "https://"}${this.url}/api/v1/messages/delivery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Server-API-Key": this.key
            },
            body: JSON.stringify({
                id
            })
        });

        if (!msg.ok) {
            throw new Error("Fetch error. We could not reach the postal api. Please check your internet connection and the given url. The given url is: " + this.url);
        }

        const data = await msg.json() as Omit<MessageDeliveryResponse, "success">;


        return {
            ...data,
            success: data.status === "error" ? false : true
        }
    }

    /**
     * Send a raw message to a recipient with an RFC2822 formatted email in the base64 format. This works similar to the sendMessage method, with the 
     * difference that you can send a raw message and files could be better supported.
     * 
     * This is an example of an RFC2822 formatted email:
     * 
     * ```
     * From: sender@example.com
     * To: recipient@example.com
     * Subject: Hey!
     * Date: Mon, 28 Aug 2023 12:34:56 +0000
     * MIME-Version: 1.0
     * Content-Type: text/plain; charset=UTF-8
     * 
     * Hello World!
     * ```
     * 
     * The data will be now encoded in base64 and will be send to the recipient. You can choose the recipient with the rcpt_to parameter. This will get
     * an array of string which should be the email addresses for your recipients.
     */
    public async sendRawMessage({ data, mail_from, rcpt_to, bounce }: RawMessage): Promise<RawMessageResponse> {
        const msg = await fetch(`${this.url.startsWith("http") ? "" : "https://"}${this.url}/api/v1/send/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Server-API-Key": this.key
            },
            body: JSON.stringify({
                data,
                mail_from,
                rcpt_to,
                bounce
            })
        });

        if (!msg.ok || msg.status !== 404) {
            throw new Error("Fetch error. We could not reach the postal api. Please check your internet connection and the given url. The given url is: " + this.url);
        }

        const json = await msg.json() as Omit<RawMessageResponse, "success">;

        // throw error if api key is wrong, or the url
        if (json.data.code === "InvalidServerAPIKey") {
            throw new Error("Invalid server api key. When you don't now how to create an api key, please visit https://github.com/selfmail/postal-js.");
        }

        return {
            success: json.status === "error" ? false : true,
            ...json
        }
    }
}

export type { Expansions, MessageDeliveris, MessageDeliveryResponse, MessageDetails, MessageDetailsResponse, RawMessage, RawMessageResponse, SendMessage, SendMessageResponse } from "./types";

