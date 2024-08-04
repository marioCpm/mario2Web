
import React, { useEffect, useState } from 'react';
import RateComponent from "./RateComponent";

export default function FeedbackModal({ isModal, handleModal, submitFeedback }) {
    const [feedbackText, setFeedbackText] = useState('');
    const [rating, setRating] = useState(-1);
    
    
    const handleFeedbackChange = (event) => {
        setFeedbackText(event.target.value);
      };
    
  const buttonStyles = {
    marginBottom: '20px', // Spacing between components
    WebkitAppRegion: 'no-drag',
  };
    const feedbackStyles = {
        marginBottom: '20px',
        width: '100%',  
        WebkitAppRegion: 'no-drag',
        color: "white",
        backgroundColor: "black",
        borderWidth:"1px", borderColor: "cyan",borderRadius: "5px",padding:"20px"
      };


    return (
        <>
            <div style={{background: "transparent"}} className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" style={{ maxHeight: "70vh", maxWidth: "90vh" }} role="document">
                    <div className="modal-content" >
                        <div className="modal-body ">
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <h2 className="title">{"Please share your thoughts to help us improve."}</h2>
                            <br></br>
                            <br></br>
                            <p className="sub-heading" style={{  maxWidth: "80vh" }}>          <textarea
            placeholder="Share your feedback here..."
            value={feedbackText}
            onChange={handleFeedbackChange}
            style={feedbackStyles}
          />
          </p>
          <label style={buttonStyles}>
              Rating:
              <RateComponent score={rating} setScore={setRating}></RateComponent>
            </label>
                            <div className="action-box-inner">

                            
                                <div className="group-btn">
                                    <div className="tf-button">
                                        <span onClick={()=>{ submitFeedback(rating,feedbackText); handleModal()}}>{"Share Feedback"}</span>
                                    </div>
                                </div>

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


