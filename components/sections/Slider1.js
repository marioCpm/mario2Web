'use client'
import Link from "next/link"
import { TypeAnimation } from 'react-type-animation'
import { Swiper, SwiperSlide } from "swiper/react"
import CounterUp from "../elements/CounterUp"
import { useUser } from '@auth0/nextjs-auth0/client';

const swiperOptions = {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
}

const generateSequence = (subjects, pauseDuration) => {
    
    return subjects.flatMap((subject) => [subject, pauseDuration]);
};

export default function Slider1({sliderData}) {
    const { user, error, isLoading } = useUser();
    let commingSoon = false;

    return (
        <>

            <section className="tf-slider home3">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="swiper-container slider-home">
                                <Swiper {...swiperOptions} className="swiper-wrapper">
                                    <SwiperSlide>
                                        <div className="slider-item">
                                            <div className="tf-slider-item style-3">
                                                <div className="content-inner">
                                                <h1 className="heading"></h1>
                                                <h1 className="heading mb0">ELEVATE</h1>
                                                    <h1 className="heading mb0">
                                                        <span className="animationtext clip">
                                                        {sliderData?.list &&
                                                            <TypeAnimation
                                                                    sequence={generateSequence(sliderData?.list, 1000)} // Inserting a 1000ms pause between each subject

                                                                wrapper="span"
                                                                speed={50}
                                                                style={{ display: 'inline-block' }}
                                                                repeat={Infinity}
                                                                className="cd-words-wrapper ms-3">
                                                            </TypeAnimation>}
                                                        </span>
                                                    </h1>
                                                    <h1 className="heading">SKILLS WITH US </h1>
                                                    <p className="sub-heading">{sliderData?.sentence}</p>
                                                    <div className="counter-wrap">
                                                        <div className="tf-counter">
                                                            <div className="content">
                                                                <CounterUp count={sliderData?.SimplifiedTutorials} />+
                                                            </div>
                                                            <h6>Simplified Tutorials</h6>
                                                        </div>
                                                        <div className="tf-counter">
                                                            <div className="content">
                                                                <CounterUp count={sliderData?.AddictedUsers} />+
                                                            </div>
                                                            <h6>Addicted Users</h6>
                                                        </div>
                                                    </div>
                                                    {!commingSoon ? <>
                                                        {!user?.email ? (                                                    <div className="btn-slider ">
                                                        <a href="/api/auth/login?returnTo=/profile" className="tf-button " data-toggle="modal" data-target="#popup_bid">SIGN UP FOR FREE</a>
                                                        <a href="/api/auth/login?returnTo=/profile" className="tf-button style-2">SIGN IN</a>
                                                    </div>) : (                                                    <div className="btn-slider ">
                                                        <Link href="/profile" className="tf-button " data-toggle="modal" data-target="#popup_bid">VISIT PROFILE</Link>
                                                    </div>)}
                                    </> : <div>
                                            <a href="/" className="tf-button connect" data-toggle="modal" data-target="#popup_bid">
                                                <span>Comming soon...</span>
                                            </a>
                                    </div>}
                          

                                                </div>
                                                <div className="image">
                                                  {/* <img src="/assets/images/slider/slider-8.png" alt="Image" className="img ani5" /> */}
                                                    {/* <img src="/assets/images/slider/slider-7.png" alt="Image" className="ani4 img-1" />
                                                    <img src="/assets/images/slider/slider-6.png" alt="Image" className="ani5 img-2" />  */}
                                                </div>
                                            </div>
                                        </div>{/* item*/}
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
