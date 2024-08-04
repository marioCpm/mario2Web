
'use client'
import Link from "next/link"
import React, { useEffect, useState } from 'react';
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'




export default function SessionsSlider_Builder({ sessions,setSessionIndex,ModifySession }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)


    const [isModal, setModal] = useState(false)
    const handleModal = () => setModal(!isModal)


      const initialSlideIndex = sessions.findIndex(session => session.status === "next");

    return (
        <>
            <div className="swiper sl-roadmap3-thumb">
                <Swiper 
                    onSlideChange={(swiper) => setSessionIndex(swiper.activeIndex)}

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
                    {sessions?.map((session,index) => (<>
                        <SwiperSlide key={"key33_"+session?.id} style={{opacity:"1"}} >
                            <div className="content-rm-thumb" onDoubleClick={() => ModifySession(session,index)}>



                                <div className="content-right">
                                <h3>{session?.title}</h3>
                                <h6>{session?.description}</h6>
                                <br></br>
                                    <ul className="list-infor">
                                        {session?.learningGoals?.map(feature => (
                                            <li key={"key34_"+feature}>
                                                <div className="icon">
                                                    <img src={"/assets/icon/Favicon.png"} alt={`${feature} icon`} />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>


                                    {/* <Link onClick={handleModal} href={"myapp://openWindow"} className="tf-button style-2">START SESSION</Link> */}
                                </div>
                            </div>
                        </SwiperSlide>
  
                        </>
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
                    {sessions?.map((phase,index) => (<>
                        <SwiperSlide key={"key35_"+phase.id} style={{opacity: phase.status == "lock"? "0.5":"1"}}>
                            <div className="thumb-rm">
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={31} height={30} viewBox="0 0 31 30" fill="none">
                                        <circle className="fill-pri" opacity="0.1" cx="15.5" cy={15} r={15} fill="var(--product-color21)" />
                                        <circle className="fill-pri" cx="15.5" cy={15} r="7.5" fill="#888B8E" />
                                    </svg>

                                </div>
                                <h5>{index+1}</h5>
                                {/* {phase?.steps?.length>0 && JSON.stringify(phase?.steps)} */}
                            </div>
                        </SwiperSlide>
                                              </>
                    ))}
                </Swiper>
                <div className="swiper-pagination swiper-pagination-progressbar" />
                <div className="swiper-button-next" />
                <div className="swiper-button-prev" />
            </div>

            </>
    )
}
