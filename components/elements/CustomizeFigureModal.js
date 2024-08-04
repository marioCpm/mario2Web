import FigurePickup from '@/app/change-figure/figurePickup';
import Link from 'next/link';
import React, { useState } from 'react';
import ThreeDCharacter from './ThreeDCharacter';
import ThreeDEditor from './ThreeDEditor';
import { isThenable } from 'next/dist/client/components/router-reducer/router-reducer-types';

export default function CustomizeFigureModal({ updateProfile, isModal, handleModal ,figure,originalMeshColors,name}) {
    const [nickname, setNickname] = useState(name);
    const [meshColors, setMeshColors] = useState(originalMeshColors);
    const [isEditable, setIsEditable] = useState(false);

    // Updated styles to include input and icon wrapper
    const inputWrapperStyle = {
        position: 'relative',
        display: 'block', 
        margin: '20px auto',
        width: '80%'
    };

    const inputStyle = {
        width: '100%', 
        fontSize: '2.5rem',
        borderRadius: '25px',
        textAlign: 'left', 
        border: "1px solid cyan",
        color: 'cyan',
        background: 'transparent',
    };

    const iconStyle = {
        position: 'absolute',
        right: '0px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'cyan',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '2.0rem'
    };

    const focusStyle = {
        outline: 'none',
        borderColor: '#007BFF'
    };

    return (
        <>
            <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "45%", margin: "100px auto" }} role="document">
                    <div className="modal-content" style={{ background: "rgba(0, 0, 0, 0.8)", borderRadius: '10px', border: '2px solid cyan', overflowY: 'auto', maxHeight: '90vh' }}>
                        <div className="modal-body" style={{ padding: '20px' }}>
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <div style={inputWrapperStyle}>
                                <button style={iconStyle} onClick={() => {setIsEditable(!isEditable); setNickname("")}}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <input
                                    disabled={!isEditable}
                                    onChange={(event) => setNickname(event.target.value)}
                                    style={inputStyle}
                                    type="text"
                                    placeholder='How would you like to be called?'
                                    value={nickname}
                                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                                />
                            </div>

                            <h5 className="title">Customize your AI helper</h5>
                            <div style={{ height: '400px', marginTop: '20px' }}>
                                <ThreeDEditor modelUrl={figure} meshColors={meshColors} setMeshColors={setMeshColors} />
                            </div>

                            <div className="group-btn" style={{ textAlign: 'center', marginTop: '20px' }}>
                                <Link href="/profile" onClick={() => updateProfile(nickname, figure, meshColors)} className="tf-button" style={{ textDecoration: 'none' }}>
                                    <span>UPDATE</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModal && <div className="modal-backdrop fade show" onClick={handleModal} />}
        </>
    );
}
