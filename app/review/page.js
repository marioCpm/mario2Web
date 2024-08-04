'use client'
import Layout from "@/components/layout/Layout"
import React, { useEffect, useState } from 'react';
import {  withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { getSelectedReview,getSelectedProgress } from "../services/reviews"
import { useGlobalContext } from "../context/GlobalContext";
import { getReview } from "../services/reviews";
import AreaChart from "../../components/elements/areaChart";
import { useRouter } from 'next/navigation';
import useMiddleware from "../services/contextMiddleware";

export default withPageAuthRequired(function Profile() {
    const [selectedReview, setSelectedReview] = useState([])
    const { globalArguments, initReview } = useMiddleware();
    const router = useRouter();

    useEffect(() => {  
        
        if (!globalArguments?.selectedReviewSession) {
        router.push(`/profile`);
    }
        const initializeData = async () => {
            const review = await initReview(globalArguments?.selectedReviewSession);
            if (review) {
                setSelectedReview(review);
            }
        };

        initializeData();
    }, [initReview]);





    return (
        <>

            <Layout headerStyle={1} footerStyle={3} >
            {/* {JSON.stringify(selectedReview)} */}
            <div style={{margin: "200px"}}>
            {selectedReview?.length>0 && <AreaChart  data={selectedReview} /> }

            </div>

            </Layout>
        </>
    )
})















