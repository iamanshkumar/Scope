import React from "react"
import { Loader2 } from "lucide-react"

const Button = ({children , isLoading , variant = "primary" , ...props})=>{
    const baseStyles = "w-full flex justify-center items-center px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-brand text-white hover:bg-brand-hover dark:bg-white dark:text-brand dark:hover:bg-slate-200",
        outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
        danger: "bg-red-600 text-white hover:bg-red-700"
    }

    return (
        <button className={`${baseStyles} ${variants[variant]}`} 
        disabled={isLoading} 
        {...props}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
        </button>
    )
}

export default Button