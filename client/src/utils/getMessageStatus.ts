const getMessageStatus = (userStatus: {
    Status: string;
    UserId: number;
    UserName: string;
}[]): string => {
    let sending = 0;
    let error = 0;
    let sent = 0;
    let received = 0;
    let seen = 0;
    for (let i = 0; i < userStatus.length; i++) {
        if (userStatus[i].Status === 'sending') {
            sending++;
        }
        else if (userStatus[i].Status === 'error') {
            error++;
        }
        else if (userStatus[i].Status === 'sent') {
            sent++;
        } else if (userStatus[i].Status === 'received') {
            received++;
        } else {
            seen++;
        }
    }
    if (sending > 0) return 'sending'
    else if (error > 0) return 'error'
    else if (sent > 0) return 'sent'
    else if (received > 0) return 'received'
    else return 'seen'
}

export default getMessageStatus;