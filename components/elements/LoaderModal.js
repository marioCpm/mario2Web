import Preloader from "./Preloader"
import ProgressBar2 from "./ProgressBar"
import React, { useEffect, useRef, useState } from 'react';

export default function LoaderModal( {isModal, handleModal,message,submessage,progressValue,progressMax}) {


    return (
        <>
            <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body ">
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <h3>{message}</h3>
                            <p className="sub-heading">{submessage}</p>
                            <div style={{
    display: 'flex',       // Enables flexbox
    justifyContent: 'center', // Centers horizontally
    alignItems: 'center',     // Centers vertically
    height: '700px',          // An explicit height for the container
    width: '100%',            // Use the full width available in the parent
    maxWidth: "480px",        // Maximum width as specified
    margin: 'auto',           // Helps in centering the maxWidth element in its parent
}}>
    <Preloader /></div>
    {progressValue && 
    <ProgressBar2 value={progressValue} max={progressMax} />}

                            {/* <div className="bottom">By connecting your wallet, you agree to our <Link href="#">Terms of Service</Link> and our <Link href="#">Privacy Policy.</Link></div> */}
                        </div>
                    </div>
                </div>
            </div>
            {isModal &&
                <div className="modal-backdrop fade show" onClick={handleModal}/>
            }
        </>
    )
}
