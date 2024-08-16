export const combineGroupAndPersonalChats = (personalChats: any, groupChats: any) => {
    const allChats = [...personalChats, ...groupChats].sort((a, b) => {
        if (a.Timestamp && b.Timestamp) {
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        }
        return 0;
    });
    return allChats;
}