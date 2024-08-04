'use client'
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import FitText from "../elements/FitText";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import useMiddleware from "@/app/services/contextMiddleware";


const swiperOptions = {
    modules: [Autoplay, Navigation, Pagination],
    spaceBetween: 30,
    grabCursor: true,
    loop: false,
    breakpoints: {
        0: {
            slidesPerView: 1
            
        },
        600: {
            slidesPerView: 2
        },
        991: {
            slidesPerView: 3
        },
        1200: {
            slidesPerView: 4
        },
    },
    observer: true,
    observeParents: true,
    shortSwipes: false,
    longSwipes: false,
    allowTouchMove: true,

    autoplay: {
        delay: 1200,
        reverseDirection: true,
    },
    freeMode: true,
    speed: 3000,
}
const swiperOptions2 = {
    modules: [Autoplay, Navigation, Pagination],
    spaceBetween: 30,
    grabCursor: true,
    loop: false,
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        600: {
            slidesPerView: 2
        },
        991: {
            slidesPerView: 3
        },
        1200: {
            slidesPerView: 4,
        },
    },
    observer: true,
    observeParents: true,
    shortSwipes: false,
    longSwipes: false,
    allowTouchMove: true,

    autoplay: {
        delay: 1000,
    },
    freeMode: true,
    speed: 3000,
    //disableOnInteraction: false
}



export default function Collection1({collectionData}) {
    const {  getRandomImage } = useMiddleware();
    let duplicatedSlides1;
    let duplicatedSlides2;
    if (collectionData?.units1){
        duplicatedSlides1 = [...collectionData?.units1, ...collectionData?.units1]; // Duplicate slides to ensure looping
    }
    if (collectionData?.units2){
        duplicatedSlides2 = [...collectionData?.units2, ...collectionData?.units2]; // Duplicate slides to ensure looping
    }

    return (
        <div style={{margin: "10px 10px 10px 10px"}}>

            <section style={{ zoom: "75%"}}  className=" tf-collection ">
                <div className="tf-container">
                    <div className="row">
                    <div className="tf-heading mb60 fadeInUp">
                                <h2 className="heading">OUR UNITS</h2>
                            </div>
                        <div className="col-md-12 fadeInUp">
                            <div className="swiper-container collection-1 visible">
                                <Swiper {...swiperOptions} className="swiper-wrapper ">
                                    {duplicatedSlides1?.map((unit, index) => (
                                

                                        <SwiperSlide key={"key25_"+index}>
                                            <div style={{ zoom: "175%"}} className="slider-item">
                                                <div style={{ margin: "5px" }} className="tf-product">
                                                <Link href={`/unit-details`}>
                                                    <div  data-tooltip-id={"unit-description-round-"+index+"_unit_" + unit.id} className="image">
                                                        <img src={unit.imageUrl? unit.imageUrl : getRandomImage()} alt={unit.topic} />
                                                        <ReactTooltip
                                                                                    style={{
                                                                                        maxWidth: "90%",
                                                                                        whiteSpace: "pre-line",
                                                                                        background: "transparent",
                                                                                        zIndex: 9999 // High z-index to ensure it is on top
                                                                                    }}

                                                                                    id={"unit-description-round-"+index+"_unit_" + unit.id}
                                                                                    place="over"
                                                                                    type="dark"
                                                                                    effect="solid"
                                                                                    delayShow={200}
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

                                                    <h6 className="name" style={{ color: "lightgreen", margin: "5px" }}>
                                                        <FitText text={unit.topic} />
                                                    </h6>
                                                        <div  className="explore-link" style={{ fontSize: "0.8em", position: "absolute", right: "10px", bottom: "10px", display: "flex", alignItems: "center", textDecoration: "none", color: "white" }}>
                                                  Explore <span style={{ marginLeft: "5px", fontSize: "0.8em" }}>&#10132;</span>
                                                    </div> 
                                                </div>
                                            </div>

                                        </SwiperSlide>

                                    ))}

                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <div className="tf-container">
                    <div className="row">
                        <div className="col-md-12 fadeInUp">
                            <div className="swiper-container collection-1 visible">
                                <Swiper {...swiperOptions2} className="swiper-wrapper ">
                                    {duplicatedSlides2?.map((unit, index) => (                               

                                        <SwiperSlide key={"key26_"+index}>   

                                        <div style={{ zoom: "175%"}} className="slider-item">

                                            <div style={{ margin: "5px" }} className="tf-product">
                                            <Link href={`/unit-details`}>
                                                    <div  data-tooltip-id={"unit-description-" + unit.id} className="image">
                                                        <img src={unit.imageUrl? unit.imageUrl : getRandomImage()} alt={unit.topic} />
                                                        <ReactTooltip
                                                                                    style={{
                                                                                        maxWidth: "90%",
                                                                                        whiteSpace: "pre-line",
                                                                                        background: "transparent",
                                                                                        
                                                                                        zIndex: 9999 // High z-index to ensure it is on top
                                                                                    }}
                                                                                    id={"unit-description-" + unit.id}
                                                                                    place="over"
                                                                                    type="dark"
                                                                                    effect="solid"
                                                                                    delayShow={200}
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
                                                <h6 className="name" style={{ color: "lightgreen", margin: "5px" }}>
                                                    <FitText text={unit.topic} />
                                                </h6>
                                                  <div  className="explore-link" style={{ fontSize: "0.8em", position: "absolute", right: "10px", bottom: "10px", display: "flex", alignItems: "center", textDecoration: "none", color: "white" }}>
                                                  Explore <span style={{ marginLeft: "5px", fontSize: "0.8em" }}>&#10132;</span>
                                                    </div> 

                                            </div>                                    

                                        </div>
                                    </SwiperSlide>         

                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
