import FigurePickup from '@/app/change-figure/figurePickup';
import useMiddleware from '@/app/services/contextMiddleware';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function CompleteRegisterModal({ name, figureId, updateProfile, isModal, handleModal }) {
    const [figure, setFigure] = useState("");
    const [nickname, setNickname] = useState(name);
    const [currentPage, setCurrentPage] = useState(name ? 'figure' : 'nickname');
    
    const { getDynamicStyle } = useMiddleware();

    const inputStyle = {
        display: 'block', // Makes the input a block element
        margin: '50px auto', // Centers it horizontally and adds vertical spacing
        width: '80%', // Specifies width relative to its container
        padding: '15px', // Increases padding inside the input for better text visibility
        fontSize: '2.5rem', // Increases font size for better readability
        borderRadius: '25px', // Rounds the corners of the input field
        textAlign: 'center', // Centers the text inside the input field
        border: "1px solid cyan",
        height: "55px"// Adds border with cyan color
    };

    const focusStyle = {
        outline: 'none', // Removes default focus outline for a cleaner look
        color: 'white', // Sets text color to white on focus
        background: 'transparent', // Sets a transparent background on focus
        borderColor: '#007BFF' // Changes border color on focus for visual feedback
    };

    const handleNext = () => {
        setCurrentPage('figure');
    };

    const handleUpdate = () => {
        updateProfile(nickname, figure);
    };

    return (
        <>
            {isModal &&
                <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} tabIndex={-1} aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" style={getDynamicStyle(2)} role="document">
                        <div className="modal-content" style={{ background: "rgba(0, 0, 0, 0.8)", borderRadius: '10px', border: '2px solid cyan', overflowY: 'auto', maxHeight: '90vh' }}>
                            <div className="modal-body" style={{ padding: '5px' }}>
                                <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                                {currentPage === 'nickname' ? (
                                    <>                                    
                                        <h5 style={{margin: "30px"}} className="title">How would you like to be called?</h5>

                                        <input
                                            style={inputStyle}
                                            type="text"
                                            value={nickname}
                                            onChange={(event) => setNickname(event.target.value)}
                                            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                                        />
                                        <div className="group-btn" style={getDynamicStyle(3)}>
                                            <button style={{margin: "30px"}} onClick={handleNext} className="tf-button" >
                                                <span>Next</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h5 style={{margin: "30px"}} className="title">Choose an AI partner.</h5>
                                        <FigurePickup setFigure={setFigure} figureId={figureId} />
                                        <div className="group-btn" style={getDynamicStyle(3)}>
                                            <Link href="/profile" onClick={handleUpdate} className="tf-button" style={{ margin: "30px" }}>
                                                <span>UPDATE</span>
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>}
            {isModal && <div className="modal-backdrop fade show" onClick={handleModal} />}
        </>
    );
}
