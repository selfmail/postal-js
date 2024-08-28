export type Message = {
    to: string | string[],
    cc: string | string[],
    bcc: string | string[],
    from: string,
    sender: string,
    subject: string,
    bounce: boolean,
    attachments: string[],
    reply_to: string,
    tag: string,
    plain_body: string,
    html_body: string,
}