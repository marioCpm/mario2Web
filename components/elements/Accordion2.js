'use client'
import { useState } from 'react'
export default function Accordion2({faq}) {
    const [isActive, setIsActive] = useState(1)

    const handleClick = (key) => {
        setIsActive(prevState => prevState === key ? null : key)
    }
    return (
        <>
            <div className="tf-flat-accordion2">
            {faq?.map((f, index) => (
                <div key={"key40_"+index} className={`flat-toggle2 ${isActive === (index+1) ? "active" : ""}`}>
                <h6 className={`toggle-title ${isActive === (index+1) ? "active" : ""}`} onClick={() => handleClick(index+1)}>{f?.q}</h6>
                <div className="toggle-content" style={{ display: `${isActive === (index+1) ? "block" : "none"}` }}>
                    <p>{f?.a}</p>
                </div>
            </div>

            ))}



            </div>
        </>
    )
}
