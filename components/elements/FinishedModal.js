
import React, { useEffect, useState } from 'react';
import Preloader from './Preloader';

export default function FinishedModal({ isModal,score,isReqRunning,continueNextSession }) {

    return (
        <>
            <div style={{ background: "transparent" }} className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" style={{ maxHeight: "70vh", maxWidth: "90vh" }} role="document">
                    <div className="modal-content" >
                        <div className="modal-body ">

                        {score >-1 ? <div> congrats, you earned {score} points.</div>:<br></br>}
                        <br></br>
                        <br></br>
                        <div style={{
                                height: "222px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }} >
                                <Preloader showLoadingText={isReqRunning} loadingText="Saving results.."></Preloader>
                            </div>                                <div className="group-btn">
                                    <br></br><br></br>
                                <div  className={isReqRunning?"tf-button style-3":"tf-button style-1"}>
                                {isReqRunning?<span>{"Continue"}</span>:<span onClick={()=>{ continueNextSession()}}>{"Continue"}</span>}
                                </div>
                            </div>                            

                        

                        </div>
                    </div>
                </div>
            </div>
            {isModal &&
                <div className="modal-backdrop fade show" onClick={() => { }} />
            }
        </>
    )
}
