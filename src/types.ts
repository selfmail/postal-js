export type SendMessage = {
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
export type SendMessageResponse = {
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

/**
 * The expansions are the fields which are returned by the api. 
 * 
 * You can choose which fields you want to receive. 
 * 
 * The expansions are: 
 * - status
 * - details
 * - inspection
 * - plain_body
 * - html_body
 * - attachments
 * - headers
 * - raw_message
 * - activity_entries
 */
export type Expansions = "status" | "details" | "inspection" | "plain_body" | "html_body" | "attachments" | "headers" | "raw_message" | "activity_entries"

export type MessageDetails = {
    id: number,
    expansions?: Expansions[] | true
}
export type MessageDetailsResponse = {
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
}

export type MessageDeliveris = {
    id: number,
}
export type MessageDeliveryResponse = {
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

export type RawMessage = {
    mail_from: string,
    rcpt_to: string[],
    data: string,
    bounce?: boolean,
}
