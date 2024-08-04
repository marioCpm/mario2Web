import Link from "next/link"
import Preloader from "./Preloader"
import React, { useEffect, useRef, useState } from 'react';
import SocketClientAI from "@/app/builder/SocketClientAI";

export default function NextModal({setAISteps ,setTreeData, isModal, handleModal,init_data}) {

    const [promptUpdated, setPromptUpdated] = useState("");
    const [promptSystemUpdated, setPromptSystemUpdated] = useState("");
    const [promptExtraUpdated, setPromptExtraUpdated] = useState("(optional)");

    const [prompt, setPrompt] = useState("");
    const [promptSystem, setPromptSystem] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalSubTitle, setModalSubTitle] = useState("");


    const [isWaiting, setIsWaiting] = useState(false);
    const [socketClient, setSocketClient] = useState(null)
    const [stepId, setStepId] = useState(1)
    const [breakdownResults, setBreakdownResults] = useState([])

    useEffect(() => {

        if (!socketClient && isModal) {

            let socket = new SocketClientAI();

            socket.setOnNextStep((data) => {
                setModalTitle("Step "+data.index)
                setModalSubTitle(data.step)
                setPromptSystem(data.system)
                setPrompt(data.prompt)
                setBreakdownResults([]);
            });

            socket.setOnStepResults((data) => {
                setBreakdownResults(data?.response);
                console.log(data?.response);
                setIsWaiting(false);
            });

            socket.setOnUnitFinished((data) => {
                console.log(data?.tree);
                console.log(data?.steps);

                console.log(JSON.stringify(data?.tree));
                console.log(JSON.stringify(data?.steps));
                setTreeData(data?.tree);
                setAISteps(data?.steps);
                handleModal();
            });
            
            setSocketClient(socket)
            socket.GenerateUnit(init_data.level, init_data.mainTask, init_data.personalSpecs, init_data.breakdownRange, init_data.timeForStep, init_data.estimatedMinutes,init_data.maxDepth,init_data.auto,init_data.name);

        }
        if (socketClient && !isModal){
            socketClient.Disconnect()
            setSocketClient(null);
        }
    }, [isModal,handleModal,init_data])



    useEffect(() => {

    }, [breakdownResults])

    useEffect(() => {
        setPromptUpdated(prompt);
        setPromptSystemUpdated(promptSystem);

    }, [prompt, promptSystem])

    function approveStep() {
        setIsWaiting(true);
        socketClient.ApproveStep(stepId, promptUpdated, promptSystemUpdated);
    }

    function interceptStep() {
        socketClient.InterceptStep(stepId, promptUpdated, promptSystemUpdated);
    }
    function continueStep() {
        socketClient.ContinueStep(stepId, promptUpdated, promptSystemUpdated);
    }
    
    
    return (
        <>
            <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body ">
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <h3>{modalTitle}</h3> 
                            <p className="sub-heading">{modalSubTitle}</p>
                            {isWaiting ? <Preloader /> : <>{breakdownResults.length > 0 ? <div> <div style={{ maxHeight: "400px", overflowY: "auto" }}>
  {breakdownResults.map(step => (
    <div>
      <div>{step.task} - {step.estimated_minutes}:00 Minutes. (estimated)</div>
      <br />
    </div>
  ))}
</div>

                                <h6 className="heading">Extra prompt</h6>
                                <textarea style={{ margin: "10px" }} type="text" value={promptExtraUpdated} onChange={e => setPromptExtraUpdated(e.target.value)} /></div> :
                                <div>
                                    <h6 className="heading">System prompt</h6>
                                    <textarea style={{ margin: "10px" }} type="text" value={promptSystemUpdated} onChange={e => setPromptSystemUpdated(e.target.value)} />
                                    <h6 className="heading">Prompt</h6>
                                    <textarea style={{ margin: "10px" }} type="text" value={promptUpdated} onChange={e => setPromptUpdated(e.target.value)} />
                                </div>}</>}
                            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            {breakdownResults.length > 0 &&
                                <div style={{ minWidth: "300px", margin: "10px", border: "1px solid red", borderRadius: "15px" }}>
                                    <Link href="#" onClick={() => interceptStep()}>{"Intercept"}</Link>
                                </div>
                            }
                                <div style={{ minWidth: "300px", margin: "10px", border: "1px solid var(--primary-color12)", borderRadius: "15px" }}>
                                    <Link href="#" onClick={breakdownResults.length > 0?  (() => continueStep()) : (() => approveStep())}>{breakdownResults.length > 0?"Continue":"Approve"}</Link>
                                </div>

                            </div>
                            {/* <div className="bottom">By connecting your wallet, you agree to our <Link href="#">Terms of Service</Link> and our <Link href="#">Privacy Policy.</Link></div> */}
                        </div>
                    </div>
                </div>
            </div>
            {isModal &&
                <div className="modal-backdrop fade show" onClick={handleModal} />
            }
        </>
    )
}
