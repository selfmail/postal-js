import { Message, MessageResponse } from "./types";

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
    }: Message): Promise<MessageResponse> {
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

        if (!msg.ok || msg.status !== 404) {
            throw new Error("Fetch error. We could not reach the postal api. Please check your internet connection and the given url. The given url is: " + this.url);
        }

        const data = await msg.json() as Omit<MessageResponse, "success">;

        // throw error if api key is wrong, or the url
        if (data.data.code === "InvalidServerAPIKey") {
            throw new Error("Invalid server api key. When you don't now how to create an api key, please visit https://github.com/selfmail/postal-js.");
        }

        return {
            success: data.status === "error" ? false : true,
            ...data
        }
    }

    public messageDetails() {
        // TODO: implement messageDetails
    }

    // TODO: implement sendRaw
    public sendRaw() {

    }
}

export type { Message, MessageResponse } from "./types";

