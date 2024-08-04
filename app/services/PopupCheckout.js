import React from 'react';

const PopupCheckout = ({ productId, templateId, isVisible, hideCheckout ,authID,isCoupon,coupon}) => {
    // const checkoutUrl = `https://store.payproglobal.com/checkout?products[1][id]=93025&page-template=18435&use-test-mode=true&secret-key=CGpCfOvbJ_&exfo=742&x-authID=${authID}`;

    // https://store.payproglobal.com/checkout?products[1][id]=93879&coupon-code-to-add=pro40&page%20template=18435
    const checkoutUrl = `https://store.payproglobal.com/checkout?products[1][id]=${productId}&${isCoupon && `coupon-code-to-add=${coupon}&`}page-template=18435&exfo=742&x-authID=${authID}`;
    return (
        isVisible && (
            <div className="ppg-checkout-modal ppg-show" id="ppg-checkout-modal">

                <div className="ppg-btn-close" id="ppg-btn-close" onClick={hideCheckout}>
                <i className="fal fa-times" />
                </div>

                <div className="ppg-loader">  
                </div>
               <iframe
                    className="ppg-iframe"
                    src={checkoutUrl}
                    frameBorder="0"
                    onLoad={() => document.querySelector('.ppg-loader').remove()}
                ></iframe> 
                       <div style={{fontSize:"50px", color:"white"}}>{coupon}</div>   
            </div>
        )
    );
};

export default PopupCheckout;
