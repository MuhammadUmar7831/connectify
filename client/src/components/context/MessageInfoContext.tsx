import React, { createContext, useState, ReactNode } from 'react';

interface UserStatus {
    UserId: number;
    UserName: string;
    Status: string;
}

interface MessageInfoContextType {
    userStatus: UserStatus[];
    setUserStatus: React.Dispatch<React.SetStateAction<UserStatus[]>>;
    showInfoPanel: boolean;
    setShowInfoPanel: React.Dispatch<React.SetStateAction<boolean>>;
    selectedMessage: string;
    setSelectedMessage: React.Dispatch<React.SetStateAction<string>>;
    timestamp: string
    setTimestamp: React.Dispatch<React.SetStateAction<string>>;
}

export const MessageInfoContext = createContext<MessageInfoContextType | null>(null);

export function MessageInfoProvider({ children }: { children: ReactNode }) {
    const [userStatus, setUserStatus] = useState<UserStatus[]>([]);
    const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessage] = useState<string>('');
    const [timestamp, setTimestamp] = useState<string>('');

    return (
        <MessageInfoContext.Provider value={{ userStatus, setUserStatus, showInfoPanel, setShowInfoPanel, selectedMessage, setSelectedMessage, timestamp, setTimestamp }}>
            {children}
        </MessageInfoContext.Provider>
    );
}
