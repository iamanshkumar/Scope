import React , {useState} from "react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { Moon , Sun , Layers } from "lucide-react"
import { useNavigate , Link } from "react-router-dom"
import { useToast } from "../context/ToastContext"

const LoginPage = ()=>{
    const {login} = useAuth()
    const {theme , toggleTheme} = useTheme()
    const {showToast} = useToast()
    
    const [formData , setFormData] = useState({email : '' , password : ''})
    const [error , setError] = useState('')
    const [loading , setLoading] = useState(false)
    const navigate  = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setError('')
        setLoading(true)

        try{
            await login(formData.email , formData.password)
            showToast('Welcome back!', 'success')
            navigate("/dashboard")
        }catch(err){
            const message = err.response?.data?.message || "Login failed. Please try again."
            showToast('Invalid credentials', 'error');
            setError(message)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <div className="hidden lg:flex w-1/2 bg-brand items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand/90 via-brand to-black/50"></div>
                <div className="relative z-10 text-white p-12 flex flex-col items-start">
                    <div className="p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20 shadow-2xl">
                        <Layers size={48} className="text-white"/>
                    </div>

                    <h1 className="text-5xl font-bold mb-4 tracking-tight">Scope.</h1>
                    <p className="text-xl text-brand-text/80 max-w-md font-medium leading-relaxed">
                        The operating system for modern engineering teams. Secure, scalable, and precise.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
                <button 
                    onClick={toggleTheme} 
                    className="absolute top-6 right-6 p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="w-full max-w-md">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-5xl tracking-tighter font-bold text-slate-900 dark:text-white mb-2">Welcome back</h2>
                        <p className="text-slate-500 tracking-tight dark:text-slate-400">Please sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                    {error ? (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                        {error}
                        </div>
                        ) : null}

                        <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e)=>setFormData({...formData , email : e.target.value})}
                        required
                        ></Input>

                        <Input
                        label="Password" 
                        type="password" 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        >
                        </Input>

                        <Button type="submit" isLoading={loading}>
                        Sign In
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account ? {' '}
                        <Link to="/register" className="font-semibold text-brand hover:underline dark:text-white">
                        Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage