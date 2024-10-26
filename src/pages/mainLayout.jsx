import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar'
import {useState , useEffect} from "react";


function MainLayout() {

    return (
        <>
            <div className="main-layout">
                <Navbar />
                    <Outlet/>
                </div>
        </>

    );
}

export default MainLayout;
