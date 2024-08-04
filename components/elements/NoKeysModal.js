import React, { useEffect, useState } from 'react';
import useMiddleware from '@/app/services/contextMiddleware';
import Pricing1 from '../sections/Pricing1.js';



export default function NoKeysModal({ isModal, handleModal, upgrade }) {
    const { initHome , globalArguments} = useMiddleware();
    const [loading, setLoading] = useState(true); // Create a loading state

    useEffect(() => {
        const initializeData = async () => {
            await initHome();
        

            setLoading(false);
        };
        if (!globalArguments?.home) {
            initializeData();

        }
        else {
            setLoading(false);

        }

    }, [initHome]);

    return (
        <>
            <div style={{ background: "transparent" }} className={`modal fade popup ${isModal ? "show d-block" : ""}`}  tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" style={{  maxWidth: "110vh" }} role="document">
                    <div className="modal-content">
                        
                        <div style={{
        backgroundSize: 'cover', // Ensures the background image covers the div completely
        borderRadius: '10px', // Sets the border radius
        border: '2px solid cyan',zoom: "67%",
      }} className="modal-body">
        <div style={{ overflowY: "auto", maxHeight: "150vh",zoom: "100%",ackground:"rgba(0,0,0,0.8)"}}>
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>

                            <Pricing1 PlansData={globalArguments?.home?.PlansData} keys={false}/>
                            </div>
                            </div>
                    </div>
                </div>
            </div>
            {isModal && <div style={{    }} className="modal-backdrop fade show" onClick={handleModal} />}
        </>
    )
}



  