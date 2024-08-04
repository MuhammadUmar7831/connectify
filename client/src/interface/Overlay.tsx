import { ReactNode } from "react";

export default function Overlay({ className, children, onClose }: { className?: string; children?: ReactNode, onClose: () => void }) {
    return (
        <div onClick={() => onClose()} className={`${className} fixed top-0 left-0 bg-black bg-opacity-30 h-screen w-screen`}>{children}</div>
    )
}
