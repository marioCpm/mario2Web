'use client'

import CounterUp from "@/components/elements/CounterUp";
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { IoDiamondOutline } from "react-icons/io5";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export default function ScoreBoard() {
// Users for a single day
const usersDay = [
    {name: "QuickSilver", img: "/assets/figures/f1.png.png", score: 120, countryCode: "us"},
    {name: "ElToro", img: "/assets/figures/f1.png.png", score: 95, countryCode: "es"},
    {name: "NordicKnight", img: "/assets/figures/f1.png.png", score: 150, countryCode: "se"},
    {name: "SamuraiJack", img: "/assets/figures/f1.png.png", score: 180, countryCode: "jp"},
    {name: "CelticSage", img: "/assets/figures/f1.png.png", score: 50, countryCode: "ie"},
    {name: "DesertRose", img: "/assets/figures/f1.png.png", score: 160, countryCode: "eg"},
    {name: "VikingWarrior", img: "/assets/figures/f1.png.png", score: 140, countryCode: "no"},
    {name: "AlpineFox", img: "/assets/figures/f1.png.png", score: 130, countryCode: "ch"},
    {name: "SambaSun", img: "/assets/figures/f1.png.png", score: 110, countryCode: "br"},
    {name: "DragonHeart", img: "/assets/figures/f1.png.png", score: 115, countryCode: "cn"}
];

// Users for a single month - scores are scaled and diversified
const usersMonth = [
    {name: "QuickSilver", img: "/assets/figures/f1.png.png", score: 3200, countryCode: "us"},
    {name: "ElToro", img: "/assets/figures/f1.png.png", score: 3150, countryCode: "es"},
    {name: "NordicKnight", img: "/assets/figures/f1.png.png", score: 3700, countryCode: "se"},
    {name: "SamuraiJack", img: "/assets/figures/f1.png.png", score: 3450, countryCode: "jp"},
    {name: "CelticSage", img: "/assets/figures/f1.png.png", score: 3050, countryCode: "ie"},
    {name: "DesertRose", img: "/assets/figures/f1.png.png", score: 3320, countryCode: "eg"},
    {name: "VikingWarrior", img: "/assets/figures/f1.png.png", score: 3140, countryCode: "no"},
    {name: "AlpineFox", img: "/assets/figures/f1.png.png", score: 3250, countryCode: "ch"},
    {name: "SambaSun", img: "/assets/figures/f1.png.png", score: 3280, countryCode: "br"},
    {name: "DragonHeart", img: "/assets/figures/f1.png.png", score: 3195, countryCode: "cn"}
];

// Users for all time - scores are significantly higher and diversified
const usersAllTime = [
    {name: "QuickSilver", img: "/assets/figures/f1.png.png", score: 12500, countryCode: "us"},
    {name: "ElToro", img: "/assets/figures/f1.png.png", score: 12200, countryCode: "es"},
    {name: "NordicKnight", img: "/assets/figures/f1.png.png", score: 13800, countryCode: "se"},
    {name: "SamuraiJack", img: "/assets/figures/f1.png.png", score: 14500, countryCode: "jp"},
    {name: "CelticSage", img: "/assets/figures/f1.png.png", score: 10500, countryCode: "ie"},
    {name: "DesertRose", img: "/assets/figures/f1.png.png", score: 11600, countryCode: "eg"},
    {name: "VikingWarrior", img: "/assets/figures/f1.png.png", score: 11900, countryCode: "no"},
    {name: "AlpineFox", img: "/assets/figures/f1.png.png", score: 12000, countryCode: "ch"},
    {name: "SambaSun", img: "/assets/figures/f1.png.png", score: 11700, countryCode: "br"},
    {name: "DragonHeart", img: "/assets/figures/f1.png.png", score: 11200, countryCode: "cn"}
];
usersDay.sort((a, b) => b.score - a.score);
usersMonth.sort((a, b) => b.score - a.score);
usersAllTime.sort((a, b) => b.score - a.score);

    return (
        <Layout headerStyle={1} footerStyle={1}>
                        <section className="tf-section tf-about">
                <div className="tf-container">
                    <div className="row ">
                        <div className="col-md-12 ">
                            <div className="tf-heading wow fadeInUp">
                                <h2 className="heading">Score Board</h2>
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div className="tf-step wow fadeInUp" data-wow-delay="0.2s">
                                <div className="step-title">
                                    <h3>Today's board</h3>
                                </div>
                                <div style={{margin:"30px"}} className="">          
                    {usersDay.map((user, index) => (
                        <div  key={"key5_"+index} style={{border: "1px solid cyan"}} className="user-row">
                            <img src={user.img} alt={user.name} className="user-img" />
                            <span className={`fi fi-${user.countryCode}`}></span>

                            <div className="user-name"><div style={{ fontFamily: "consolas" }}> {user.name}</div></div>
                            

                            <div style={{margin:"10px",color: "lightgreen"}} className="user-score">
                            <CounterUp count={user.score} data-speed={2000} />
                            <IoDiamondOutline style={{ margin: "0px 0px -3px 5px" }} />

                            </div>
                        </div>
                    ))}
                </div>
                            </div>
                        </div>


                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div className="tf-step wow fadeInUp" data-wow-delay="0.2s">
                                <div className="step-title">
                                    <h3>June's board</h3>
                                </div>
                                <div style={{margin:"30px"}} className="">          
                    { usersMonth.map((user, index) => (
                        <div  key={"key6_"+index} style={{border: "1px solid lightgreen"}} className="user-row">

                            <img src={user.img} alt={user.name} className="user-img" />
                            <span className={`fi fi-${user.countryCode}`}></span>
                            <div className="user-name"><div style={{ fontFamily: "consolas" }}> {user.name}</div></div>
                            

                            <div style={{margin:"10px",color: "lightgreen"}} className="user-score">
                            <CounterUp count={user.score} data-speed={2000} />
                            <IoDiamondOutline style={{ margin: "0px 0px -3px 5px" }} />

                            </div>
                        </div>
                    ))}
                </div>
                            </div>
                        </div>




                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div className="tf-step wow fadeInUp" data-wow-delay="0.2s">
                                <div className="step-title">
                                    <h3>ALL TIMES board</h3>
                                </div>
                                <div style={{margin:"30px"}} className="">          
                    {usersAllTime.map((user, index) => (
                        <div  key={"key7_"+index} style={{border: "1px solid lightpink"}} className="user-row">
                            <img src={user.img} alt={user.name} className="user-img" />
                            <span className={`fi fi-${user.countryCode}`}></span>

                            <div className="user-name"><div style={{ fontFamily: "consolas" }}> {user.name}</div></div>
                            

                            <div style={{margin:"10px", color: "lightgreen"}}  className="user-score">
                            <CounterUp count={user.score} data-speed={2000} />
                            <IoDiamondOutline style={{ margin: "0px 0px -3px 5px" }} />

                            </div>
                        </div>
                    ))}
                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <br></br><br></br><br></br>
        </Layout>
    )
}
