import { useEffect, useState } from "react";

export default function useScreenWidth() {
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            console.log(window.innerWidth);
            setScreenWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    return screenWidth;
}
