
'use client'
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import StartSessionModal from "../elements/StartSessionModal";
import { useRouter } from 'next/navigation';
import { TRACE_OUTPUT_VERSION } from "next/dist/shared/lib/constants";

import { Tooltip as ReactTooltip } from 'react-tooltip';
import ScoreComponent from "../elements/ScoreComponent";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { IoInformationCircleSharp } from "react-icons/io5";
import { MdQuiz } from "react-icons/md";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import useMiddleware from "@/app/services/contextMiddleware";
import Preloader from "../elements/Preloader";



export default function SessionsSlider({ handleNoKeysModal,sessions }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const { initSession,  updateGlobalArguments,getDynamicStyle } = useMiddleware();

    const [unlocking, setUnlocking] = useState(false)
    const [loading, setLoading] = useState(false)



    const router = useRouter();




    const handleStart = async (selectedSession) => {
        setLoading(true)
        let session_id = selectedSession?.id;
        const numericSessionId = parseInt(session_id, 10);
        let session = await initSession(numericSessionId);
        let scenarioStructure = session?.data?.steps;
        setLoading(false)
        if (!scenarioStructure) {
            handleNoKeysModal();
            // router.push(`/profile`)
        }
        else {
            setUnlocking(true)
            setTimeout(async () => {
                updateGlobalArguments()
                updateGlobalArguments({ selectedSession: selectedSession });
                router.push(`/live_session`)
            }, 2500);
        }
    };

    const getSessionIconByType = (type) => {
        let type1 = "mixed"
        switch (type) {
            case "mixed":
                return <>                                <IoInformationCircleSharp size={36} />
                    <BsFillQuestionCircleFill style={{ marginBottom: "4px" }} size={28} /></>
            case "info":
                return <>                                <IoInformationCircleSharp size={36} />
                </>
            case "quiz":
                return <>                                <BsFillQuestionCircleFill size={28} />
                </>

        }
    };


    const initialSlideIndex = sessions.findIndex(session => session.status === "next");

    return (
        <>
            <div className="swiper sl-roadmap3-thumb">
                <Swiper
                    spaceBetween={0}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    pagination={{
                        el: ".swiper-pagination",
                        type: "progressbar",
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="swiper-wrapper"
                    initialSlide={initialSlideIndex >= 0 ? initialSlideIndex : 0} // Set initial slide
                >
                    {sessions?.map(session => (
                        <SwiperSlide key={"key36_"+session.id} style={{ opacity: session.status == "lock" ? "0.5" : "1" }} >
                            <div className="content-rm-thumb" >



                                <div className="content-right">
                                    {getSessionIconByType(session.type)}
                                    <h3>{session.sessionTitle}</h3>
                                    <h6>{session.description}</h6>
                                    <br></br>
                                    <ul className="list-infor">
                                        {session.features.map((feature,index) => (
                                            <li key={"key38_"+index}>
                                                <div className="icon">
                                                    <img src={"/assets/icon/Favicon.png"} alt={`${feature} icon`} />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    {session.status == "done" && (
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            {/* <Link data-tooltip-id={`review`} onClick={() => { updateGlobalArguments({ selectedReviewSession: session.id }) }} href={`/review`} className="tf-button style-2 twitter"><i className="icon-fl-file-1" /></Link> */}
                                            <div onClick={() => handleStart(session)} className="tf-button style-2"> Do Again
                                            </div>&nbsp;&nbsp;<ScoreComponent score={session.score} /> </div>)}
                                    {session.status == "next" && <>{unlocking || loading ? <div className="tf-button style-3">Start Session</div>: <div  onClick={() => handleStart(session)} className="tf-button style-1">Start Session</div>}</>}
                                    {session.status == "lock" && <><div disabled className="tf-button style-3">Start Session</div></>}


                                    <ReactTooltip style={{ maxWidth: "200px", whiteSpace: "pre-line" }} id={`review`} place="top" type="dark" effect="solid" >
                                        {"watch review"}
                                    </ReactTooltip>

                                    {/* <Link onClick={handleModal} href={"myapp://openWindow"} className="tf-button style-2">START SESSION</Link> */}
                                </div>
                                <div className="content-left" style={getDynamicStyle(12)}>
                                    <div className="thumb-left" style={{ flex: 1, position: 'relative' }}>
                                        {loading? <>
                                            <center style={{marginTop:getDynamicStyle(22)}} >
                                                            <div style={{              
                                                                 width: '80%',  
                                                                  height: "auto",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center"}} ><Preloader /></div>
                                                        </center>
                                        </>:<>
                                        
                                  
                                        {unlocking ? <div className="container_locks">

                                            <div className={'overlay_locks fadeOut-effect'}>
                                                <img src={`/assets/images/roadmap/lock1.png`} alt="Session image" style={{ width: '80%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                                            </div>
                                            <div className={'overlay_locks fadeIn-effect'}>
                                                <img src={`/assets/images/roadmap/lock2.png`} alt="Session image" style={{ width: '80%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                                            </div>

                                        </div> : <div className="container_locks">
                                            <div className={'overlay_locks fadeIn-effect'}>
                                                <img src={`/assets/images/roadmap/${session.status == "done" ? "lock2" : "lock1"}.png`} alt="Session image" style={{ width: '80%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                                            </div>
                                        </div>
                                        }
                                                    </>}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="swiper sl-roadmap3">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="swiper-wrapper">
                    {sessions?.map(phase => (
                        <SwiperSlide key={"key37_"+phase.id} style={{ opacity: phase.status == "lock" ? "0.5" : "1" }}>
                            <div className="thumb-rm">
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={31} height={30} viewBox="0 0 31 30" fill="none">
                                        <circle className="fill-pri" opacity="0.1" cx="15.5" cy={15} r={15} fill="var(--product-color21)" />
                                        <circle className="fill-pri" cx="15.5" cy={15} r="7.5" fill="#888B8E" />
                                    </svg>

                                </div>
                                <h5>{phase.unicode}</h5>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="swiper-pagination swiper-pagination-progressbar" />
                <div className="swiper-button-next" />
                <div className="swiper-button-prev" />
            </div>

        </>
    )
}
