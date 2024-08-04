'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Menu() {
    const pathname = usePathname()
    const [currentMenuItem, setCurrentMenuItem] = useState("")

    useEffect(() => {
        setCurrentMenuItem(pathname)
    }, [pathname])

    const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current-menu-item" : ""
    const checkParentActive = (paths) => paths.some(path => currentMenuItem.startsWith(path)) ? "current-menu-item" : ""

    return (
        <>
            <ul id="menu-primary-menu" className="menu">
                <li className={`menu-item`}>
                    <Link href="/">HOME</Link>
                </li>

                <li className={`menu-item`}>
                    <Link href="/profile">PROFILE</Link>
                </li>
                <li className={`menu-item`}>
                    <Link href="/explore">EXPLORE</Link>
                </li>

                {/* <li className={`menu-item`}>
                    <Link href="/score-board">SCORE-BOARD</Link>
                </li> */}
                
                <li className={`menu-item`}>
                    <Link href="/affiliate">Affiliate</Link>
                </li>

                
            </ul>
        </>
    )
}

