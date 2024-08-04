import Link from "next/link"
import Preloader from "./Preloader"
import React, { useEffect, useRef, useState } from 'react';

import useMiddleware from "@/app/services/contextMiddleware";

export default function TagsModal({  isModal, handleModal ,filterItems,filtersChanged}) {
    const { globalArguments,initFilters } = useMiddleware();

    const [searchTagPattern, setSearchTagPattern] = useState("")
    const [isActive, setIsActive] = useState([1])

    useEffect(() => {
        const initializeData = async () => {
            await initFilters();
        };

        initializeData();
    }, [ initFilters]);


    const filteredTags = globalArguments?.filters?.map(filter => ({
        ...filter,
        items: Object.fromEntries(
            Object.entries(filter.items).filter(([key, value]) =>
                value.toLowerCase().includes(searchTagPattern.toLowerCase())
            )
        )
    })).filter(filter => Object.keys(filter.items).length > 0);


    const isChecked = (key, section_id, value) => {
        const exists = filterItems.some(item =>
            item.sid === section_id && item.id === key && item.topic === value
        );

        return exists;
    };


    const handleClick = (index) => {
        // setIsActive((prevIndex) => (prevIndex.includes(i)ndex ? null : index))
        setIsActive(prevIndexes => {
            if (prevIndexes.includes(index)) {
                return prevIndexes.filter(item => item !== index);
            } else {
                return [...prevIndexes, index];
            }
        });
    }

    return (
        <>
            <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body ">
                        <h2 className="title">{"TAGS"}</h2>
                        <div className="widget widget-search">
                                        <form action="#">
                                            <input onChange={(event) => setSearchTagPattern(event.target.value)} type="text" placeholder="Search Tags" required />
                                            <Link className="btn-search" href="#"><i className="icon-fl-search-filled" /></Link>
                                        </form>
                                    </div>
                                    {filteredTags?.map(section => (
                                        <div key={"key15_"+section.id} className="widget widget-accordion">
                                            <h6 className={isActive.includes(section.id) ? "widget-title active" : "widget-title"} onClick={() => handleClick(section.id)}>
                                                {section.title}
                                            </h6>
                                            <div className="widget-content" style={{ display: `${isActive.includes(section.id) ? "block" : "none"}` }}>
                                                <form action="#" className="form-checkbox">
                                                    {Object.entries(section.items).map(([key, value]) => (
                                                        <>
                                                            {value && <label key={"key16_"+key} className="checkbox-item">
                                                                <span className="custom-checkbox">
                                                                    <input
                                                                        checked={isChecked(key, section.id, value)}
                                                                        type="checkbox"
                                                                        id={`checkbox-${key}`}
                                                                        onChange={(event) => filtersChanged(key, section.id, value)}  // Add the onChange handler
                                                                    />
                                                                    <span className="btn-checkbox" />
                                                                </span>
                                                                <span>{value}</span>
                                                            </label>}

                                                        </>

                                                    ))}
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={handleModal}> Confirm </button>
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
