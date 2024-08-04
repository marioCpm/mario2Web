'use client';

import dynamic from 'next/dynamic'
import Link from "next/link"
import Menu from '../Menu'
import MobileMenu from '../MobileMenu'
import { useUser } from '@auth0/nextjs-auth0/client';
import useMiddleware from '@/app/services/contextMiddleware';
import React, { useEffect, useState } from 'react';

import Avatar from './Avatar';

const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
    ssr: false,
})

export default function Header1({ scroll, isMobileMenu, handleMobileMenu, handleModal }) {
    let commingSoon = false;
    const { user, error, isLoading } = useUser();
    const { initProfile, globalArguments } = useMiddleware();
    const [loadingFinished, setLoadingFinished] = useState(false)

    useEffect(() => {
        const initializeData = async () => {
            await initProfile();
            if (!loadingFinished) {
                setLoadingFinished(true)

            }

        };

        initializeData();
    }, [initProfile]);
    // console.log(user?.email);
    return (
        <>

            <header className={`header ${scroll ? "is-fixed is-small" : ""}`}>
                <div className="tf-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div id="site-header-inner">
                                <div id="site-logo" className="clearfix">
                                    <div id="site-logo-inner">
                                        <Link href="/" rel="home" className="main-logo">
                                            <img id="logo_header" src="/assets/images/logo/logo.png" alt="Image" />
                                        </Link>
                                 
                                    </div>
                                </div>
                                <div className="header-center">
                                    <div className="d-none d-lg-block">
                                        <nav id="main-nav" className="main-nav">
                                            <Menu />
                                        </nav>{/* #main-nav */}
                                    </div>
                                </div>
                                <div className="header-right">
                                    <div style={{ opacity: 0 }}>
                                        <ThemeSwitch />
                                    </div>
                                    {user?.email && <>


                                        {loadingFinished &&
                                            <div className={`mobile-button d-block ${isMobileMenu ? "active" : ""}`} onClick={handleMobileMenu}><span /></div>

                                        }

                                        <MobileMenu profile={globalArguments?.profile} user={user} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} /></>}
                                    {!commingSoon ? <>
                                        {!user?.email ? (<div>
                                            <div>                         <Link href="/api/auth/login?returnTo=/profile" className="tf-button discord"><i className="icon-fl-vt" /><span>SIGN IN</span></Link>
                                                <a href="/api/auth/login?returnTo=/profile" className="tf-button connect" data-toggle="modal" data-target="#popup_bid">
                                                    <span>SIGN UP FOR FREE</span></a></div>{/* /.mobile-button */}
                                        </div>) : (<div>

                                        </div>)}
                                    </> : <div>
                                        <a href="/" className="tf-button connect" data-toggle="modal" data-target="#popup_bid">
                                            <span>Comming soon...</span>
                                        </a>
                                    </div>}



                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        </>
    )
}
