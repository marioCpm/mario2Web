import React from 'react';
import Link from "next/link"
import Star from './Star';
import { BsPeopleFill } from 'react-icons/bs';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { getLevelNameById } from '@/app/helpers/levels';
import FloatingCircle from './FloatingCircle';
import useMiddleware from '@/app/services/contextMiddleware';
import ImageChecker from './ImageChecker';


const elements = [
    { type: 'text', content: 'Hello World' },
    { type: 'text', content: 'React is awesome!' },
    { type: 'svg', content: 'https://simpleicons.org/icons/javascript.svg' },
];

// Sample RGBA color set
const colors = [
    { r: 255, g: 0, b: 0, a: 0.5 },
    { r: 0, g: 255, b: 0, a: 0.5 },
    { r: 0, g: 0, b: 255, a: 0.5 },
    { r: 255, g: 255, b: 0, a: 0.5 }
];

export default function UnitCard({ stack, isCompleted, level, levelName, unit, clicked, navigateTo, margin = "15px", height = "410px", width = "280px" }) {

    const { isPermitted } = useMiddleware();
    return (

        <div


            key={"key19_" + unit.id}
            className="col-lg-3 col-md-4 col-sm-4 col-12"
            style={{ minWidth: width }}
        >

            <ReactTooltip style={{ zIndex: 1000, maxWidth: "80%", whiteSpace: "pre-line", background: "black", border: "1px dashed cyan" }} id={"unit-description-" + unit.id} place="over" type="dark" effect="solid" delayShow={900}>
                <h6 style={{ border: "1px dashed cyan", borderRadius: "15px", padding: "15px", background: "black" }}>{unit.description}</h6>
            </ReactTooltip>
            {/* <FloatingCircle elements={elements} colors={colors} /> */}

            <Link onClick={() => isPermitted(unit.permission) ? clicked(unit) : null} href={isPermitted(unit.permission) ? navigateTo : "/pricing"}>
                <div style={{ margin: margin, height: height }} className="tf-product">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>


                        <div style={{ height: "60px", textAlign: "left" }}>
                            <h6
                                className={"scroll-text-disable"}
                                style={{ color: isPermitted(unit.permission) ? "lightgreen" : "gray", fontSize: unit.topic.length > 30 ? "18px" : "22px" }}
                            >
                                {unit.topic}
                                {/* {JSON.stringify(unit)} */}

                            </h6>
                            <div style={{ marginTop: "5px", display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

                                {stack?.map((stack, index) => {
                                    return (
                                        <div key={"key20_" + index} data-tooltip-id={"stack-" + stack.id} style={{ display: 'flex', flexDirection: "row", alignItems: 'center' }}>
                                            <ImageChecker

                                                src={stack?.icon ? stack?.icon : "/assets/images/milestones/milestone1.png"}
                                                alt={stack?.title}
                                                style={{ margin: "2px", height: "20px" }}
                                            />
                                            <ReactTooltip style={{ maxWidth: "200px", whiteSpace: "pre-line" }} id={"stack-" + stack.id} place="top" type="dark" effect="solid">
                                                {stack.title}
                                            </ReactTooltip>
                                        </div>
                                    );
                                })}
                            </div>


                            <div style={{ fontSize: "12px" }}>
                                {unit.unicode}
                            </div>


                        </div>
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

                        {/* <div style={{ marginLeft: "10px", textAlign: "right" }}>
                            <div style={{
                                background: 'rgba(0, 0, 0, 0.5)',
                                borderRadius: '50%',
                                width: '60px',
                                height: '60px',
                                textAlign: 'center',
                                lineHeight: '60px',
                                overflow: 'hidden'  // Ensure no part of the image spills out
                            }}>

                                {unit?.created_by_figure ?
                                    <img src={unit?.created_by_figure} data-tooltip-id={`created_by`} alt="Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <img src={`/assets/figures/galenai.png`} data-tooltip-id={`created_by`} alt="Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                }
                            </div>
                        </div> */}
                    </div>
                    <br></br>
                    <div
                        data-tooltip-id={"unit-description-" + unit.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            width: "100%",
                            height: "200px",

                        }}
                        className="image"
                    >
                        <div style={{
                            width: "90%",
                            height: "90%",
                            objectFit: "contain",
                            alignSelf: 'center',
                            borderRadius: '15px',
                            overflow: "hidden",
                            
                        }}>
                            <img
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                                src={unit.imageUrl ? unit.imageUrl : "/assets/images/courseExamples/noPhoto2.png"}
                                alt={`Image of ${unit.topic}`}
                            /></div>

                        {isCompleted && (
                            <span style={{
                                position: 'absolute',
                                top: '30%',
                                left: '50%',
                                zoom: "70%",
                                transform: 'translate(-80%, -80%) rotate(-15deg)',
                                backgroundColor: 'rgba(0, 0, 0, 1)',
                                color: 'cyan',
                                padding: '10px 40px 10px 40px',
                                fontSize: '2.2em',
                                borderRadius: '15px',
                                border: '1px solid cyan',
                                filter: "grayscale(80%)",
                                opacity: "0.8"
                            }}>
                                DONE
                            </span>
                        )}
                    </div>


                    <div className="scroll-container">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ textAlign: "left" }}>
                                <div data-tooltip-id={`milestone` + unit.id} style={{ borderRadius: '50%', width: '60px', height: '60px', textAlign: 'center', lineHeight: '40px' }}>
                                    <img src={`/assets/images/milestones/milestone${level}.png`} alt="Image" />
                                </div>
                                <ReactTooltip style={{ maxWidth: "200px", whiteSpace: "pre-line" }} id={`milestone` + unit.id} place="bottom" type="dark" effect="solid" >
                                    {levelName}
                                </ReactTooltip>
                            </div>
                            <div style={{ textAlign: "right", marginLeft: "10px" }}>
                                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", fontSize: "16px" }}>{unit.ranking} <div style={{ marginLeft: "5px" }}><Star size="15"></Star></div>    </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", fontSize: "16px" }}>
                                    {unit.participated} <BsPeopleFill style={{ marginLeft: "5px" }} fill="cyan" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <ReactTooltip style={{ maxWidth: "200px", whiteSpace: "pre-line" }} id={`created_by`} place="bottom" type="dark" effect="solid" >
                {"created by"}
            </ReactTooltip>

        </div>
    );
}









