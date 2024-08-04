
'use client'
import Link from "next/link"
import React, { useEffect, useState, useRef } from 'react';
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import Editor from "@monaco-editor/react";
import QuestionStep from "./QuestionStep";
import useMiddleware from "@/app/services/contextMiddleware";




export default function LiveSessionStepSlider({ steps, continueSession, questionDone }) {
    const { getDynamicStyle } = useMiddleware();

    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [activeSlide, setActiveSlide] = useState(steps.length - 1);
    const [allowContinue, setAllowContinue] = useState(true);
    const [continueClicked, setContinueClicked] = useState(0);
    const mainSwiperRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);

    const copyCode = (code) => {
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1000); // Hide after 1 second
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    };


    const feedbackStyles = {
        width: '80%',
        color: "white",
        backgroundColor: "black",
        border: '2px dashed cyan',
        borderWidth: "1px", borderColor: "cyan", borderRadius: "5px", padding: "20px"
    };


    useEffect(() => {
        if (mainSwiperRef.current) {
            mainSwiperRef.current.slideTo(steps.length - 1);
        }
        if (steps[steps.length - 1]?.message?.type == "question") {
            setAllowContinue(false)
            setContinueClicked(0)
        }
        else {
            setAllowContinue(true)
            setContinueClicked(0)
        }
    }, [steps]);

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
                    onSwiper={(swiper) => mainSwiperRef.current = swiper}
                // Set initial slide
                >
                    {steps?.map((step, index) => (<>
                        <SwiperSlide style={{ opacity: "1" }} key={"key30_" + index}>
                            <div className="content-rm-thumb" style={{ background: "transparent", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                {step?.message?.type == "question" ? (
                                    <QuestionStep
                                        setAllowContinue={setAllowContinue}
                                        setContinueClicked={setContinueClicked}
                                        done={questionDone}
                                        continueClicked={continueClicked}
                                        step={step?.message}
                                    />
                                ) : (
                                    <div style={feedbackStyles}>
                                        <h3>{step?.message?.title}</h3>

                                        <div style={{ maxWidth: getDynamicStyle(23), opacity: "1", margin: "20px", textAlign: 'center' }}>
                                            <h6>{step?.message?.text}</h6>
                                            <br />
                                            <br />
                                            {step?.message?.code && (
                                                <>
                                                    <div style={{ WebkitAppRegion: 'no-drag', borderWidth: "0.2px", borderColor: "cyan", padding: "3px", borderRadius: "5px", position: 'relative' }}>
    <Editor
        height="200px"
        language={step?.message?.code_type?.toLowerCase() ? step?.message?.code_type?.toLowerCase() : "python"}
        theme="vs-dark"
        value={step?.message?.code}
        options={{
            lineNumbers: "off",
            inlineSuggest: true,
            fontSize: "16px",
            formatOnType: true,
            autoClosingBrackets: true,
            minimap: { autohide: true, enabled: false }
        }}
    />
    <div>
    <span  onClick={() => copyCode(step?.message?.code)} className="copyButton" style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            zoom:"30%",
            backgroundColor: 'rgba(0, 0, 0, 1)',
            color: 'lightblue',
            padding: '10px 40px',
            fontSize: '2.2em',
            borderRadius: '15px',
            border: '1px solid cyan',
            cursor: "pointer"
        }}>
            {'Copy'}
        </span>
        <span style={{
                opacity: isCopied ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                            position: 'absolute',
            top: '100px',
            right: '-80px',
            zoom:"30%",
            backgroundColor: 'rgba(0, 0, 0, 1)',
            color: 'lightblue',
            padding: '10px 40px',
            fontSize: '2.2em',
            borderRadius: '15px',
            border: '1px solid white',
        }}>
            {'Copied to clipbord'}
        </span>
        <span style={{
            position: 'absolute',
            top: '-80px',
            right: '180px',
            zoom:"30%",
            backgroundColor: 'rgba(0, 0, 0, 1)',
            color: 'lightblue',
            padding: '10px 40px',
            fontSize: '2.2em',
            borderRadius: '15px',
            border: '1px solid orange',
        }}>
{step?.message?.code_type}
                                                    </span>
    </div>
</div>
 </>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                    {steps?.map((phase, index) => (<>
                        <SwiperSlide key={"key31_" + phase.id} style={{ opacity: phase.status == "lock" ? "0.5" : "1" }}>
                            <div className="thumb-rm">
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={31} height={30} viewBox="0 0 31 30" fill="none">
                                        <circle className="fill-pri" opacity="0.1" cx="15.5" cy={15} r={15} fill="var(--product-color21)" />
                                        <circle className="fill-pri" cx="15.5" cy={15} r="7.5" fill="#888B8E" />
                                    </svg>

                                </div>
                                <h5>{index + 1}</h5>
                                {/* {phase?.steps?.length>0 && JSON.stringify(phase?.steps)} */}
                            </div>
                        </SwiperSlide>
                    </>
                    ))}
                </Swiper>
                {steps?.length > 0 && <>
                    {allowContinue ?
                        <button onClick={() => allowContinue && continueSession()}> Continue </button> : <>
                            <button onClick={() => setContinueClicked(continueClicked + 1)}> Continue </button>
                        </>}</>}
                <div className="swiper-pagination swiper-pagination-progressbar" />
                <div className="swiper-button-next" />
                <div className="swiper-button-prev" />
            </div>

        </>
    )
}
