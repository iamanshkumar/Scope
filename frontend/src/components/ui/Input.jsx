import React from "react";

const Input = ({label , type = "text" , error, ...props})=>{
    return(
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {label}
                </label>
            )}
            <input
            type={type}
            className={`
                w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-900 
                text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all
                ${error 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-slate-300 dark:border-slate-700 focus:border-brand focus:ring-brand-light/50'
                }
              `}
              {...props}
            >
            </input>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}

export default Input