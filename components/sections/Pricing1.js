'use client';


import PopupCheckout from "@/app/services/PopupCheckout";
import useMiddleware from "@/app/services/contextMiddleware";
import Link from "next/link"
import React, { useState } from 'react';
import ToggleButton from "./ToggleButton";
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';


export default function Pricing1({ PlansData, keys = false }) {
    let commingSoon = false;
    const { user, error, isLoading } = useUser();

    const [showPopup, setShowPopup] = useState(false);
    const [productId, setProductId] = useState(-1);
    const [yearly, setYearly] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [isCoupon, setIsCoupon] = useState(false);

    const { globalArguments } = useMiddleware();
    const handleSelectionChange = (side) => {
        setYearly(!yearly);
    };

    const router = useRouter();

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const PlanClicked = (plan) => {
        if (!globalArguments?.profile?.plan_type) {
            router.push(`/api/auth/login?returnTo=/profile`);
        }
        switch (plan.toLowerCase()) {
            case "free":
                router.push(`/api/auth/login?returnTo=/profile`);
                break;
            case "basic":
                setProductId(yearly? 92851:93881)
                setShowPopup(!showPopup);
                break;
            case "pro":
                if (yearly){
                    setIsCoupon(true)
                    setCoupon("pro40")
                }
                setProductId(yearly? 93879:93880)
                setShowPopup(!showPopup);

                break;
        }
    };
    const isCurrentPlan = (plan) => {
        return globalArguments?.profile?.plan_type?.toLowerCase() == plan.toLowerCase();
    }
    const getButtonStyle = (plan) => {

        let button_promote = "tf-button style-1";
        let button_clickable = "tf-button style-2";
        let button_unavailable = "tf-button style-3";

        let userplan = globalArguments?.profile?.plan_type?.toLowerCase();
        let buttonPlan = plan.toLowerCase();

        switch (userplan){
            case "free":
                switch (buttonPlan){
                    case "free":
                        return button_unavailable;
                    case "basic":
                        return button_clickable;
                    case "pro":
                        return button_promote;
                }
                return button_unavailable;
            case "basic":
                switch (buttonPlan){
                    case "free":
                        return button_unavailable;
                    case "basic":
                        return button_unavailable;
                    case "pro":
                        return button_promote;
                }
                return button_unavailable;
            case "pro":
                switch (buttonPlan){
                    case "free":
                        return button_unavailable;
                    case "basic":
                        return button_unavailable;
                    case "pro":
                        return button_unavailable;
                }
                return button_unavailable;
        }

       return button_unavailable;
    }


    const yourPlan = (
        <span style={{
            position: 'absolute',
            top: '10%',
            left: '30%',
            zoom: "70%",
            transform: 'translate(-80%, -80%) rotate(-15deg)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'cyan',
            padding: '10px 40px 10px 40px',
            fontSize: '2.2em',
            borderRadius: '15px',
            border: '1px solid cyan'
        }}>
            YOUR PLAN
        </span>)

const discount = (
    <span style={{
        position: 'absolute',
        top: '60%',
        left: '60%',
        zoom: "40%",
        transform: 'rotate(15deg)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'orange',
        padding: '10px',
        fontSize: '3.2em',
        borderRadius: '15px',
        border: '1px solid cyan'
    }}>
       40% DISCOUNT! First Year only 59$
    </span>)
    return (
        <>

            <section style={{ marginTop: "0px" }} className="tf-section tf-about">
                <div className="tf-container">
                    <div className="row ">
                        <div className="col-md-12 ">
                            <div className="tf-heading fadeInUp">
                                <h2 className="heading">Explore our plans</h2></div>

                        </div>
                        <div className="col-md-12 ">
                            <div style={{ padding: "50px" }} className="tf-heading fadeInUp">
                                <ToggleButton
                                    side={yearly ?   "left":"right"}
                                    leftText="Yearly"
                                    leftSubText="Save 20%"
                                    rightText="Monthly"
                                    selected={handleSelectionChange}
                                /></div>

                        </div>
                        {PlansData?.plans?.map((plan, index) => (
                            <div key={"key46_"+index}  className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                                <div className="tf-step fadeInUp" data-wow-delay="0.2s">
                                    <div className="step-title">
                                        <div className="sub-number">
                                            {plan?.topic}
                                        </div>
                                        <br></br>

                                        <h6>{plan?.description}</h6>

                                        <h3><br></br></h3>
                                        {!yearly ? <div style={{ width: "30%", marginLeft: "100px" }} className="row"><h3 style={{ color: "cyan" }}>${plan?.price_m} </h3><div>&nbsp; /month</div></div> : <div style={{ width: "30%", marginLeft: "100px" }} className="row"><h3 style={{ color: "cyan" }}>${plan?.price_y} </h3><div>&nbsp; /year</div></div>}

                                        {!yearly ?
                                            <div style={{ marginLeft: "130px" }}>{"$" + Math.ceil(100 * (parseFloat(plan?.price_m) / 30)) / 100 + " / day"}</div>
                                            : <div style={{ marginLeft: "130px" }}>{"$" + Math.ceil(100 * (parseFloat(plan?.price_y) / 365)) / 100 + " / day"}</div>}

                                    </div>
                                    <ul className="list-bullets">
                                        {plan?.points?.map((point, index) => (
                                            <li key={"key27_"+index}> - {point}</li>
                                        ))}
                                    </ul>
                                    <br></br>
                                    <div className="btn-slider ">
                                    {!commingSoon ?
                                        <div onClick={() => { (getButtonStyle(plan?.topic)!="tf-button style-3")&& PlanClicked(plan?.topic) }} style={{ fontSize: "20px" }} className={getButtonStyle(plan?.topic)}>{plan.buttonTxt}</div>
                                        :  <div style={{ fontSize: "20px" }} className={getButtonStyle(plan?.topic)}>{"Comming soon..."}</div>
                                }
                                    </div>
                                </div>
                                {isCurrentPlan(plan?.topic) && yourPlan}
                                {plan?.topic.toLowerCase()=='pro' && yearly && discount}
                            </div>
                        ))}

                        {keys &&
                            <>
                                <div className="col-md-12 ">
                                    <div className="tf-heading fadeInUp">
                                        <h2 className="heading">Or simply buy keys</h2></div>

                                </div>
                                {PlansData?.kzeys?.map((keyPlan, index) => (

                                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
                                        <div className="tf-step fadeInUp" data-wow-delay="0.2s">
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "260px", boxSizing: "border-box", margin: "0 auto" }}>
                                                <h3>{keyPlan.keys + " keys"}</h3>

                                                <img src={'/assets/images/keys/' + keyPlan.keys + 'keys.png'} alt="Milestone Image" style={{ maxWidth: "70%", maxHeight: "70%", marginBottom: "10px" }} />
                                                <div style={{ textAlign: "center" }}>
                                                    <div style={{}}>{"$" + Math.ceil(1000 * (parseFloat(keyPlan?.price) / parseFloat(keyPlan?.keys))) / 1000 + " / key"}</div>
                                                    <br></br>
                                                    <br></br>

                                                </div>
                                            </div>
                                            <div onClick={togglePopup} className="btn-slider ">
                                                <div href="#" style={{ fontSize: "30px" }} className="tf-button style-2">{keyPlan.price}$</div>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </>}
                    </div>
                </div>
                <PopupCheckout
                    productId={productId}
                    templateId="67890"
                    isVisible={showPopup}
                    hideCheckout={togglePopup}
                    authID={user?.sub}
                    isCoupon={isCoupon}
                    coupon={coupon}
                    
                />
            </section>
        </>
    )
}
