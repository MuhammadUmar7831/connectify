export default interface Chat {
    ChatId: number;
    Name: string;
    Avatar: string;
    SenderName?: string | null;
    MessageId?: number | null;
    SenderId?: number | null;
    Content?: string | null;
    TimeStamp?: string | null;
    unSeenMessages?: number;
}