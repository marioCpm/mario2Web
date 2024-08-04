'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import React, { useEffect, useRef, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import SocketClientAI2 from "./SocketClientAI2";

import LoaderModal from "@/components/elements/LoaderModal";
import SessionsSlider_Builder from "@/components/slider/SessionsSlider_Builder";
import { publishTempUnit, saveNewUnit, saveTempUnit } from "../services/content";
import StepsSlider from "@/components/slider/StepsSlider";
import ModifyModal from "@/components/elements/ModifyModal";
import useMiddleware from "../services/contextMiddleware";


export default withPageAuthRequired(function Builder() {
    const { initProfile, globalArguments } = useMiddleware();

    const [userPrompt1, setUserPrompt1] = useState("");
    const [userPrompt2, setUserPrompt2] = useState("");
    const [userPrompt3, setUserPrompt3] = useState("");
    const [unit, setUnit] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [finished, setFinished] = useState(false);
    const [sessionIndex, setSessionIndex] = useState(0);


    const [socketClient, setSocketClient] = useState(null)

    const [isTagModal, setIsTagModal] = useState(false)
    const [isLoaderModal, setIsLoaderModal] = useState(false)
    const [isModifyModal, setIsModifyModal] = useState(false)

    const handleLoaderModal = () => setIsLoaderModal(!isLoaderModal)
    const handleTagsModal = () => { setIsTagModal(!isTagModal) }
    const handleModifyModal = () => { setIsModifyModal(!isModifyModal) }

    const [filterItems, setFilterItems] = useState([])
    const [progressValue, setProgressValue] = useState(null)
    const [progressMax, setProgressMax] = useState(null)
    const [modifyPart, setModifyPart] = useState({})
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);



    useEffect(() => {
        if (modifyPart?.saved) {
            switch (modifyPart.type) {
                case "step":
                    // Create a new copy of sessions array
                    const newSessions = sessions.map((session, sIndex) => {
                        if (sIndex === modifyPart.sessionIndex) {
                            // Create a new copy of the steps array for the specific session
                            const newSteps = session.steps.map((step, stepIndex) => {
                                if (stepIndex === modifyPart.index) {
                                    // Replace the specific step
                                    return modifyPart.changedPart;
                                }
                                return step;
                            });
                            // Return the updated session with new steps
                            return { ...session, steps: newSteps };
                        }
                        return session;
                    });

                    // Update the sessions state with the new array
                    setSessions(newSessions);
                    break;
                case "session":
                    // Create a new copy of the sessions array with the updated session
                    const updatedSessions = sessions.map((session, sIndex) => {
                        if (sIndex == modifyPart.index) {
                            // Replace the session at the specific index with the modified session
                            return modifyPart.changedPart; // Assuming `modifyPart.session` is the updated session object
                        }
                        return session;
                    });

                    // Update the sessions state with the new array
                    setSessions(updatedSessions);
                    break;
                case "unit":
                    setUnit(modifyPart.changedPart);
                    break;
                    
            }
            setHasUnsavedChanges(true);  // Indicate modifications are confirmed and unsaved

        }
    }, [modifyPart]);


    useEffect(() => {
        const initializeData = async () => {
            await initProfile();
        };

        initializeData();
    }, [initProfile]);


    useEffect(() => {
        if (globalArguments?.editedUnit) {
            setUnit(globalArguments?.editedUnit)
            setSessions(globalArguments?.editedUnit?.sessions)
        }
    }, []);

    useEffect(() => {

        if (!socketClient) {

            let socket = new SocketClientAI2();
            socket.setOnUnitReady((data) => {
                setIsLoaderModal(current => {
                    if (current === true) {
                        return false;
                    }
                    return current;
                });
                setUnit(data);
                setHasUnsavedChanges(true);
            });

            socket.setOnSessionsReady((data) => {
                setIsLoaderModal(current => {
                    if (current === true) {
                        return false;
                    }
                    return current;
                });
                setSessions(data);
                setHasUnsavedChanges(true);
            });

            socket.setOnStepReady((data) => {
                console.log("another step completed")
                setProgressValue(current => {
                    return current + 1;
                });
                setHasUnsavedChanges(true);
            });
            socket.setOnAllStepsReady((data) => {
                setIsLoaderModal(current => {
                    if (current === true) {
                        return false;
                    }
                    return current;
                });
                setSessions(data);
                setFinished(true);
                setHasUnsavedChanges(true);
            });
            socket.setOnError((data) => {
                alert(data)
                setIsLoaderModal(current => {
                    if (current === true) {
                        return false;
                    }
                    return current;
                });
            });

            setSocketClient(socket)

        }
    }, [socketClient])


    function createUnit() {
        setIsLoaderModal(true);
        socketClient.GenerateUnit(filterItems, userPrompt1);
    }

    function createSessions() {
        setIsLoaderModal(true);
        socketClient.GenerateSessions(unit, userPrompt2);
    }

    function createSteps() {
        setIsLoaderModal(true);
        setProgressMax(sessions.length)
        setProgressValue(0.01)
        socketClient.GenerateSteps(unit, sessions, userPrompt3);
    }

    async function saveUnit() {
        setIsLoaderModal(true);
        await saveTempUnit(unit, sessions);
        setIsLoaderModal(false);
        setHasUnsavedChanges(false); // Reset the unsaved changes indicator

    }
    async function publishUnit() {
        setIsLoaderModal(true);
        await publishTempUnit(unit, sessions);
        setIsLoaderModal(false);
        setHasUnsavedChanges(false); // Reset the unsaved changes indicator

    }


    


    function ModifyStep(step, index) {
        setModifyPart({ changedPart:step, type: "step", index, sessionIndex, saved: false });
        handleModifyModal();
    }

    function ModifySession(session, index) {
        setModifyPart({ changedPart:session, type: "session", index, saved: false });
        handleModifyModal();
    }

    function ModifyUnit(unit) {
        setModifyPart({ changedPart:unit, type: "unit", saved: false });
        handleModifyModal();
    }
    const filtersChanged = (key, section_id, value) => {
        const exists = filterItems.some(item =>
            item.sid === section_id && item.id === key && item.topic === value
        );
        if (!exists) {
            // Add the item if it does not exist
            setFilterItems(prevItems => [
                ...prevItems,
                { sid: section_id, id: key, topic: value }
            ]);
        } else {
            // Remove the item if it exists
            setFilterItems(prevItems => prevItems.filter(item =>
                item.sid !== section_id || item.id !== key || item.topic !== value
            ));
        }
    };

    return (
        <>
            <Layout headerStyle={1} footerStyle={1} >
                <section className="tf-collection-inner">
                    <div className="tf-container">
                        <div className="row ">

                            <div className="col-lg-12 col-md-12 ">
                                <div>

                                    <div className="top-option">
                                        <h2 className="heading">GALENAI Builder</h2>

                                    </div>
                                    <br></br>
                                    <div className="top-option">
                                        <h4 className="heading">GENERATE UNIT SECTION</h4>

                                    </div>

                                </div>


                                <br></br>
                                {/* <h5 className="heading">Tags</h5>

                                <ul className="filter-content">
                                    {filterItems.map(item => (
                                        <>
                                            {item?.topic && <li key={item.topic}>
                                                <Link onClick={(event) => filtersChanged(item.id, item.sid, item.topic)} href="#">
                                                    {item.topic} <i className="fal fa-times" />
                                                </Link>
                                            </li>}

                                        </>

                                    ))}

                                    <li>
                                        <Link onClick={() => setFilterItems([{}])} href="#">CLEAR ALL</Link>
                                    </li>
                                    <li>
                                        <Link href="#" onClick={() => handleTagsModal()}>{"ADD TAGS"}</Link>
                                    </li>

                                </ul> */}
                                <h6 className="heading">Describe your unit</h6>
                                <textarea style={{ margin: "10px" }} type="text" value={userPrompt1} onChange={e => setUserPrompt1(e.target.value)} />


                                <ul style={{ margin: "10px" }} className="filter-content_builder">
                                    <li>
                                        <Link href="#" onClick={() => createUnit()}>{"GENERATE UNIT"}</Link>
                                    </li>
                                </ul>
                                {unit && <div

                                >
                                    <div style={{ height: "410px" }} className="tf-product" onDoubleClick={()=>ModifyUnit(unit)}>
                                        <div style={{ height: "300px" }}>
                                            <h6
                                                className={"scroll-text-disable"}
                                                style={{ color: "green" }}
                                            >
                                                {unit.topic}
                                            </h6>
                                            {unit.description}
                                            <br />
                                            {"Level: " + unit.level}
                                        </div>

                                        <div className="scroll-container">
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div style={{ textAlign: "left" }}>
                                                    <h6

                                                        className={"scroll-text-disable"}
                                                        style={{ color: unit.sessionsCount > 0 ? "green" : "white" }}
                                                    >
                                                        {unit?.topic?.length > 113 ? `${unit.topic.substring(0, 113)}...` : unit.topic}
                                                    </h6>
                                                    <div style={{ fontSize: "12px" }}>
                                                        {unit.unicode}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right", marginLeft: "10px" }}>
                                                    <div style={{ fontWeight: "bold", fontSize: "16px" }}>{unit.rank}4.6</div>
                                                    <div style={{ fontSize: "12px" }}>{unit.participations}1902 participations</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="heading">Further instructions for breakdown (optional)</h6>
                                    <textarea style={{ margin: "10px" }} type="text" value={userPrompt2} onChange={e => setUserPrompt2(e.target.value)} />

                                    <ul style={{ margin: "10px" }} className="filter-content_builder">
                                        <li>
                                            <Link href="#" onClick={() => createSessions()}>{"GENERATE SESSIONS"}</Link>
                                        </li>
                                    </ul>
                                </div>}

                                {sessions?.length > 0 && <><div className="tf-roadmap-style-thumb"><SessionsSlider_Builder ModifySession={ModifySession} sessions={sessions} setSessionIndex={setSessionIndex} /> </div>
                                    <h6 className="heading">Further instructions for breakdown (optional)</h6>
                                    <textarea style={{ margin: "10px" }} type="text" value={userPrompt3} onChange={e => setUserPrompt3(e.target.value)} />

                                    <ul style={{ margin: "10px" }} className="filter-content_builder">
                                        <li>
                                            <Link href="#" onClick={() => createSteps()}>{"GENERATE STEPS"}</Link>
                                        </li>
                                    </ul>
                                    <StepsSlider steps={sessions[sessionIndex].steps} ModifyStep={ModifyStep}></StepsSlider>

                                    <ul style={{ margin: "10px"}} className="filter-content_builder">
                                        <li >
                                            <Link href="#" onClick={() => saveUnit()} className={hasUnsavedChanges ? "" : "disabled-link"}>{"save temporary"}</Link>
                                        </li>
                                        <li >
                                            <Link href="#" onClick={() => publishUnit()} >{"publish"}</Link>
                                        </li>
                                    </ul>
                                </>}
                            </div>
                        </div>
                    </div>
                </section>
                {/* <ApproveModal isModal={isApproveModal} handleModal={handleApproveModal} message={modalTitle} submessage={modalSubTitle} /> */}
                <LoaderModal isModal={isLoaderModal} handleModal={handleLoaderModal} progressValue={progressValue} progressMax={progressMax} />
                {/* <TagsModal isModal={isTagModal} handleModal={handleTagsModal} filterItems={filterItems} filtersChanged={filtersChanged} /> */}
                <ModifyModal isModal={isModifyModal} handleModal={handleModifyModal} modifyPart={modifyPart} setModifyPart={setModifyPart}></ModifyModal>
            </Layout>
        </>
    )
});





