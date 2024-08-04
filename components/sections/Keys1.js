import PopupCheckout from "@/app/services/PopupCheckout";
import Link from "next/link"
import React, { useState } from 'react';


export default function Keys1() {
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    return (
        <>
            <section style={{ marginTop: "0px" }} className="tf-section tf-about">
                <div className="tf-container">
                    <div className="row ">
                        <div className="col-md-12 ">
                            <div className="tf-heading wow fadeInUp">
                                <h2 className="heading">OR BUY KEYS</h2>
                            </div>
                        </div>



                    </div>
                </div>
   
                <PopupCheckout
                    productId="12345"
                    templateId="67890"
                    isVisible={showPopup}
                    hideCheckout={togglePopup}
                />
            </section>
        </>
    )
}
