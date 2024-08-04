'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState  } from 'react'
import CounterUp from '@/components/elements/CounterUp';
import { IoDiamondOutline } from 'react-icons/io5';
import { MdVpnKey } from "react-icons/md";
import { GoPackage } from "react-icons/go";
import useMiddleware from '@/app/services/contextMiddleware';
import Avatar from './header/Avatar';
import { RiLogoutCircleRLine } from "react-icons/ri";

export default function MobileMenu({ profile, user, isMobileMenu,handleMobileMenu }) {
    const pathname = usePathname()
    const [currentMenuItem, setCurrentMenuItem] = useState("")
    const { getDynamicStyle } = useMiddleware();

    useEffect(() => {
        setCurrentMenuItem(pathname)
    }, [pathname])

    const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current-menu-item" : ""

    const handleOverlayClick = () => {
        handleMobileMenu();
    };
    const overlayStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: '10'
    };

    return (
        <div style={{ display: `${isMobileMenu ? "block" : "none"}`}}> <div style={overlayStyle} onClick={handleOverlayClick}></div>
            <nav id="main-nav-mobi" className="main-nav" style={{ fontSize: "26px", width: getDynamicStyle(5) }}>
                <ul id="menu-primary-menu" className="menu">

                    <li style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Avatar img={user?.picture} name={user?.name} />
                            <div style={{ marginLeft: "10px" }}>{user?.name}</div>
                        </div>
                        <div style={{ margin:"5px",marginLeft: "auto" }}>
                        <a href="/api/auth/logout">

                        <span style={{ fontSize:"20px"}}>Logout</span>
                        <RiLogoutCircleRLine style={{margin:"2px 8px -5px 8px"}} />
                        </a>
                        </div>

                    </li>
                    <Link href="/pricing">

                    <li style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{  fontFamily: "consolas", marginLeft: "60px" ,display: "flex", alignItems: "center" }}>
                            <div style={{ marginLeft: "10px" }}>plan:</div>
                        </div>
                        <div style={{ margin:"5px",marginLeft: "auto" }}>
                        <h5 className="glowing-text" style={{ fontFamily: "consolas", color: "cyan",  marginRight: "12px" }}>
                                {profile?.plan_type?.toUpperCase()}
                                <GoPackage style={{ margin: "0px 0px -3px 5px" }} ></GoPackage></h5>
                        </div>
                    </li>
                    </Link>

                    <li style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{  fontFamily: "consolas", marginLeft: "60px" ,display: "flex", alignItems: "center" }}>
                            <div style={{ marginLeft: "10px" }}>score:</div>
                        </div>
                        <div style={{ margin:"5px",marginLeft: "auto" }}>
                        <h5 className="glowing-text" style={{ fontFamily: "consolas", color: "lightgreen", marginRight: "12px" }}>
                                {profile?.score}
                                <IoDiamondOutline style={{ margin: "0px 0px -3px 5px" }} ></IoDiamondOutline></h5>
                        </div>
                    </li>

                    <li  className={`menu-item `}>
                            <div style={{background:"cyan" ,opacity:"0.5",height:"3px"}}></div>
                    </li>
                    <li  className={`menu-item ${checkCurrentMenuItem("/")}`}>
                        <Link href="/">
                            <div style={{ marginRight: "20px",fontFamily: "consolas", display: "flex", alignItems: "center" ,fontSize: "22px" }}>Home</div>
                        </Link>
                    </li>
                    <li className={`${checkCurrentMenuItem("/profile")}`}>
                        <Link href="/profile">
                         <div style={{ fontFamily: "consolas", display: "flex", alignItems: "center" ,fontSize: "22px" }}>Profile</div>
                        </Link>
                    </li>
                    <li className={`menu-item ${checkCurrentMenuItem("/explore")}`}>
                        <Link href="/explore">
                         <div style={{ fontFamily: "consolas", display: "flex", alignItems: "center" ,fontSize: "22px" }}>Explore</div>
                        </Link>
                    </li>

                    <li className={`menu-item ${checkCurrentMenuItem("/affiliate")}`}>
                        <Link href="/affiliate">
                         <div style={{ fontFamily: "consolas", display: "flex", alignItems: "center" ,fontSize: "22px" }}>Affiliate</div>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
