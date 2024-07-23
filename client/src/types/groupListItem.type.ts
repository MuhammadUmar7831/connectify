export interface GroupListItem {
    GroupId: number,
    Name: string,
    Avatar: string,
    Members: [
        {
            UserId: number,
            UserName: string
        }
    ]
}