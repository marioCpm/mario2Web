import React from 'react';
import UnitMiniCard from './UnitMiniCard';
import useMiddleware from '@/app/services/contextMiddleware';

export default function BadgesModal({ badges, stack, completed, isModal, handleModal }) {
    const {  getStack } = useMiddleware();

    return (
        <>
            <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" style={{ maxHeight: "70vh", maxWidth: "90vh",overflowY: 'auto' }} role="document">
                    <div className="modal-content" style={{ background: "rgba(0, 0, 0, 0.8)", borderRadius: '10px', border: '2px solid cyan' }}>
                        <div style={{zoom: "80%"}} className="modal-body">
                        <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <h3 className="title">Past Journeys:</h3>
                            <div className="badges-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '10px' }}>
                                {badges?.map(badge => (
                                    <div key={"key9_"+badge.id} style={{ textAlign: 'center', margin: '10px' }}>
                                        <img src={badge.img} alt={badge.journeyName} style={{ width: '100px', height: '100px' }} />
                                        <h5 style={{ color: 'cyan' }}>{badge.journeyName}</h5>
                                    </div>
                                ))}
                            </div>
                            <h3 className="title">Known Stack:</h3>
                            <div className="stack-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '10px' }}>
                                {stack?.map(tech => (
                                    <div key={"key10_"+tech.id} style={{ textAlign: 'center', margin: '10px' }}>
                                        <img src={tech.icon} alt={tech.title} style={{ width: '50px', height: '50px' }} />
                                        <h5 style={{ color: 'cyan' }}>{tech.title}</h5>
                                    </div>
                                ))}
                            </div>
                            <br></br>
                            <h3 className="title">Completed Units:</h3>
                            <div className="stack-container" style={{ zoom: "80%",  display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '2px' }}>
                                {completed?.map((unit, index) => (
                                    <div key={"key50_"+index} style={{ textAlign: 'center', margin: '2px' }}>

                                        <UnitMiniCard stack={getStack(unit?.unit.stack)} height = {"120px"} width = {"380px"} c_unit={unit}></UnitMiniCard>
                                        {/* <UnitMiniCard stack={getStack(course?.unit?.stack)} height = {"120px"} width = {"480px"} c_unit={course}></UnitMiniCard> */}


</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModal && <div className="modal-backdrop fade show" onClick={handleModal} />}
        </>
    );
}
