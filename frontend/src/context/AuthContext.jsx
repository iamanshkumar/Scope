import { createContext , useContext , useState , useEffect } from "react";
import api  from "../api/axios"
import { API_ENDPOINTS } from "../api/endpoints";

const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [user , setUser] = useState(null)
    const [loading , setLoading] = useState(true)

    useEffect(()=>{
        const checkUser = async()=>{
            try{
                const storedUser = localStorage.getItem("scope_user")
                if(storedUser){
                    setUser(JSON.parse(storedUser))
                }
            }catch(error){
                console.error("Auth restoration failed", error)
                localStorage.removeItem("scope_user")
            }finally{
                setLoading(false)
            }
        }
        checkUser()
    },[])

    const login = async(email , password)=>{
        const {data} = await api.post(API_ENDPOINTS.AUTH.LOGIN , {email , password})
        const userData = data.data.user
        setUser(userData)
        localStorage.setItem("scope_user", JSON.stringify(userData))
        return data
    }

    const register = async (username, email, password, role) => {
        const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, { 
            username, email, password, role 
        })
        return data
    }

    const logout = async () => {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            localStorage.removeItem("scope_user");
        }
    };
    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)