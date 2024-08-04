import Link from "next/link"

export default function Pricing2() {
    return (
        <>
            <section style={{marginTop:"0px"}} className="tf-section tf-about">
                <div className="tf-container">
                    <div className="row ">
                        <div className="col-md-12 ">
                            <div className="tf-heading wow fadeInUp">
                                <h2 className="heading">OUR PLANS</h2>
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div className="tf-step wow fadeInUp" data-wow-delay="0.2s">
                                <div className="step-title">
                                    <div className="sub-number">
                                        Free
                                    </div>
                                    <h3><br></br></h3>
                                    <h3>$0.00</h3>
                                </div>
                                <ul className="list-bullets">
                                    <li> - Perfect for beginners</li>
                                    <li> - Access to basic courses</li>
                                </ul>
                                <br></br>
                                <div className="btn-slider ">
                                    <Link href="/collection" className="tf-button style-2">SIGN UP FOR FREE</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div className="tf-step wow fadeInUp" data-wow-delay="0.3s">
                                <div className="step-title">
                                    <div className="sub-number">
                                        Basic
                                    </div>
                                    <h3><br></br></h3>
                                    <h3>$5.90</h3>
                                </div>
                                <ul className="list-bullets">
                                    <li> - All Free plan features plus:</li>
                                    <li> - Access to advanced courses</li>
                                </ul>
                                <br></br>
                                <div className="btn-slider ">
                                    <Link href="/collection" className="tf-button style-2">UPGRADE PLAN</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                            <div className="tf-step wow fadeInUp" data-wow-delay="0.4s">
                                <div className="step-title">
                                    <div className="sub-number">
                                        Pro
                                    </div>
                                    <h3><br></br></h3>
                                    <h3>$12.90</h3>
                                </div>
                                <ul className="list-bullets">
                                    <li> - All Basic plan features plus:</li>
                                    <li> - 1-on-1 mentoring sessions</li>
                                </ul>
                                <br></br>
                                <div className="btn-slider ">
                                    <Link href="/collection" className="tf-button style-2">BECOME PRO</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
