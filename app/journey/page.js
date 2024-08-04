'use client'
import Layout from "@/components/layout/Layout"
import React, { useEffect, useState } from 'react';
import {  withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import JourneyMap from "./JourneyMap";
import { useRouter } from 'next/navigation';
import useMiddleware from "../services/contextMiddleware";




export default withPageAuthRequired(function Profile() {
    const [selectedJourney, setSelectedJourney] = useState([])
    const router = useRouter();
    const { globalArguments, initJourney } = useMiddleware();

    useEffect(() => {  
        
        if (!globalArguments?.selectedJourney) {
        router.push(`/profile`);
    }
        const initializeData = async () => {
            const journey = await initJourney(globalArguments?.selectedJourney?.journeyId);
            if (journey) {
                setSelectedJourney(journey);
            }
        };

        initializeData();
    }, [initJourney]);





    return (
        <>

            <Layout headerStyle={1} footerStyle={3} >
            <JourneyMap selectedJourney={selectedJourney}/>


            </Layout>
        </>
    )
})















