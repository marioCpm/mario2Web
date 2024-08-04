'use client'

import ThreeDCharacterViewer from "@/components/elements/ThreeDCharacterViewer"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import React, { useEffect, useState } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import JourneyStatusGallery from "../full-progress/journeyStatusGallery"
import JourneyModal from "@/components/elements/JourneyModal"
import useMiddleware from "../services/contextMiddleware"
import BadgesModal from "@/components/elements/BadgesModal"
import Preloader from "@/components/elements/Preloader"
import CompleteRegisterModal from "@/components/elements/CompleteRegisterModal"
import UnitMiniCard from "@/components/elements/UnitMiniCard"
import { useRouter } from "next/navigation"


export default withPageAuthRequired(function Profile() {
    const { isPermitted, initProfile, initFilters, initHome, updateUnitWithProgress, getRandomImage, globalArguments, getStack, updateProfileDetails, getDynamicStyle, getFigure } = useMiddleware();

    const router = useRouter();


    const [fullStack, setFullStack] = useState([{}])
    const [figure, setFigure] = useState({})

    const [selectedJourney, setSelectedJourney] = useState({})
    const [isJourneyModal, setJourneyModal] = useState(false)
    const [isBadgesModal, setBadgesModal] = useState(false)
    const [isCompleteRegisterModal, setCompleteRegisterModal] = useState(false)
    const [loading, setLoading] = useState(true); // Create a loading state

    const swiperOptions = {
        modules: [Autoplay, Pagination, Navigation],
        loop: true,
        slidesPerView: getDynamicStyle(8),
        spaceBetween: 30,
        navigation: {
            clickable: true,
            nextEl: ".button-collection-next",
            prevEl: ".button-collection-prev",
        },

    }
    const swiperOptions2 = {
        modules: [Autoplay, Pagination, Navigation],
        loop: true,
        slidesPerView: getDynamicStyle(9),
        spaceBetween: 30,
        navigation: {
            clickable: true,
            nextEl: ".button-collection-next",
            prevEl: ".button-collection-prev",
        },

    }

    const handleCompleteRegisterModal = () => {
        setCompleteRegisterModal(!isCompleteRegisterModal)

    }
    const handleExploreUnits = () => {
        router.push(`/explore`);

    }
    const handleExploreJourneys = () => {
        router.push(`/explore`);

    }





    const handleJourneyModal = () => setJourneyModal(!isJourneyModal)
    const handleBadgesModal = () => setBadgesModal(!isBadgesModal)

    const updateProfile = (nickname, figure, meshColors = {}) => {

        updateProfileDetails(nickname, figure, meshColors);
        handleCompleteRegisterModal();
    }



    const ArrowButton = (tooltip,text,handle,key) =>{ 
        return <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute',right:20, zIndex: 2 }}>
    <div onClick={handle}
        style={{
            backgroundColor: 'black',
            color: 'cyan',
            padding: '10px 10px 10px 20px',
            fontSize: '0.8em',
            borderRadius: '15px',
            border: '1px solid cyan',
            cursor: 'pointer',
            transition: 'transform 0.2s'
        }}
        data-tooltip-id={key} 
        className="arrow-button"
>
        {text} <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>&#10132;</span>
        <ReactTooltip id={key}  place="top"  type="dark" effect="solid" style={{ maxWidth: '200px', whiteSpace: 'pre-line' }}>
        {tooltip}
        </ReactTooltip>
    </div>
    <style jsx>{`
                .arrow-button:hover {
                    transform: scale(1.1); // Scale up the button on hover
                }
            `}</style>
</div>}

    useEffect(() => {
        const initializeData = async () => {
            await initProfile();
            await initFilters();
            await initHome();


            setLoading(false);
        };
        if (!globalArguments?.profile || !globalArguments?.progress || !globalArguments?.filters) {
            initializeData();

        }
        else {
            setLoading(false);
            if (globalArguments?.profile && !globalArguments?.profile?.nickname && globalArguments?.profile?.user_id && !isCompleteRegisterModal) {
                handleCompleteRegisterModal();
            }
        }

    }, [initProfile, initFilters]);

    useEffect(() => {
        if (globalArguments?.stackCount && globalArguments?.filters) {
            let stack = getStack(Object.keys(globalArguments?.stackCount))
            setFullStack(stack);

        }

    }, [globalArguments?.stackCount, globalArguments?.filters]);

    useEffect(() => {
        if (globalArguments?.profile?.figure) {
            setFigure(getFigure(globalArguments?.profile?.figure))

        }
        console.log("wiwiwiwiwiw" + globalArguments?.profile?.figure)
    }, [globalArguments?.profile?.figure]);


    const journeyClicked = (journey) => {

        handleJourneyModal();
        setSelectedJourney(journey);
    }

    const feedbackStyles = {
        height: '98%',
        margin: '5px',
        marginRight: '-10px',
        marginLeft: '-10px',
        color: "white",
        backgroundColor: "black",
        border: '2px dashed cyan',
        borderWidth: "1px", borderColor: "cyan", borderRadius: "5px", padding: "20px", flex: 1
    };




    return (
        <div >
            {loading ?
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black" // Optional: to cover the background
                }} >
                    <Preloader loadingText="Comming soon..."></Preloader>
                </div>
                : (
                    <Layout headerStyle={3} footerStyle={3} >
                        <div>
                            <div className="tf-container">
                                <div style={feedbackStyles} className="row">



                                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }} className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-md-4">
                                                <div style={feedbackStyles} >
                                                {ArrowButton("watch all","History",handleBadgesModal,"userBadgesArrow")}

                                                    <div className="row justify-content-center">
                                                        <div className="sign-in-form style2 mx-auto">
                                                            <p style={{ fontSize: "24px", fontFamily: "consolas", color: "gray" }}>nickname:</p>
                                                            <h2>{globalArguments?.profile?.nickname}</h2>
                                                            <form action="#" id="contactform">
                                                                <p style={{ marginTop: "20px", fontSize: "24px", fontFamily: "consolas", color: "gray" }}>stack:</p>
                                                                <div >
                                                                    {fullStack?.length > 0 ? (
                                                                        <> 
                                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '50px' }}>
                                                                                {fullStack.slice(0, 4).map((stack, index) => (
                                                                                    <div key={"mls3_" + index} data-tooltip-id={"stack-" + stack.id} style={{ display: 'flex', flexDirection: "row", alignItems: 'center', margin: '0 5px' }}>
                                                                                        <img src={stack?.icon} alt={stack?.title} style={{ height: "30px" }} />
                                                                                        <ReactTooltip style={{ maxWidth: "200px", whiteSpace: "pre-line" }} id={"stack-" + stack.id} place="top" type="dark" effect="solid">
                                                                                            {stack.title}
                                                                                        </ReactTooltip>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                           
                                                                        </>
                                                                    ) : <p style={{ margin: "5px", fontSize: "24px", fontFamily: "consolas", color: "white" }}>currently no stack</p>}

                                                                </div>
                                                                <p style={{ marginTop: "20px", fontSize: "24px", fontFamily: "consolas", color: "gray" }}>completed units:</p>

                                                                <div style={{ marginTop: "5px", fontFamily: "consolas" }}>

                                                                    {globalArguments?.completedUnits && globalArguments?.completedUnits.length > 0 ? (
                                                                        <>
                                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '50px' }}>
                                                                                {globalArguments?.completedUnits?.map((unit, index) => (
                                                                                    <div key={"mls_" + index} className="infor-badge-box" style={{ height: "40px", display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', marginLeft: '10px' }}>
                                                                                        <img data-tooltip-id={"unit11-" + unit.unit.id} src={`/assets/images/milestones/milestone${unit.unit.level}.png`} alt="Milestone Image" style={{ height: "40px", marginBottom: '10px' }} />

                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </>
                                                                    ) : <p style={{ margin: "5px", fontSize: "24px", fontFamily: "consolas", color: "white" }}>currently no units</p>}
                                                                </div>


                                                            </form>

                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                            <div className="col-12 col-md-8">
                                                <div style={feedbackStyles} >
                                                    <div className="col-md-12">
                                                        <center style={{ margin: "5px" }}>
                                                            <h4 className="heading">RECENT ACTIVITY</h4>
                                                        </center>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div style={{ padding: "20px" }} className="swiper-container collection">

                                                            {globalArguments?.progress?.length > 0 ? <>
                                                                <Swiper {...swiperOptions2} className="swiper-wrapper ">

                                                                    {globalArguments?.progress?.slice(0, 10).map((course, index) => (

                                                                        <SwiperSlide key={"key3_" + index}  >
                                                                            <Link onClick={() => { updateUnitWithProgress(course.unit) }} href={`/unit-details`}>
                                                                                <UnitMiniCard stack={getStack(course?.unit?.stack)} c_unit={course} ></UnitMiniCard>
                                                                            </Link>
                                                                        </SwiperSlide>
                                                                    ))}
                                                                </Swiper>
                                                            </> :
                                                                <center  >
                                                                    <div style={{
                                                                        height: "136px",
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center"
                                                                    }} >{globalArguments?.progress ? <>No recent Activity</> : <Preloader />}</div>
                                                                </center>}
                                                        </div>

                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4" >
                                                <div style={feedbackStyles} >
                                                    {ArrowButton("Switch Helper",<img src={`/assets/icon/figure_icon.png`} alt="Image" style={{ height: "40px" }} />,handleCompleteRegisterModal,"ChangeHelperArrow")}
                                                    {/* <div onClick={handleCompleteRegisterModal} style={{ position: 'absolute', top: 10, right: 10, cursor: "pointer" }} data-tooltip-id={"figure"}>
                                                        <div className="infor-item-box" style={{ height: "50px", display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', opacity: '1' }}>
                                                            
                                                            <ReactTooltip style={{ maxWidth: "200px", whiteSpace: "pre-line" }} id={"figure"} place="top" type="dark" effect="solid">
                                                                Switch Helper
                                                            </ReactTooltip>
                                                        </div>

                                                    </div> */}
                                                    <center style={{ margin: "5px" }}>
                                                        <h4 className="heading">YOUR AI HELPER</h4>
                                                    </center>
                                                    <br></br>
                                                    <div className="tf-team active wow fadeInUp">
                                                        <div style={{ height: "200px", width: "420px" }} className="image">
                                                            <ThreeDCharacterViewer from="slider" modelUrl={figure.path3d} />
                                                        </div>
                                                        <h4 className="name"><Link href="/team">{figure?.name}</Link></h4>
                                                        <p className="position">{figure?.description}</p>

                                                    </div>

                                                    <a href="https://app.meshy.ai?via=galenai" target="_blank" rel="noopener noreferrer">
                                                        <div style={{ opacity: "0.7", color: "lightgray" }}>
                                                            3D model is AI generated using
                                                            <img style={{ height: "50px", width: "120px", marginRight: "-15px" }} src={`/assets/images/partners/meshy_logo.png`}></img>
                                                            .AI

                                                        </div>

                                                    </a>




                                                </div>

                                            </div>
                                            <div className="col-12 col-md-8">
                                                <div style={feedbackStyles} >
                                                {ArrowButton("explore units","More",handleExploreUnits,"RecoArrow")}
                                                    <div className="col-md-12">

                                                        <center style={{ margin: "5px" }}>
                                                            <h4 className="heading">RECOMMENDED FOR YOU</h4>
                                                        </center>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div style={{ padding: "20px" }} className="swiper-container collection">
                                                            {globalArguments?.recommended?.length > 0 ? <>
                                                                <Swiper {...swiperOptions} className="swiper-wrapper ">
                                                                    {globalArguments?.recommended?.map((unit, index) => (<>
                                                                        <SwiperSlide key={"key4_" + index}  >
                                                                            <Link onClick={() => { updateUnitWithProgress(unit) }} href={`/unit-details`}>
                                                                                <div data-tooltip-id={"unit-description-" + unit.id} className="slider-item" style={{ position: "relative" }}>
                                                                                    <div style={{ minWidth: "150px", margin: "5px" }} className="tf-product">
                                                                                        <div className="image">
                                                                                            <img src={unit.imageUrl !== "" ? unit.imageUrl : getRandomImage()} alt={unit.topic} />
                                                                                        </div>
                                                                                        <h6 className="name" style={{ color: "lightgreen", margin: "15px" }}>
                                                                                            {unit.topic}
                                                                                        </h6>
                                                                                        <Link href={`/unit-details`} className="explore-link" style={{ fontSize: "0.8em", position: "absolute", right: "10px", bottom: "10px", display: "flex", alignItems: "center", textDecoration: "none", color: "white" }}>
                                                                                            Explore <span style={{ marginLeft: "5px", fontSize: "0.8em" }}>&#10132;</span>

                                                                                        </Link>

                                                                                        {!isPermitted(unit.permission) &&
                                                                                            <span style={{
                                                                                                position: 'absolute',
                                                                                                top: '-5%',
                                                                                                left: '5%',
                                                                                                zoom: "30%",
                                                                                                backgroundColor: 'rgba(0, 0, 0, 1)',
                                                                                                color: 'cyan',
                                                                                                padding: '10px 40px 10px 40px',
                                                                                                fontSize: '2.2em',
                                                                                                borderRadius: '15px',
                                                                                                border: '1px solid cyan'
                                                                                            }}>
                                                                                                Unlock
                                                                                            </span>}
                                                                                        {unit.permission != 'free' &&
                                                                                            <span style={{
                                                                                                position: 'absolute',
                                                                                                top: '-5%',
                                                                                                right: '5%',
                                                                                                zoom: "30%",
                                                                                                backgroundColor: 'rgba(0, 0, 0, 1)',
                                                                                                color: unit.permission != 'basic' ? 'pink' : 'lightblue',
                                                                                                padding: '10px 40px 10px 40px',
                                                                                                fontSize: '2.2em',
                                                                                                borderRadius: '15px',
                                                                                                border: unit.permission != 'basic' ? '1px solid orange' : '1px solid purple',
                                                                                            }}>
                                                                                                {unit.permission.toUpperCase()}
                                                                                            </span>}
                                                                                    </div>

                                                                                    <ReactTooltip
                                                                                        style={{
                                                                                            maxWidth: "90%",
                                                                                            whiteSpace: "pre-line",
                                                                                            background: "transparent",
                                                                                            border: "1px dashed cyan",
                                                                                            zIndex: 9999 // High z-index to ensure it is on top
                                                                                        }}
                                                                                        id={"unit-description-" + unit.id}
                                                                                        place="over"
                                                                                        type="dark"
                                                                                        effect="solid"
                                                                                        delayShow={900}
                                                                                    >
                                                                                        <h6 style={{
                                                                                            border: "1px dashed cyan",
                                                                                            borderRadius: "15px",
                                                                                            padding: "15px",
                                                                                            background: "black",
                                                                                            zIndex: 10000 // Ensuring the content also has a high z-index
                                                                                        }}>
                                                                                            {unit.description}
                                                                                        </h6>
                                                                                    </ReactTooltip>
                                                                                </div>
                                                                            </Link>

                                                                        </SwiperSlide>
                                                                    </>
                                                                    ))}

                                                                </Swiper>
                                                            </> :
                                                                <center  >
                                                                    {/* <div style={{ height: "136px" }} >{globalArguments?.progress?<>No recent Activity</>:<Preloader/>}</div> */}

                                                                    <div style={{
                                                                        height: "333px",
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center"
                                                                    }} >
                                                                        {globalArguments?.recommended ? <>No Recommended units</> : <Preloader />}
                                                                    </div>                                                    </center>}



                                                            <div className="group-btn-nav">
                                                                <div className="swiper-button-prev button-collection-prev" />
                                                                <div className="swiper-button-next button-collection-next" />
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                    <div className="col-md-12">

                                        <div style={feedbackStyles} >
                                        {ArrowButton("explore journeys","Discover",handleExploreJourneys,"JerArrow")}

                                            <div className="col-md-12">
                                                <center style={{ margin: "5px" }}>
                                                    <h4 className="heading">ON-GOING JOURNEYS</h4>
                                                </center>
                                            </div>
                                            <div  className="col-md-12">
                                                <JourneyStatusGallery journeyClicked={journeyClicked} journeyStatus={globalArguments?.recommendedJourneys ? globalArguments?.recommendedJourneys : []}></JourneyStatusGallery>


                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>




                            <br></br>


                        </div>
                        {globalArguments?.profile && <CompleteRegisterModal isModal={isCompleteRegisterModal} handleModal={handleCompleteRegisterModal} updateProfile={updateProfile} figureId={globalArguments?.profile?.figure} name={globalArguments?.profile?.nickname || ""} />}
                        <JourneyModal journey={selectedJourney} isModal={isJourneyModal} handleModal={handleJourneyModal} />
                        <BadgesModal completed={globalArguments?.completedUnits} badges={globalArguments?.profile?.badges} stack={fullStack} isModal={isBadgesModal} handleModal={handleBadgesModal} />

                    </Layout>)}
        </div>
    )
})













