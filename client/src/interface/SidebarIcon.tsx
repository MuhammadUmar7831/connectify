import { ReactNode } from "react";
import ToolTip from "./ToolTip";

export default function SidebarIcon({ icon, tip, onClick }: { icon: ReactNode, tip: string, onClick: () => void }) {
    return (
        <li className="group relative flex" onClick={onClick}>
            {icon}
            <ToolTip tip={tip} />
        </li>
    )
}
