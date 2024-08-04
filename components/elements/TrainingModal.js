import Link from "next/link"
import Preloader from "./Preloader"
import React, { useEffect, useState } from 'react';
import useMiddleware from "@/app/services/contextMiddleware";
import { FaPlay } from "react-icons/fa";

export default function TrainingModal({ isModal, handleModal, title, description, StartSessionAgent, StartSessionBrowser }) {
    const { getDynamicStyle } = useMiddleware();

    const [downloadUrl, setDownloadUrl] = useState(null);
    const [download, setDownload] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [downloadMessage, setDownloadMessage] = useState(false)
    
    useEffect(() => {
        const getLatestRelease = async () => {
            const response = await fetch('https://api.github.com/repos/galenaiai/galenai_agent/releases/latest');
            const release = await response.json();
            const downloadUrl = release.assets[0].browser_download_url;
            setDownloadUrl(downloadUrl);
        };

        getLatestRelease();
    }, []);

    useEffect(() => {
        if (download){
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = '';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

    }, [download,downloadUrl]);
    const StartTraining = async () => {
        let agentDefault = getDynamicStyle(16);
        if (agentDefault){
            StartAgent();  
        }
        else{
            StartSessionNoAgent();
        }
    }

    const StartAgent = async () => {
        setIsLoading(true);
        const appUrl = `galenai.agent.app://openWindow`;
        // Function to open the app
        window.open(appUrl);
        // Wait for the app to launch and then check status
        setTimeout(async () => {
            const isRunning = await checkAppStatus();
            console.log(isRunning)
            if (!isRunning) {
                promptInstallation();
                const checkInterval = setInterval(async () => {
                    let isAvailable = await checkWebSocketServerAvailability(8080);
                    if (isAvailable) {
                        clearInterval(checkInterval); // Clear the interval when the condition is met
                        setTimeout(async () => {
                            StartSessionAgent();
                            handleModal();
                        }, 2000);
                    }
                }, 2000);
            }
            else {
                StartSessionAgent();
                handleModal();
            }
        }, 2000); // Delay increased to give the app sufficient time to start
    };

    const StartSessionNoAgent = async () => {
        setIsLoading(true);

        setTimeout(async () => {
            StartSessionBrowser();
            handleModal();
        }, 2000); // Delay increased to give the app sufficient time to start
    };

    const promptInstallation = () => {
        setDownloadMessage("downloading agent")
        setDownload(true);
    };

    const checkAppStatus = async () => {
        try {
            const isAvailable = await checkWebSocketServerAvailability(8080);
            if (isAvailable) {
                console.log("App status: Server is running.");
                return true;
            } else {
                console.log("App status: Server is not running.");
                return false;
            }
        } catch (error) {
            console.error('Error checking app status:', error);
            return false;
        }
    };

    const checkWebSocketServerAvailability = (port) => {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket("ws://localhost:" + port);

            // Successfully established a connection
            ws.onopen = () => {
                console.log("WebSocket server is available.");
                ws.close(); // Close the connection immediately after confirming it's open
                resolve(true);
            };

            // Error handling
            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                reject(new Error("WebSocket server is not available."));
            };

            // Optional: Handle close if you want specific logic for when the server is not available
            ws.onclose = (event) => {
                if (event.wasClean === false) { // Check if the WebSocket closed unexpectedly
                    console.log("WebSocket closed unexpectedly.");
                    reject(new Error("WebSocket server is not available."));
                }
            };
        });
    };

    return (
        <>
            <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" style={{ maxHeight: "70vh", maxWidth: getDynamicStyle(15) }} role="document">
                    <div className="modal-content" style={{ overflowY: "auto", maxHeight: "150vh" }}>
                        <div className="modal-body ">
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <h3 className="title">{title}</h3>
                            <p className="sub-heading" style={{ maxWidth: "100%", maxHeight: "200px", overflowY: "auto" }}>{description}</p>
                            <div className="action-box-inner">
                                {isLoading &&
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '200px',
                                            width: '100%',
                                            maxWidth: "180px",
                                            margin: 'auto',
                                        }}>
                                            <Preloader />
                                        </div>
                                        {downloadMessage}
                                    </div>
                                }
                                <br></br>
                                {!isLoading && 
                                    <>
                                        <div className="group-btn">
                                            <span onClick={StartTraining} style={{
                                                    position: 'fixed',
                                                    bottom: getDynamicStyle(17),
                                                    right: getDynamicStyle(18),
                                                    backgroundColor: '#000',
                                                    color: 'cyan',
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                    border: "2px dashed cyan",
                                                    borderStyle: "dashed",
                                                }}>
                                                   <FaPlay size="40" style={{margin:"12px 10px 6px 14px"}}/>

                                                </span>
                                        </div>{getDynamicStyle(16) &&<p onClick={StartSessionNoAgent} className="content">or Continue using your browser</p>}
                                        
                                    </>
                                }
                            </div>
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
