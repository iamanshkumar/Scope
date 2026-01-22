import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const AppLayout = ()=>{
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar></Sidebar>
            <main className="flex-1 overflow-auto">
                <div className="p-8 mx-auto max-w-7xl">
                    <Outlet></Outlet>
                </div>
            </main>
        </div>
    )
}

export default AppLayout