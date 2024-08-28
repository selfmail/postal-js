

export default class Postal {
    /**
     * Private api key to access the postal api.
     */
    private key: string;
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
     */
    public sendMessage(to: string, subject: string, body: string): void {
        fetch(`https://${this.url}/email/with/${this.key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to,
                subject,
                htmlBody: body
            })
        });
    }

    public sendRaw() {

    }


}