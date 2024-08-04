import { useState, useEffect, useRef } from "react";

export const useMenu = () => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const closeMenu = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setShowMenu(false);
        }
    }

    useEffect(() => {
        if (showMenu) {
            document.addEventListener('click', closeMenu);
        } else {
            document.removeEventListener('click', closeMenu);
        }

        return () => {
            document.removeEventListener('click', closeMenu);
        };
    }, [showMenu]);

    return { showMenu, setShowMenu, menuRef };
};
