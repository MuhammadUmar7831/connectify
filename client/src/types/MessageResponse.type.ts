export default interface MessageResponse {
    MessageId: number;
    ChatId: number;
    SenderId: number;
    Content: string;
    Timestamp: string;
    Sender: string;
    UserStatus: {
        Status: string;
        UserId: number;
        UserName: string;
    }[];
    ReplyId: number | null;
    ReplyContent: string | null;
    ReplySenderId: number | null;
    ReplySender: string | null;
}