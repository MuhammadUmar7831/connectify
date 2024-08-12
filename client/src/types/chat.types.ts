export default interface Chat {
    ChatId: number;
    UserId: number | null;
    Name: string;
    Avatar: string;
    SenderName: string | null;
    MessageId: number | null;
    SenderId: number | null;
    Content: string | null;
    Timestamp: string | null;
    unSeenMessages: number;
    isActive: boolean;
    UserStatus: {
        Status: string;
        UserId: number;
        UserName: string;
    }[] | null;
}