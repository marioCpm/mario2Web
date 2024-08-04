'use client'

import Layout from "@/components/layout/Layout"
import Pricing1 from "@/components/sections/Pricing1"
import  { useEffect, useState } from 'react';
import useMiddleware from "../services/contextMiddleware";

export default function Pricing() {
    const { initHome , globalArguments} = useMiddleware();
    const [loading, setLoading] = useState(true); // Create a loading state


    useEffect(() => {
        const initializeData = async () => {
            await initHome();
        

            setLoading(false);
        };
        if (!globalArguments?.home) {
            initializeData();

        }
        else {
            setLoading(false);

        }

    }, [initHome]);
    useEffect(() => {

        localStorage.clear();

    }, []);
    return (
        <>

            <Layout headerStyle={1} footerStyle={3}>
            <Pricing1 PlansData={globalArguments?.home?.PlansData} keys={false}/>
            <br></br>
                 <br></br>
                 <br></br>
                 <br></br>

            </Layout>    
            

        </>
    )
}