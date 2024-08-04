'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import React, { useEffect, useRef, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { getMoreUnitsByFilters, getUnitsByFilters } from "../services/content";
import UnitCard from "@/components/elements/UnitCard";
import useMiddleware from "../services/contextMiddleware";
import Preloader from "@/components/elements/Preloader";
import ImageChecker from "@/components/elements/ImageChecker";
import { FaSortAmountUp } from "react-icons/fa";
import { FaSortAmountDownAlt } from "react-icons/fa";



export default withPageAuthRequired(function Explore() {
    const { initProfile, initFilters, updateUnitWithProgress, enhanceUnitsWithImages, getStack, globalArguments, updateGlobalArguments, getDynamicStyle } = useMiddleware();
    const levels = {
        1: "Novice",
        2: "Basic",
        3: "Intermediate",
        4: "Advanced",
        5: "Specialist",
        6: "Professional"
    };
    const [isActive, setIsActive] = useState([])
    const [unitsAndFilters, setUnitsAndFilters] = useState({})
    const [units, setUnits] = useState([])
    const [filterItems, setFilterItems] = useState([])
    const [unitHoverID, setUnitHoverID] = useState(-1)
    const [searchPattern, setSearchPattern] = useState("")
    const [searchTagPattern, setSearchTagPattern] = useState("")
    const [isOpen, setIsOpen] = useState(false);

    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [sorting, setSorting] = useState(false);
    const [searching, setSearching] = useState(false);

    // useEffect(() => {
    //     if (globalArguments?.displayedUnits) {
    //         setUnits(enhanceUnitsWithImages(globalArguments.displayedUnits));

    //     }
    // }, [globalArguments?.displayedUnits]);

    useEffect(() => {
        searchUnits();

    }, [filterItems]);

    useEffect(() => {
        const initializeData = async () => {
            await initProfile();
            await initFilters();
        };
        if (!globalArguments?.profile || !globalArguments?.filters){
            initializeData();
        }
        
    }, [initProfile, initFilters]);

    useEffect(() => {
        let style = getDynamicStyle(11)
        if (style){
            setIsActive(style);       
        }
    }, [globalArguments?.deviceType]);

    const getSortTopic = (field) => {
       switch(field){
        case 'participated': return 'Participants';
        case 'ranking': return 'Rank';
        case 'topic': return 'Name';
        case 'level': return 'Level';
        case 'id': return 'Id';
       }
    };
     const handleSort = (field) => {
        if (!field) {setIsOpen(true); return};
        setIsOpen(false)
        setSorting(true); // Start loading

        // Toggle sort order if the same field is clicked again, else reset to ascending
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);

        // Sort the units array with a slight delay to simulate processing time
        setTimeout(() => {
            setUnits(prevUnits => {
                return [...prevUnits].sort((a, b) => {
                    const valueA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
                    const valueB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];

                    if (order === 'asc') {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0);
                    } else {
                        return valueA < valueB ? 1 : (valueA > valueB ? -1 : 0);
                    }
                });
            });
            setSorting(false); // Stop loading after sorting
        }, 500); // Added delay to visibly notice the loader, adjust as needed
     };

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
    const isChecked = (key, section_id, value) => {
        const exists = filterItems.some(item =>
            item.sid === section_id && item.id === key && item.topic === value
        );

        return exists;
    };



    const filteredUnits = units?.filter(unit => {
        const pattern = searchPattern.toLowerCase();
        return (
            unit?.topic?.toLowerCase().includes(pattern) ||
            unit?.unicode?.toLowerCase().includes(pattern)
        );
    });

    const filteredTags = globalArguments?.filters ? globalArguments?.filters?.map(filter => ({
            ...filter,
            items: filter.items.filter(item =>
                item.title.toLowerCase().includes(searchTagPattern.toLowerCase())
            )
        }))
        .filter(filter => filter.items.length > 0)
        .sort((a, b) => a.title.toLowerCase() === 'level' ? -1 : b.title.toLowerCase() === 'level' ? 1 : 0)
        : [];


    const searchUnits = async () => {
        setSearching(true);
        setUnits([]);
        let units = await getUnitsByFilters(filterItems);
        setUnits(enhanceUnitsWithImages(units));
        updateGlobalArguments({ displayedPage: 2 });
        updateGlobalArguments({ displayedUnits: units });
        setSearching(false);
    }

    const addUnits = async () => {
        setSearching(true);

        let units_withMore = await getMoreUnitsByFilters(filterItems, globalArguments?.displayedPage, units);
        setUnits(enhanceUnitsWithImages(units_withMore));
        updateGlobalArguments({ displayedPage: globalArguments?.displayedPage + 1 });
        updateGlobalArguments({ displayedUnits: units_withMore });
        setSearching(false);

    }

    const dropdownStyles = {
        position: 'absolute',
        top: '30px',
        right: '0',
        backgroundColor: 'black',
        color: 'white',
        border: '1px solid cyan',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        listStyle: 'none',
        padding: '10px 0',
        margin: '0',
        zIndex: '1000',
    };
    
    const dropdownItemStyles = {
        padding: '10px 20px',
        cursor: 'pointer',
        hover: {
            backgroundColor: '#f5f5f5',
        },
    };



    const CheckCompletion = (id) => {

        return globalArguments?.completedUnits?.some(obj => obj.unit_id == id);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
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
    const checkedStyle = {
        backgroundColor: "rgba(0,0,0,0.4)",
        border: '2px dashed cyan',
        opacity: '1',
        borderWidth: "1px", borderColor: "cyan", borderRadius: "10px", padding: "5px"
    };

    return (
        <>
            <Layout headerStyle={3} footerStyle={1} >
                <section className="tf-collection-inner">

                    <div className="tf-container">
                        <div className="row ">
                            <div className="col-lg-3 col-md-3">
                                <div className="sidebar sidebar-collection">
                                    <div className="widget widget-search">
                                        <form action="#">
                                            <input onChange={(event) => setSearchTagPattern(event.target.value)} type="text" placeholder="Search Tags" required />
                                            <Link className="btn-search" href="#"><i className="icon-fl-search-filled" /></Link>
                                        </form>
                                    </div>
                                    {!globalArguments?.filters && <div className="widget widget-accordion" style={{
                                        marginTop: "50px",
                                        height: "200px",
                                        backgroundColor: "black" // Optional: to cover the background
                                    }} >
                                        <Preloader />
                                    </div>}
                                    {filteredTags?.map(section => (
                                        <div key={"sec_" + section.id} className="widget widget-accordion">
                                            <h6 className={isActive.includes(section.id) ? "widget-title active" : "widget-title"} onClick={() => handleClick(section.id)}>
                                                {section.title}
                                            </h6>
                                            <div className="widget-content" style={{ display: `${isActive.includes(section.id) ? "block" : "none"}` }}>
                                                <div className="checkbox-container">
                                                    {section?.items.map((item, index) => (
                                                        <>
                                                            {item?.title && <label style={isChecked(item?.id, section.id, item?.title) ? checkedStyle : {}} key={"sec_" + section.id + "_" + item?.id} className={"checkbox-item"}>
                                                                <span className="custom-checkbox">
                                                                    <input
                                                                        checked={isChecked(item?.id, section.id, item?.title)}
                                                                        type="checkbox"
                                                                        id={`checkbox-${item?.id}`}
                                                                        onChange={(event) => filtersChanged(item?.id, section.id, item?.title)}

                                                                    />
                                                                </span>
                                                                <div style={{ textAlign: "center" }}>
                                                                    <ImageChecker
                                                                        className="checkbox-content"
                                                                        src={item?.icon ? item?.icon : "/assets/images/milestones/milestone1.png"}
                                                                        alt={item?.title}
                                                                        style={{ height: "80px", display: "block", margin: "0 auto" }}
                                                                    />
                                                                    <span style={{ display: "block", marginTop: "8px" }}>{item?.title}</span>
                                                                </div>

                                                            </label>}

                                                        </>

                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-9 ">

                                <div className="top-option" style={{ margin: "20px" }}>
                                    <h2 className="heading">All Units</h2>
                                    <div className="widget widget-search">
                                        <form action="#">
                                            <input onChange={(event) => setSearchPattern(event.target.value)} type="text" placeholder="Search Unit" required />
                                            <Link className="btn-search" href="#"><i className="icon-fl-search-filled" /></Link>
                                        </form>
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: "20px", background:"rgba(60,60,60,0.5)"  }}>

                                    <div className="col-9 col-md-9 " style={{  }}>
                                    <ul className="filter-content">

                                        {filterItems.map(item => (
                                            <>
                                                {item?.topic && <li style={{margin:"15px"}} key={"flcnt-" + item.topic}>
                                                    <Link onClick={(event) => filtersChanged(item.id, item.sid, item.topic)} href="#">
                                                        {item.topic} <i className="fal fa-times" />
                                                    </Link>
                                                </li>}

                                            </>

                                        ))}
                
                                </ul>

                                    </div>
                                    <div className="col-sm-3 col-md-3" style={{ color:"cyan",display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                      <div onClick={toggleDropdown} >{getSortTopic(sortField)} </div> 
<div onClick={()=>{handleSort(sortField)}} style={{ margin: "15px" }}>
{sorting ? <div className="spinner"></div> : (sortOrder === 'asc' ?  <FaSortAmountUp size="25" /> : <FaSortAmountDownAlt size="25" />)}

       

</div>
                                        {isOpen && (
                    <ul style={dropdownStyles}>
                        <li style={dropdownItemStyles} onClick={() => handleSort('participated')}>Participants</li>
                        <li style={dropdownItemStyles} onClick={() => handleSort('ranking')}>Rank</li>
                        <li style={dropdownItemStyles} onClick={() => handleSort('topic')}>Name</li>
                        <li style={dropdownItemStyles} onClick={() => handleSort('level')}>Level</li>
                        <li style={dropdownItemStyles} onClick={() => handleSort('id')}>Id</li>
                    </ul>
                )}
                                    </div>
                                </div>



                                {/* <button>
                                    <Link href="#" onClick={() => generateMoreUnits()}>{"gennnnnnnnnn"}</Link>
                                </button> */}
                                <div className="row">

                                    {filteredUnits?.map(unit => (
                                        <UnitCard stack={getStack(unit?.stack)} isCompleted={CheckCompletion(unit.id)} levelName={levels[unit?.level]} level={unit?.level} navigateTo={`/unit-details`} unit={unit} setUnitHoverID={setUnitHoverID} unitHoverID={unitHoverID} clicked={updateUnitWithProgress}></UnitCard>
                                    ))}
                                </div>
                                <div className="row" style={{
                                    height: "80px",
                                    display: "flex",                // Enables flexbox
                                    alignItems: "center",           // Vertically centers the content
                                    justifyContent: "center"        // Horizontally centers the content
                                }}>
                                    <div style={{
                                        cursor: "pointer",
                                        // Horizontally centers the content
                                    }}>{globalArguments?.displayedPage > 1 && <div onClick={() => addUnits()}>
                                        {searching ? <div style={{
                                            height: "36px", width: "50px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }} > <Preloader showLoadingText={false} /> </div> : <> {"Load More"} </>}

                                    </div>}

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

            </Layout>
        </>
    )
});
