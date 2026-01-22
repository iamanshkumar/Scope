import React ,  {useEffect} from "react"
import {X} from "lucide-react"

const Modal = ({isOpen , onClose , title , children})=>{
    useEffect(()=>{
        if(isOpen){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'unset'
        }

        return ()=> document.body.style.overflow = 'unset'
    },[isOpen])

    if(!isOpen){
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {/*Header*/}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <X size={20} className="text-slate-500"></X>
                    </button>
                </div>
                {/*Content*/}

                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal