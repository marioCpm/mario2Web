'use client'
import Layout from "@/components/layout/Layout"
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';   

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { saveNewReview, updateFeedbackOfUnit } from "../services/reviews";
import { useGlobalContext } from "../context/GlobalContext"
import { getUserProgress } from "../services/profile";
import Confetti from 'react-confetti'
import { useWindowSize } from "../helpers/windowSize";
import TrainingManager from "./TrainingManager";
import TrainingModal from "@/components/elements/TrainingModal";
import LiveSessionStepSlider from "@/components/slider/LiveSessionStepSlider";
import FeedbackModal from "@/components/elements/FeedbackModal";
import useMiddleware from "../services/contextMiddleware";
import FinishedModal from "@/components/elements/FinishedModal";
import Preloader from "@/components/elements/Preloader";

export default withPageAuthRequired(function LiveSession() {
    const { user, error, isLoading } = useUser();
    const { initProfile, initSession, updateNewReviewToUnitProgress, globalArguments,decreaseKey,addScore,getDynamicStyle,getFigure } = useMiddleware();
    const [isCompleted, setIsCompleted] = useState(false);
    const [trainingManager, setTrainingManager] = useState(null);
    const [isModal, setModal] = useState(false)
    const [isStepModal, setStepModal] = useState(false)
    const [isFeedbackModal, setFeedbackModal] = useState(false)
    const [isFinishedModal, setFinishedModal] = useState(false)
    const [score, setScore] = useState(-1)
    const [isReqRunning, setReqRunning] = useState(false)

    const [currentStep, setCurrentStep] = useState(null)

    const handleModal = () => setModal(!isModal)
    const handleFeedbackModal = () => setFeedbackModal(!isFeedbackModal)
    
    const isCompletedRef = useRef(isCompleted);
    const size = useWindowSize();

    // const [steps, setSteps] = useState([])
    const [session_id, setSession_id] = useState(-1)
    const [session_title, setSession_title] = useState("")
    const [session_description, setSession_description] = useState("")
    const [events, setEvents] = useState([]);
    const [startSocket, setStartedSocket] = useState(false);
    const ws = useRef(null);
    const router = useRouter();

    function displayInformer(informer) {
        events.push({ type: 'Task', message: informer, timestamp: "timestamp" });
        // AddStep({ type: 'Task', message: informer, timestamp: "timestamp" });
        setEvents([...events]);
    }
    function displayQuestion(question) {
        // AddStep({ type: 'Task', message: question, timestamp: "timestamp" });
        events.push({ type: 'Question', message: question, timestamp: "timestamp" });
        setEvents([...events]);
    }

    
    async function scenarioFinished(review,score) {
        setFinishedModal(true);
        setReqRunning(true);

        addScore(score);
        setScore(score);
        // console.log(`scenarioFinished`);
        // wsManager.SendMessage("ScnenarioFinished", 'well done finished!');
        // wsManager.SendMessage("SendReview", JSON.stringify(wsManager.reviewManager.getReview()));

        // windowManager.openWindow('feedback');
        //                     await saveNewReview(session_id,1,message)
        let unitProgress = globalArguments?.progress?.find(progress => progress.unit_id == globalArguments?.selectedUnit?.id);
        let totalSessions = globalArguments[`loadedSessions_${globalArguments?.selectedUnit?.id}`].length;
        let completedSessions = unitProgress?.completedSessions? unitProgress?.completedSessions: 0;

        await saveNewReview(session_id,1,review,globalArguments?.selectedUnit?.id,totalSessions,completedSessions,score,globalArguments?.selectedUnit?.topic)
     
        let completed = completedSessions+1==totalSessions;
        await updateNewReviewToUnitProgress();

        setIsCompleted(completed)
        setReqRunning(false);

    }

    useEffect(() => {
        isCompletedRef.current = isCompleted;
    }, [isCompleted]);

    useEffect(() => {
        if (!globalArguments?.selectedSession) {
            router.push(`/profile`);
        };
        
        const session_id = globalArguments?.selectedSession?.id;
        console.log('Session ID from query:', session_id);
        console.log(globalArguments?.selectedSession);

        setSession_title(globalArguments?.selectedSession?.SessionTitle);
        setSession_description(globalArguments?.selectedSession?.description);



        if (session_id) {
            const numericSessionId = parseInt(session_id, 10);
            console.log("Converted Session ID:", numericSessionId);
            setSession_id(numericSessionId);
        }
    }, [globalArguments?.selectedSession]);









    useEffect(() => {
        const initializeData = async () => {
            await initProfile();
        };

        initializeData();
    }, [initProfile]);

    useEffect(() => {
        if (session_id != -1) {
            let manager = new TrainingManager(displayInformer, displayQuestion, scenarioFinished);
            setTrainingManager(manager);
            async function InitSession() {
                let session = await initSession(session_id);
                let scenarioStructure = session?.data?.steps;

                if (!scenarioStructure){
                    router.push(`/profile`)
                }
                else{
                    decreaseKey();

                    manager.setData(scenarioStructure);
                    handleModal();
                }

            }
            InitSession();
        }
    }, [session_id]);

    const StartSessionBrowser = () => {
        trainingManager.StartSession();
    }

    const StartSessionAgent = () => {
        setStartedSocket(true)
    }

    
    const submitFeedback = async (rank,feedback) => {

        await updateFeedbackOfUnit(globalArguments?.profile?.userid,globalArguments?.selectedUnit?.id,rank*2,feedback)

    }
    
    const AddStep = (step) => {
        events.push(step);
    }
    const continueSession = () => {
        if (trainingManager.isAlive()){
            trainingManager.continueSession();
        }
        else{
            isCompletedRef.current ? router.push(`/profile`) : router.push(`/unit-details`); 
        }
    }

    const questionDone = (question) => {
        if (trainingManager.isAlive()){  
            trainingManager.questionDone(question);
            trainingManager.continueSession();
        }

    }
    
    const continueNextSession = () => {
        setFinishedModal(false);
        if (isCompleted){
            setFeedbackModal(true);

        }
        // else{
        //     router.push(`/unit-details`) 
        // }

    }

    useEffect(() => {
        if (startSocket) {
            function connectWebSocket() {
                const wsUrl = `ws://localhost:8080?`;
                console.log(`Attempting to connect WebSocket to ${wsUrl}`);
                ws.current = new WebSocket(wsUrl);

                ws.current.onopen = () => {
                    console.log("WebSocket connected");

                };

                ws.current.onmessage = async (event) => {
                    console.log("Message from server: ", event.data);
                    const { type, message, timestamp } = JSON.parse(event.data);
                   // ws.current.send(JSON.stringify({ type: "initSession", message: JSON.stringify(session) }));
                   let unitProgress = globalArguments?.progress?.find(progress => progress.unit_id == globalArguments?.selectedUnit?.id);

                    switch (type) {
                        case 'wellcome':
                            console.log(message);
                            let extraSessionDetails = {
                                title: globalArguments?.selectedSession?.sessionTitle,
                                description: globalArguments?.selectedSession?.description,
                                session_goals: globalArguments?.selectedSession?.features,
                                figure: globalArguments?.profile?.figure
                            }

                            const ud = {figure : getFigure(globalArguments?.profile?.figure),avatar:user?.picture}
                            ws.current.send(JSON.stringify({ type: "initSession", message: JSON.stringify({userDetails:ud,structure: trainingManager.getData(),sessionDetails:extraSessionDetails})}));
                            break;
                        case "informerStarted":
                            AddStep({ type: 'Task', message: message, timestamp: timestamp });
                            break;
                        // case 'Starting_session':
                        //     AddStep({ type: 'Starting session', message: message, timestamp: timestamp });
                        //     break;
                        // case 'QuestionDone':
                        //     AddStep({ type: 'Question', message: message, timestamp: timestamp });
                        //     break;
                        // case 'InformerDone':
                        //     AddStep({ type: 'Task', message: message, timestamp: timestamp });
                        //     break;
                        case 'SendReview':
                            setFinishedModal(true);
                            let score = trainingManager.CalculateScore(message)
                            console.log("score");
                            console.log(score);
                            setScore(score);
                            addScore(score)
                            let totalSessions = globalArguments[`loadedSessions_${globalArguments?.selectedUnit?.id}`].length;
                            let completedSessions = unitProgress?.completedSessions? unitProgress?.completedSessions: 0;
                            await saveNewReview(session_id, globalArguments?.profile?.userid,message,globalArguments?.selectedUnit?.id,totalSessions,completedSessions,score,globalArguments?.selectedUnit?.topic)
                         
                            let completed = completedSessions+1==totalSessions;
                            await updateNewReviewToUnitProgress();
                            setIsCompleted(completed)
                            if (completed){
                                setFinishedModal(false);
                                setFeedbackModal(true);
                            }
                            // else{                             
                            //     setTimeout(async () => {
                            //         setFinishedModal(false);
                            //         isCompletedRef.current ? router.push(`/profile`) : router.push(`/unit-details`);
                            //     }, 3000);
                            // }
                            break;
                        default:
                            //AddStep({ type, message, timestamp: timestamp });

                            console.log('Unknown message type received');
                    }
                    setEvents([...events]);
                    document.documentElement.style.setProperty('--liveSession-green', events.length * 241 + 'px');
                    console.log(events)
                };

                ws.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

                ws.current.onclose = (event) => {
                    console.log("WebSocket connection closed", event);
                    // Attempt to reconnect or handle the close appropriately
                };
            }

            connectWebSocket();

            return () => {
                ws.current?.close();
            };
        }
    }, [startSocket]);





    return (
        <>

            <Layout footerData={globalArguments?.home?.footerData} headerStyle={3} footerStyle={1} breadcrumbTitle={<div><h1>LIVE SESSION</h1><h4>{globalArguments?.selectedUnit?.topic+", part "+ (Number(globalArguments?.selectedSession?.unicode.split('.')[1]))}</h4></div>}>
                {isCompleted && <center>Congrats! Unit {globalArguments?.selectedUnit?.topic} done! <Confetti
                    width={size.width}
                    height={size.height}
                /></center>}
                  <br></br>
                    <br></br>
                <center>
                <div style={{maxWidth: getDynamicStyle(19)}} className="tf-roadmap-style-thumb">
                    {events.length>0? 
                     <LiveSessionStepSlider questionDone={questionDone} steps={events} continueSession={continueSession}></LiveSessionStepSlider>
                     :<>       
                      <div style={{
                        height: "333px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }} >
                        <Preloader loadingText="Loading session..."></Preloader>
                    </div>
                     </>}

                    </div> 
                    </center>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>


            </Layout>
            <TrainingModal isModal={isModal} handleModal={handleModal} StartSessionAgent={StartSessionAgent} StartSessionBrowser={StartSessionBrowser} description={session_description} title={session_title} />
            <FeedbackModal isModal={isFeedbackModal} handleModal={handleFeedbackModal} submitFeedback={submitFeedback}/>
            <FinishedModal isModal={isFinishedModal} score={score} continueNextSession={continueNextSession} isReqRunning={isReqRunning}/>
            
        </>
    )
})