'use client'
import Layout from "@/components/layout/Layout"
import SessionsSlider from "@/components/slider/SessionsSlider"
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import useMiddleware from "../services/contextMiddleware";
import NoKeysModal from "@/components/elements/NoKeysModal";
import Preloader from "@/components/elements/Preloader";
import UnitCard from "@/components/elements/UnitCard";
import UnitMiniCard from "@/components/elements/UnitMiniCard";

export default withPageAuthRequired(function UnitDetails() {
    const { globalArguments, initSessionsOfUnit, AddStatusToSessions ,getRandomImage,getDynamicStyle} = useMiddleware();
    const [selectedSessions, setSelectedSessions] = useState([])
    const router = useRouter();
    const [isNoKeysModal, setNoKeysModal] = useState(false)

    const handleNoKeysModal = () => {router.push(`/pricing`);}

    useEffect(() => {

        if (!globalArguments?.selectedUnit) {
            router.push(`/profile`);
        }
        const initializeData = async () => {
            const sessions = await initSessionsOfUnit(globalArguments?.selectedUnit?.id);
            if (sessions) {
                setSelectedSessions(sessions);
            }
        };
        if (selectedSessions.length == 0) {
            initializeData();

        }
    }, [initSessionsOfUnit]);

    const imageStyle = {
        backgroundImage: `url(${globalArguments?.selectedUnit?.imageUrl || getRandomImage()})`,
        backgroundPosition: 'top right',
        backgroundSize: 'contain',  // This ensures the image maintains its aspect ratio without cropping
        backgroundRepeat: 'no-repeat',
        opacity: 0.2, // Adjust transparency as needed
        position: 'absolute',
        top: -310,
        right: 100,
        width: '40%',
        height: '100%',
        zIndex: 1 // Ensures the image stays in the background

    };
    

    const feedbackStyles = {
        zIndex: 2 ,
        marginBottom: '20px',
        width: '100%',
        color: "white",
        backgroundColor: "rgba(0,0,0,0.1)",
        borderWidth: "1px", borderColor: "cyan", borderRadius: "5px", padding: "20px"
    };

const breadCrumbs = (<div style={{ display: "flex", alignItems: "center" }}> 
{/* <div style={{ zoom:"30%",marginRight: "20px" }}>     <UnitMiniCard   margin="10px" height="370px"  width="320px"
          isCompleted={true} levelName={""} level={globalArguments?.selectedUnit?.level} navigateTo={``} c_unit={{unit:globalArguments?.selectedUnit }} ></UnitMiniCard>
</div>  */}
<div> 
    <h1>{globalArguments?.selectedUnit?.topic}</h1>
    <h4>{globalArguments?.selectedUnit?.description}</h4>

</div>
</div>)


    return (
        <>

            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle={globalArguments?.selectedUnit && breadCrumbs} >

                {globalArguments?.selectedUnit?.completed && <center>Congrats! Unit {globalArguments?.selectedUnit?.topic} done! </center>}
                {selectedSessions?.length > 0 ? <>
                    <section className=" section-roadmap section-bg-1">

                    <div style={imageStyle}  ></div>


                        <div className="tf-container">

                            <div className="row">
                                <div style={feedbackStyles} className="col-md-12">
                                    <center>
                                        <div style={{ zIndex:-1, background: "rgba(0,0,0,0.6)",width: getDynamicStyle(14) }} className="tf-roadmap-style-thumb">

                                            <SessionsSlider handleNoKeysModal={handleNoKeysModal} sessions={AddStatusToSessions(selectedSessions)} />

                                        </div>
                                    </center>
                                </div>
                            </div>

                        </div>
                    </section>
                </> : <div style={{ height: "700px" }}>

                    <Preloader></Preloader>

                </div>}
                <NoKeysModal isModal={isNoKeysModal} handleModal={handleNoKeysModal} upgrade={() => { router.push("/pricing") }} />

            </Layout>
        </>
    )
})