export class FacebookAuthResponse {
    "status"?: string;
    "authResponse"?: {
        "accessToken"?: string,
        "expiresIn"?: string,
        "session_key"?: boolean,
        "sig"?: string,
        "userID"?: string
    }
}
export class FacebookData {
    "id"?: string;
    "first_name"?: string;
    "last_name"?: string;
    "email"?: string;
    "picture"?: any
}
