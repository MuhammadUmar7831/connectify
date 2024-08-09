interface Members {
    UserId: number;
    Name: string;
    Avatar: string;
    LastSeen: string;
    IsActivePrivacy: number; // actullay bolean mySql return 0, 1 for False and True respectively
    IsLastSeenPrivacy: number; // actullay bolean mySql return 0, 1 for False and True respectively
}

export default interface ChatHeaderResponse {
    InfoId: number;
    Type: string;
    ChatName: string;
    ChatAvatar: string;
    Members: Members[];
}