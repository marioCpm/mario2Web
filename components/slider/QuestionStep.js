
'use client'
import Link from "next/link"
import React, { useEffect, useState,useRef  } from 'react';
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import Editor from "@monaco-editor/react";



export default function QuestionStep({ setAllowContinue,continueClicked,step,done }) {

    let [data, setData] = useState(step);
    let [trialsRemaining, setTrialsRemaining] = useState(step.number_of_trials);
    const [isIncorrect, setIsIncorrect] = useState(false);
    let [selectedOption, setSelectedOption] = useState('');
    let [active, setActive] = useState(true);

    useEffect(() => {
        if (active){
            if(continueClicked>0){
             sendMessage();
            }
        }

        }, [continueClicked,active]);

    const sendMessage = () => {
        console.log("sending message")
        console.log(trialsRemaining)
        if (trialsRemaining > 0) {
          if (selectedOption === data.correct_answer) {
            done(JSON.stringify({question: data?.question, selectedOption,trialsRemaining}));
            setActive(false);
            setAllowContinue(true)
          } else {
            const newTrials = trialsRemaining - 1;
            setTrialsRemaining(newTrials);
            wrongAnswer();
            // If trials are now exhausted and the answer is still wrong, send the message
            if (newTrials == 0 || newTrials<0 ) {
                done(JSON.stringify({question: data?.question, selectedOption,trialsRemaining}));
                setActive(false);
                setAllowContinue(true)

                //alert('Failed to answer correctly. No more attempts allowed.');
            }
          }
        }
      };


    const wrongAnswer = () => {
        setIsIncorrect(true);
        setTimeout(() => setIsIncorrect(false), 1000); // Remove the class after 2 seconds
    };
    const handleOptionClick = (key) => {
        setSelectedOption(key);
      };
    return (
        <>

                                <center className={isIncorrect ? 'buzz-effect' : ''}> 
                                <div style={{maxWidth: "60%", opacity:"1"}} className="content-right">
                                <h3>{step.question}</h3>
                                <h6>{step?.text}</h6>
                                <br></br>

                                {Object.entries(data?.options || {}).map(([key, value]) => (
            <div onClick={() => handleOptionClick(key)} style={{borderRadius:'5px',borderStyle:"solid", borderWidth:"1px", borderColor: "cyan",cursor: "pointer" ,margin:"5px" ,boxShadow: "0 0 0 8px rgba(255, 255, 255, 0)" ,opacity:"0.9" ,color:"white" ,backgroundColor:selectedOption === key?"rgba(0,255,255,0.5)":"black" ,fontFamily:"consolas" ,fontWeight:"bold", maxW:'sm', p:'2'}}
             key={"key32_"+key}>
                {value}
            </div>
          ))}
          {trialsRemaining <= 1 && (
            <p>one last attempt! answer carefully..</p>
          )}
                                </div>
                                </center>
                                
            </>
    )
}
