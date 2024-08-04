import React, { useEffect, useState } from 'react';
import RateComponent from "./RateComponent";
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import Link from 'next/link';
import UnitCard from './UnitCard';
import { useGlobalContext } from '@/app/context/GlobalContext';
import moment from 'moment'; // Ensure you have moment.js installed

const levels = {
    1: "Novice",
    2: "Basic",
    3: "Intermediate",
    4: "Advanced",
    5: "Specialist",
    6: "Professional"
};

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
        clickable: true,
        nextEl: ".button-collection-next",
        prevEl: ".button-collection-prev",
    },
    breakpoints: {
        600: {
            slidesPerView: 2,
            spaceBetween: 30,
        }
    },
}

export default function UnitReviewModal({ isModal, handleModal, submitFeedback, unit }) {
    const formatDate = date => moment(date).fromNow();

    return (
        <>
            <div style={{ background: "transparent" }} className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" style={{ maxHeight: "70vh", maxWidth: "90vh" }} role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <h3 className="title">{unit?.unit?.topic}</h3>
                            <h6 style={{ color: "cyan" }} className="title">{unit?.unit?.unicode}</h6>
                            <h4 className="title">{unit?.unit?.description}</h4>
                            <h4 className="title">Stack: {unit?.unit?.stack?.map((stack) => (stack + ", "))}</h4>
                            <h4 className="title">Concepts: {unit?.unit?.concepts?.map((concept) => (concept + ", "))}</h4>
                            <h6 style={{ color: "cyan" }} className="title">{"Completed sessions:"}</h6>
                            <div className="session-list">
                                {unit?.sessions?.map((session, index) => (
                                    <div key={"key23_"+index} className="session-item">
                                        <div className="session-header">
                                            <h3 className="session-title">Session {index + 1}: <span className="session-score">{session?.score}</span></h3>
                                        </div>
                                        <div className="session-info">
                                            <h6 className="session-time">Completed: {formatDate(session.completedAt)}</h6>
                                            <h6 className="session-id">Session ID: {session?.session_id}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h6 style={{ color: "cyan" }} className="title">{"Total score: "+unit?.score}</h6>

                            <br />
                            <br />
                            <div style={{ padding: "20px" }} className="swiper-container collection">

                                <div className="group-btn-nav">
                                    <div className="swiper-button-prev button-collection-prev" />
                                    <div className="swiper-button-next button-collection-next" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {isModal && <div className="modal-backdrop fade show" onClick={handleModal} />}
        </>
    )
}
