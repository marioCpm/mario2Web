import Preloader from "./Preloader"
import ProgressBar2 from "./ProgressBar"
import React, { useEffect, useRef, useState } from 'react';

export default function ModifyModal( {isModal, handleModal,modifyPart,setModifyPart}) {
    const [formData, setFormData] = useState(modifyPart?.step);
    
    
    useEffect(() => {

    }, [formData]);   

    useEffect(() => {
        setFormData(modifyPart?.changedPart)
    }, [modifyPart]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedModifyPart = {
            ...modifyPart,
            changedPart: formData,
            saved: true
        };
        setModifyPart(updatedModifyPart);
        handleModal();

        // Process the formData as needed, e.g., send to an API
      };

      const handleChange = (key, value, index = -1) => {
        setFormData(prev => {
            // If the index is -1, it's not an array item
            if (index === -1) {
                return { ...prev, [key]: value };
            }
            // Otherwise, update the specific index in the array
            const updatedArray = [...prev[key]];
            updatedArray[index] = value;
            return { ...prev, [key]: updatedArray };
        });
    };


    return (
        <>
            <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body ">
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <div style={{
    display: 'flex',       // Enables flexbox
    justifyContent: 'center', // Centers horizontally
    alignItems: 'center',     // Centers vertically
    height: '700px',          // An explicit height for the container
    width: '100%',            // Use the full width available in the parent
    maxWidth: "480px",        // Maximum width as specified
    margin: 'auto',           // Helps in centering the maxWidth element in its parent
}}>
{formData &&
    <form onSubmit={handleSubmit}  className="scrollable-form">
        {Object.entries(formData).map(([key, value]) => {
            // Check if it's an array of non-objects (e.g., strings)
            if (Array.isArray(value) && (!value.length || typeof value[0] !== 'object')) {
                // Render a separate input for each element in the array
                return value.map((item, index) => (
                    <div key={`key13_${key}-${index}`}>
                        <label>{key} {index + 1}</label>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleChange(key, e.target.value, index)}
                            className="form-control"
                        />
                    </div>
                ));
            } else if (!Array.isArray(value)) {
                // Render a textarea for non-array and non-object values
                return (
                    <div key={"key14_"+key}>
                        <label>{key}</label>
                        <textarea
                            value={value}
                            onChange={(e) => handleChange(key, e.target.value)}
                            rows="3"
                            className="form-control"
                        />
                    </div>
                );
            }
            // Skip rendering for arrays of objects
            return null;
        })}
        <button type="submit" className="btn btn-primary">Confirm</button>
    </form>
}

</div>

                            {/* <div className="bottom">By connecting your wallet, you agree to our <Link href="#">Terms of Service</Link> and our <Link href="#">Privacy Policy.</Link></div> */}
                        </div>
                    </div>
                </div>
            </div>
            {isModal &&
                <div className="modal-backdrop fade show" onClick={handleModal}/>
            }
        </>
    )
}
