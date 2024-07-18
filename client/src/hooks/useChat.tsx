import { useState } from "react"

export default function useChat() {
    const [allChats, setallChats] = useState(null);
    const [peronsalChats, setPeronsalChats] = useState(null);
    const [groupChats, setGroupChats] = useState(null);
    const [pinnedChats, setPinnedChats] = useState(null);
    const [archiveChats, setArchiveChats] = useState(null);

    
    return {
        allChats,
        peronsalChats,
        groupChats,
        pinnedChats,
        archiveChats
    }
}
