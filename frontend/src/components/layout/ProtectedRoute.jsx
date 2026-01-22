import {Navigate , Outlet} from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Loader2 } from "lucide-react"

const ProtectedRoute = ()=>{
    const {user , loading} = useAuth()

    if(loading){
        return(
            <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-brand"></Loader2>
            </div>
        )
    }

    if(!user){
        return <Navigate to="/login" replace />;
    }

    return <Outlet />
}

export default ProtectedRoute