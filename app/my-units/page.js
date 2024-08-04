'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import React, { useEffect, useRef, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import {  getMoreMyTempUnits,  getMyTempUnits } from "../services/content";
import UnitCard from "@/components/elements/UnitCard";
import useMiddleware from "../services/contextMiddleware";


export default withPageAuthRequired(function Explore() {
    const { initProfile,globalArguments,updateGlobalArguments } = useMiddleware();


    const [units, setUnits] = useState([])
    const [unitHoverID, setUnitHoverID] = useState(-1)
    const [searchPattern, setSearchPattern] = useState("")


    
    useEffect(() => {
        const initializeData = async () => {
            await initProfile();
        };

        initializeData();
    }, [initProfile]);



    useEffect(() => {
        if (globalArguments?.myTempUnits) {
            console.log(globalArguments);
            setUnits(globalArguments?.myTempUnits)
        }
        else {
            searchUnits(globalArguments?.profile?.userid);
        }

    }, []);

    useEffect(() => {
        console.log("wiwiwiwiw");
        console.log(units);


    }, [units]);


    const filteredUnits = units?.filter(unit => {
        const pattern = searchPattern.toLowerCase();
        return (
            unit?.topic?.toLowerCase().includes(pattern) ||
            unit?.unicode?.toLowerCase().includes(pattern)
        );
    });


    const searchUnits = async (userid) => {
        setUnits([]);
        let units = await getMyTempUnits(userid);

        setUnits(units);
        updateGlobalArguments({ tempUnitsDisplayedPage: 2 });
        updateGlobalArguments({ myTempUnits: units });

    }

    const addUnits = async () => {
        let units_withMore = await getMoreMyTempUnits(globalArguments?.displayedPage, units, globalArguments?.profile?.userid);
        setUnits(units_withMore);
        updateGlobalArguments({ displayedPage: globalArguments?.displayedPage + 1 });
        updateGlobalArguments({ displayedUnits: units_withMore });

    }
    const updateTempUnit = async (unit) => {
        updateGlobalArguments({ editedUnit: unit });

    }
    


    return (
        <>
            <Layout headerStyle={1} footerStyle={1} >
                <section className="tf-collection-inner">
                    <div className="tf-container">
                        <div className="action-box2">
                            <div className="action-box-inner2">
                                <div className="group-btn">
                                    <Link onClick={()=> updateTempUnit({})} href="/builder" className="tf-button">
                                        <span>CREATE NEW UNIT</span>
                                    </Link>

                                </div></div>
                        </div>
                        <br></br>

                        <div className="row ">

                            <div className="col-lg-12 col-md-12 ">
                                <div className="top-option">
                                    <h2 className="heading">My Units</h2>
                                    <div className="widget widget-search">
                                        <form action="#">
                                            <input onChange={(event) => setSearchPattern(event.target.value)} type="text" placeholder="Search Unit" required />
                                            <Link className="btn-search" href="#"><i className="icon-fl-search-filled" /></Link>
                                        </form>
                                    </div>

                                </div>

                                {/* <button>
                                    <Link href="#" onClick={() => generateMoreUnits()}>{"gennnnnnnnnn"}</Link>
                                </button> */}
                                <div className="row">

                                    {filteredUnits?.map(unit => (
                                    <UnitCard margin="20px" height="420px" width="300px" levelName={unit?.level} level={unit?.levelIndex} navigateTo={`/builder`} unit={unit} setUnitHoverID={setUnitHoverID} unitHoverID={unitHoverID} clicked={updateTempUnit}></UnitCard>


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
                                        {"Load More"}
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
