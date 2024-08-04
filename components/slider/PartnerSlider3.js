'use client'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import ImageChecker from "../elements/ImageChecker"

const swiperOptions = {
    modules: [Autoplay, Navigation, Pagination],
    spaceBetween: 30,
    grabCursor: true,
    loop: false,
    breakpoints: {
        0: {
            slidesPerView: 3
        },
        600: {
            slidesPerView: 5
        },
        991: {
            slidesPerView: 6
        },
        1200: {
            slidesPerView: 6,
        },
    },
    observer: true,
    observeParents: true,
    shortSwipes: false,
    longSwipes: false,
    allowTouchMove: true,

    autoplay: {
        delay: 1000,
        reverseDirection: true,

    },
    freeMode: true,
    speed: 3000,
    //disableOnInteraction: false
}


export default function PartnerSlider1({stack}) {
    return (
        <>
            <Swiper {...swiperOptions} >
            {stack?.map((stack, index) => (
                                <SwiperSlide key={"key44_"+index}>
                                <div className="slider-item">
                                    <div className="tf-partner">
                                        
                                    <ImageChecker src={stack.icon} alt={"Image"} style={{height: "50px"}} />   
                                        <div>{stack.title+""}</div>

                                    </div>
                                </div>{/* item*/}
                            </SwiperSlide>
            ))}
            </Swiper>
        </>
    )
}
