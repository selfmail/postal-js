export type Message = {
    to?: string[],
    cc?: string[],
    bcc?: string[],
    from?: string,
    sender?: string,
    subject?: string,
    bounce?: boolean,
    attachments?: string[],
    reply_to?: string,
    tag?: string,
    plain_body?: string,
    html_body?: string,
}

/**Response from the api route to send a message */
export type MessageResponse = {
    success: boolean,
    flags: Record<string, any>,
    time: number
    status: "success" | "error",
    data: {
        // error fields
        /**The error message if the status is error */
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
}
