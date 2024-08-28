
import { Message } from "./types";

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
     * Please insert here your postal api key. Keep in mind, that your key must
     * be private and not shared with anyone. You can use enviroment variables
     * to store your key.
     * 
     * Example:
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
     * Sends an email to the specified address. This will create an api call to your given url with the given key.
     * 
     * Example:
     * 
     * ```ts
     * import { postal } from './postal';
     * 
     * const send = async () => {
     *     await postal.sendMessage({        
     *         to: 'test@test.com',
     *         subject: 'Test',
     *         html_body: '<h1>Hello World</h1>'
     *     });
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
    }: Message) {
        const msg = await fetch(`https://${this.url}/api/v1/send/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-Server-API-Key": this.key
            },
            body: JSON.stringify({
                to,
                subject,
                htmlBody: html_body
            })
        });
    }

    public sendRaw() {

    }
}