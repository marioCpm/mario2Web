import React, { useEffect, useState } from 'react';
import RateComponent from "./RateComponent";
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { getJourney } from '@/app/services/content';
import Link from 'next/link';
import UnitCard from './UnitCard';
import { useGlobalContext } from '@/app/context/GlobalContext';
import useMiddleware from '@/app/services/contextMiddleware';
import ProgressBar2 from './ProgressBar';

const levels = {
    1: "Novice",
    2: "Basic",
    3: "Intermediate",
    4: "Advanced",
    5: "Specialist",
    6: "Professional"
};



export default function JourneyModal({ isModal, handleModal, submitFeedback, journey }) {
    const { updateUnitWithProgress,getDynamicStyle } = useMiddleware();
    const [units, setUnits] = useState([]);
    const [unitHoverID, setUnitHoverID] = useState(-1);

    const swiperOptions = {
        modules: [Autoplay, Pagination, Navigation],
        slidesPerView: getDynamicStyle(8),
        spaceBetween: 30,
        navigation: {
            clickable: true,
            nextEl: ".button-collection-next",
            prevEl: ".button-collection-prev",
        },
    
    }
    useEffect(() => {
        const searchUnits = async (id) => {
            setUnits([]);
            try {
                const journeyData = await getJourney(id);
                // alert(JSON.stringify(journeyData));

                if (journeyData?.Units) {
                    console.log('Units fetched:', journeyData.Units);
                    setUnits(enhanceUnitsWithImages(journeyData.Units));
                } else {
                    console.error('No units found in journeyData:', journeyData);
                }
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        }

        if (journey?.journey_id) {
            searchUnits(journey.journey_id);
        }

    }, [journey.journey_id]);

    const CheckCompletion = (unit_id) => {
        return journey?.completedUnits?.some(id => id == unit_id);
    };

    const enhanceUnitsWithImages = (units) => {
        const maxImages = 13;
        return units?.map(unit => ({
            ...unit,
            imageUrl: unit.ImageUrl || `/assets/images/courseExamples/courseExample${Math.floor(Math.random() * maxImages) + 1}.png`
        }));
    };

    return (
        <>
            <div style={{background: "transparent" }} className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" style={{ maxHeight: "100%", maxWidth: getDynamicStyle(20) }} role="document">
                    <div className="modal-content">
                        
                        <div style={{
        
        backgroundSize: 'cover', // Ensures the background image covers the div completely
        borderRadius: '10px', // Sets the border radius
        border: '2px solid cyan',background:"rgba(0,0,0,0.9)",overflowY:"auto", height:"80vh",
      }} className="modal-body">
        <div style={{ zoom:"130%"}}>
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <h3 className="title">{journey?.journey?.topic}</h3>
                            <h6 style={{ color: "cyan" }} className="title">{journey?.journey?.unicode}</h6>
                            <h4 className="title">{journey?.journey?.description}</h4>
                            <br />
                            <br />
                            <div style={{zoom:"70%", padding: "20px" }} className="swiper-container collection">
                                <Swiper {...swiperOptions} className="swiper-wrapper">
                                    {units?.map((unit, index) => (
                                        <SwiperSlide key={"key12_"+index}>
                                            <UnitCard 
                                             margin="10px" height="360px"  width="250px"

                                                isCompleted={CheckCompletion(unit.id)} 
                                                levelName={levels[unit?.level]} 
                                                level={unit?.level} 
                                                navigateTo={`/unit-details`} 
                                                unit={unit} 
                                                setUnitHoverID={setUnitHoverID} 
                                                unitHoverID={unitHoverID} 
                                                clicked={updateUnitWithProgress} 
                                            />
                                        </SwiperSlide>
                                    ))}
                                    <div style={{minWidth: "400px"}}></div>
                                </Swiper>
                                <div className="group-btn-nav">
                                    <div className="swiper-button-prev button-collection-prev" />
                                    <div className="swiper-button-next button-collection-next" />
                                </div>
                            </div>
                            </div>  <div style={{ padding: "10px" }} >
                            <ProgressBar2 value={journey?.completedUnits?.length} max={journey?.units?.length} />

                            </div>
                            </div>
                    </div>
                </div>
            </div>
            {isModal && <div style={{    }} className="modal-backdrop fade show" onClick={handleModal} />}
        </>
    )
}



