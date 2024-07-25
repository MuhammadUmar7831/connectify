import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getUserApi } from "../api/user.api";
import { setError } from "../redux/slices/error";
import { Navigate, Outlet } from "react-router-dom";
import { setUser } from "../redux/slices/user";
import SideBar from "./SideBar";
import Main from "../pages/Main";
import { BarLoader } from "react-spinners";
import { GrConnect } from "react-icons/gr";
import themeColor from "../config/theme.config";
import { createSocket } from "../config/scoket.config";

export default function PrivateRoutes() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state: RootState) => state.user);

    const getUser = async () => {
        setLoading(true);
        const res = await getUserApi();
        if (!res.success) {
            dispatch(setError(res.message));
        } else {
            createSocket(res.user.UserId);
            dispatch(setUser(res.user));
        }
        setLoading(false);
    }

    useEffect(() => {
        if (user === null) {
            getUser();
        } else {
            setLoading(false);
        }
    }, [user])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-5">
                <div className="flex gap-2 animate-pulse">
                    <GrConnect className="size-8 text-orange" />
                    <h1 className="text-2xl">Connectify</h1>
                </div>
                <BarLoader width={200} color={themeColor} />
                <span className="animate-pulse">Authenticating...</span>
            </div>
        )
    }

    return (
        user !== null ?
            <>
                <SideBar />
                <Main />
                <Outlet />
            </> : <Navigate to="/signin" />
    )
}
