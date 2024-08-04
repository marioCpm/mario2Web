
'use client'
import { useEffect, useState } from "react"
import AddClassBody from "../elements/AddClassBody"
import BackToTop from '../elements/BackToTop'
import PopupBid from "../elements/PopupBid"
import Breadcrumb from './Breadcrumb'
import Footer1 from './footer/Footer1'
import Footer2 from './footer/Footer2'
import Header1 from "./header/Header1"
import Header2 from './header/Header2'
import Footer3 from "./footer/Footer3"
import useMiddleware from "@/app/services/contextMiddleware"

export default function Layout({ headerStyle, footerStyle, breadcrumbTitle, children }) {
    
    
    const { initHome,globalArguments } = useMiddleware();

    const [scroll, setScroll] = useState(0)
    // Moblile Menu
    const [isMobileMenu, setMobileMenu] = useState(false)
    const handleMobileMenu = () =>{console.log("setMobileMenu"); setMobileMenu(!isMobileMenu)}

    const [isModal, setModal] = useState(false)
    const handleModal = () => setModal(!isModal)

    useEffect(() => {
        const WOW = require('wowjs')
        window.wow = new WOW.WOW({
            live: false
        })
        window.wow.init()
        initHome();
        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 100
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        })
    }, [])

    
    useEffect(() => {

        const initializeData = async () => {
            await initHome();
        };

        if (!globalArguments?.home?.footerData) {
            initializeData();
        }

    }, [initHome]);
    return (
        <><div id="top" />
            <AddClassBody />
            <div id="wrapper" className="wrapper-style">
                <div id="page" className="clearfix">
                    {!headerStyle && <Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isModal={isModal} handleModal={handleModal} />}
                    {headerStyle == 1 ? <Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isModal={isModal} handleModal={handleModal} /> : null}
                    {headerStyle == 2 ? <Header2 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isModal={isModal} handleModal={handleModal} /> : null}
                    {headerStyle == 3 ? <Header1 scroll={false} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isModal={isModal} handleModal={handleModal} /> : null}


                    {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}

                    {children}
                    {/* {!footerStyle && < Footer1 />} */}
                    {footerStyle == 1 ? < Footer1 footerData={globalArguments?.home?.footerData}/> : null}
                    {footerStyle == 2 ? < Footer2 footerData={globalArguments?.home?.footerData}/> : null}
                    {footerStyle == 3 ? < Footer3 footerData={globalArguments?.home?.footerData}/> : null}
                </div>
            </div>

            <BackToTop target="#top" />
            <PopupBid isModal={isModal} handleModal={handleModal} />
        </>
    )
}
