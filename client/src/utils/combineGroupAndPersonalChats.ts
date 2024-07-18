export const combineGroupAndPersonalChats = (personalChats: any, groupChats: any) => {
    const allChats = [...personalChats, ...groupChats].sort((a, b) => {
        if (a.TimeStamp && b.TimeStamp) {
            return new Date(b.TimeStamp).getTime() - new Date(a.TimeStamp).getTime();
        }
        return 0;
    });
    return allChats;
}