import Link from "next/link"
import Preloader from "./Preloader"
import React, { useEffect } from 'react';

export default function StartSessionModal({ isModal, handleModal,message,submessage,downloadUrl,download}) {

    useEffect(() => {
            if (download){
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = '';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

      }, [download,downloadUrl]);

    return (
        <>
            <div className={`modal fade popup ${isModal ? "show d-block" : ""}`} id="popup_bid" tabIndex={-1} aria-modal="true" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body ">
                            <a onClick={handleModal} className="btn-close" data-dismiss="modal"><i className="fal fa-times" /></a>
                            <h3>{message}</h3>
                            <p className="sub-heading">{submessage}</p>
                            <Preloader />

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