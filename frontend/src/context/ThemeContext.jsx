import { createContext , useContext , useEffect , useState } from "react";

const ThemeContext = createContext()

export const ThemeProvider = ({children})=>{
    const [theme , setTheme] = useState(()=>{
        if(typeof window !== "undefined"){
            const savedTheme = localStorage.getItem("theme")
            if(savedTheme){
                return savedTheme
            }
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }

        return "light"
    })

    useEffect(()=>{
        const root = window.document.documentElement
        root.classList.remove("light","dark")
        root.classList.add(theme)
    },[theme])

    const toggleTheme = ()=>{
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    return (
        <ThemeContext value={{theme,toggleTheme}}>
            {children}
        </ThemeContext>
    )
}

export const useTheme = ()=> useContext(ThemeContext)