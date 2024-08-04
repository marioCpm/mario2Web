import React from 'react';
import moment from 'moment';
import { IoDiamondOutline } from 'react-icons/io5';
import ScrollText from './ScrollText';
import ScoreComponent from './ScoreComponent';
import { Tooltip as ReactTooltip } from 'react-tooltip';

export default function UnitMiniCard({ stack,level, c_unit, margin = "5px"}) {
    
    let unit = c_unit.unit;
    level = unit?.level;

    // Function to format date to relative time
    const formatDate = date => moment(date).fromNow();

    return (
        <div  style={{ }} className="tf-product" > 

<div key={"key21_" + unit.id} style={{ margin: margin, display: 'flex',  justifyContent: 'space-between', alignItems: 'stretch' }}>
            <div style={{ flexGrow: 1, marginRight: '5px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '60px', height: '60px' }}>
                    <img src={`/assets/images/milestones/milestone${level}.png`} alt="Image" style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{marginBottom: "10px", marginTop: "5px", display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {stack?.map((stack, index) => {
                        return (
                            <div key={"key22_" + index} data-tooltip-id={"stack-" + stack.id} style={{ display: 'flex', flexDirection: "row", alignItems: 'center' }}>
                                <img src={stack?.icon} alt={stack?.title} style={{ margin: "2px", height: "20px" }} />
                                <ReactTooltip style={{ maxWidth: "200px", whiteSpace: "pre-line" }} id={"stack-" + stack.id} place="top" type="dark" effect="solid">
                                    {stack.title}
                                </ReactTooltip>
                            </div>
                        );
                    })}
                </div>
                <div style={{ marginTop: 'auto', zoom: "60%",  width: '120px' }}> {/* Ensure this container has a fixed width */}
                    <ScoreComponent score={c_unit.completedSessions} totalPentagons={c_unit.totalSessions} showScore={false} simple={true} />
                </div>
            </div>

            <div data-tooltip-id={"unit-description-" + unit.id} style={{ textAlign: 'right'}}> {/* Use flexGrow to use available space */}
                <h6  style={{ color: "cyan", fontSize: "22px" }}>
                {unit.topic}
                </h6>
                <h6 className="timestamp">{formatDate(c_unit.completedAt)}</h6>
                <h5 className="glowing-text" style={{ fontFamily: 'Consolas', color: 'lightgreen' }}>
                    {c_unit.score ? c_unit.score : <div className="spinner"></div>}
                    <IoDiamondOutline style={{ marginLeft: "5px", verticalAlign: "middle" }} />
                </h5>
            </div>
        </div>
        <ReactTooltip style={{ maxWidth: "50%", whiteSpace: "pre-line",background: "transparent",border:"1px dashed cyan" }} id={"unit-description-"+ unit.id} place="over" type="dark" effect="solid"  delayShow={900}>
                                                                                    
                                                                                    <h6 style={{border:"1px dashed cyan", borderRadius:"15px", padding: "15px",background: "black" }}>{unit.description}</h6>
                                                                                </ReactTooltip>
        </div>

    );
}