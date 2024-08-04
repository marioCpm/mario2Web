'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 1,
    loop: true,
    spaceBetween: 55,
    initialSlide: 2,
    centeredSlides: true,
    navigation: {
        clickable: true,
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        600: {
            slidesPerView: 2,
            spaceBetween: 20,
        },

        991: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        1280: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
        1500: {
            slidesPerView: 5.4,
            spaceBetween: 55,
        },
    },
}

export default function StepsSlider({steps, ModifyStep}) {
    return (
        <>

            <section className="tf-section section-roadmap3 section-bg-1">
                <div className="container-fluid"> 
                    <div className="row">
                        <div className="tf-heading mb60 wow fadeInUp">
                            <h2 className="heading">Session steps</h2>
                        </div>
                        <div className="col-md-12 wow fadeInUp">
                            <div className="tf-roadmap">
                                <div className="swiper-container swiper sl-roadmap">
                                    <Swiper {...swiperOptions} className="swiper-wrapper">
                                    {steps?.map((step, index) => (
                                        <SwiperSlide>
                                        <div className="roadmap-box" onDoubleClick={() => ModifyStep(step,index)}>
                                            <div className="shape-circle">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={60} height={176} viewBox="0 0 60 176" fill="none">
                                                    <path opacity="0.7" d="M30 176L30 40" stroke="var(--primary-color13)" strokeWidth={2} strokeDasharray="6 6" />
                                                    <circle cx={30} cy={30} r={30} fill="#21E786" className="fill-1" fillOpacity="0.2" />
                                                    <circle cx={30} cy={30} r={15} fill="#21E786" className="fill-2" />
                                                </svg>
                                            </div>
                                            <h6 className="title" >{index+1+". "+step.title}</h6>
                                            <div className="title" >{step.task}</div>

                                        </div>
                                    </SwiperSlide>
                                    ))}
                                    


                                    </Swiper>
                                    <div className="pagination-roadmap">
                                        <div className="swiper-button-prev" />
                                        <div className="swiper-button-next" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
