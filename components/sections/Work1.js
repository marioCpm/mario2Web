import Link from "next/link"

export default function Work1({howToUseData}) {
    return (
        <>

            <section className="tf-section section-work">
                <div className="tf-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="tf-heading mb60 wow fadeInUp">
                                <h2 className="heading">HOW TO USE <span>GALENAI</span></h2>
                            </div>
                        </div>
                        {howToUseData?.steps?.map((step, index) => (
                            <div key={"key45_"+index} className="col-xl-3 col-lg-6 col-md-6">
                            <div className="tf-work wow fadeInUp" data-wow-delay="0.2s">
                                <div className="image">
                                    <img  className="work-image" id={"work-"+(index+1)} src={"/assets/images/svg/work-"+(index+1)+".svg"} alt="Connect" />
                                </div>
                                <h6 className="title"><Link href="/profile">{step?.topic}</Link></h6>
                                <p style={{height:"10vh"}} className="content">{step?.description}</p>
                            </div>
       
                        </div>
                        ))}
                        

                    </div>
                </div>
            </section>
        </>
    )
}
