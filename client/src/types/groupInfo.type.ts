export default interface GroupInfoResponse {
    GroupId: number;
    GroupName: string;
    Description: string;
    Avatar: string;
    CreatorId: number;
    CreatedBy: string;
    DateCreated: string;
    ChatId: number;
    Members: {
        UserId: number;
        Name: string;
        Avatar: string;
        Bio: string;
        isAdmin: number;
    }[];
}