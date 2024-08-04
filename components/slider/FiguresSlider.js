
'use client'
import Link from "next/link"
import React, { useEffect, useRef, useState } from 'react';
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useGlobalContext } from "@/app/context/GlobalContext";
import ThreeDCharacter from "../elements/ThreeDCharacter";
import useMiddleware from "@/app/services/contextMiddleware";
import ThreeDCharacterViewer from "../elements/ThreeDCharacterViewer";




export default function FiguresSlider({ figureId, setFigure ,names=true}) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [activeIndex, setActiveIndex] = useState(0);
    const mainSwiperRef = useRef(null);
    const { getDynamicStyle,getFigures } = useMiddleware();
    const figures = getFigures();

    useEffect(() => {
        if (figureId) {
            const current = figures.findIndex(f => f.id == figureId);
            if (mainSwiperRef.current) {
                mainSwiperRef.current.slideTo(current);
            }
        }


    }, [figureId]);


    const handleSlideChange = (swiper) => {

        setActiveIndex(swiper.realIndex);

        setFigure(figures[swiper.realIndex]);
    };


    return (
        <>
            <div className="swiper sl-roadmap3-thumb">
                <Swiper   
                    onSlideChange={handleSlideChange}

                    spaceBetween={0}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    pagination={{
                        el: ".swiper-pagination",
                        type: "progressbar",
                    }}
                    loop={true}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="swiper-wrapper"
                    onSwiper={(swiper) => mainSwiperRef.current = swiper}

                >
                    {figures?.map((figure, index) => (
                        <SwiperSlide key={"key28_"+index} style={{ opacity: "1" }} >
                {/* <div style={{ height, position: 'relative' }}>
                {activeIndex === index && (<>
                                    <ThreeDCharacterViewer from ="slider" modelUrl={figure.path3d} />
                                     </>
                                )}
                                    </div> */}
                                    <div className="tf-team">
                                        <div style={{ height:"200px", width:"200px" }} className="image">
                                        {activeIndex === index && (<>
                                    <ThreeDCharacterViewer from ="slider" modelUrl={figure.path3d} />
                                     </>
                                )}                                        </div>
                                        <h4 className="name"><Link href="/team">{figure.name}</Link></h4>
                                        <p className="position">{figure.description}</p>
                                    </div>
                                    {figure?.id}

                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {getDynamicStyle(21) && <div className="swiper sl-roadmap3">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={1}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    loop={true}
                    className="swiper-wrapper">

                    {figures?.map((figure, index) => (
                        <SwiperSlide key={"key28_"+index} style={{ opacity: "1" }} >

                            <div className="thumb-rm">
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={31} height={30} viewBox="0 0 31 30" fill="none">
                                        <circle className="fill-pri" opacity="0.1" cx="15.5" cy={15} r={15} fill="var(--product-color21)" />
                                        <circle className="fill-pri" cx="15.5" cy={15} r="7.5" fill="#888B8E" />
                                    </svg>

                                </div>
                                {names &&
                                <h5>{figure.name}</h5>}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="swiper-pagination swiper-pagination-progressbar" />
                <div className="swiper-button-next" />
                <div className="swiper-button-prev" />
            </div>}
       
        </>
    )
}
