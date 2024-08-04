'use client'
import { useState } from 'react';

export default function Accordion1({faq}) {
    const [isActive, setIsActive] = useState(1);  // Default active section

    // Toggle accordion sections open or closed
    const handleClick = (key) => {
        setIsActive(prevState => prevState === key ? null : key);  // Toggle current section or close if already open
    };

    return (
        <>
            <div className="tf-flat-accordion2">
            {faq?.map((f, index) => (
                <div key={"key41_"+index} className={`flat-toggle2 ${isActive === (index+1) ? "active" : ""}`}>
                <h6 className={`toggle-title ${isActive === (index+1) ? "active" : ""}`} onClick={() => handleClick(index+1)}>{f?.q}</h6>
                <div className="toggle-content" style={{ display: `${isActive === (index+1) ? "block" : "none"}` }}>
                    <p>{f?.a}</p>
                </div>
            </div>

            ))}


            </div>
        </>
    );
}
