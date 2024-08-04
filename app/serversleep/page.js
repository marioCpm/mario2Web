'use client'

import { useState ,useEffect} from 'react';
import Layout from "@/components/layout/Layout";
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Preloader from '@/components/elements/Preloader';
import { useRouter } from 'next/navigation';
import useMiddleware from '../services/contextMiddleware';

export default withPageAuthRequired(function ServerSleep() {
    const router = useRouter();
    const { initProfile,initProfile_Test,globalArguments} = useMiddleware();


    useEffect(() => {
        console.log("start useEffect")

        const initializeData = async () => {
            console.log("start initProfile")
            await initProfile_Test();
        };
        console.log("start timeout")
        setTimeout(() => {
            initializeData();
        }, 5000);
        
    }, []);

    useEffect(() => {
        if (globalArguments?.profile){
            router.push('/profile');
        }
    }, [globalArguments]);

    return (
        <Layout headerStyle={1} footerStyle={3}>
            <section className="tf-contact">
                <div className="tf-container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-8 col-md-9">
                            <div className="tf-heading">
                            <p className="sub-heading">Our server is sleep...</p>
                            <p className="sub-heading">Please wait while we are waking it up.. </p>
                                
                            </div>
                                <Preloader loadingText = "It might take a minute..." ></Preloader>

                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
})
