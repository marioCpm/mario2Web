'use client'

import Layout from "@/components/layout/Layout"
import About1 from "@/components/sections/About1"
import Pricing1 from "@/components/sections/Pricing1"
import Collection1 from "@/components/sections/Collection1"
import Faq1 from "@/components/sections/Faq1"
import Logo from "@/components/sections/Logo"
import Partner1 from "@/components/sections/Partner1"
import Roadmap3 from "@/components/sections/Roadmap3"
import Slider1 from "@/components/sections/Slider1"
import Team1 from "@/components/sections/Team1"
import Work1 from "@/components/sections/Work1"
import Keys1 from "@/components/sections/Keys1"
import { useEffect, useState } from "react"
import useMiddleware from "./services/contextMiddleware"

export default function Home() {
    const { initHome , globalArguments} = useMiddleware();
    const [loading, setLoading] = useState(true); // Create a loading state

    useEffect(() => {
        const initializeData = async () => {
            await initHome();
        

            setLoading(false);
        };
        if (!globalArguments?.home) {
            initializeData();

        }
        else {
            setLoading(false);

        }

    }, [initHome]);
    return (
        <div >
                <Layout footerData={globalArguments?.home?.footerData} headerStyle={1} footerStyle={1}>            
                <Slider1 sliderData={globalArguments?.home?.sliderData}/>

                <Logo />
                <About1 AboutData={globalArguments?.home?.AboutData} sliderData={globalArguments?.home?.sliderData}/>
                <Work1 howToUseData={globalArguments?.home?.howToUseData}/>

                <Collection1 collectionData={globalArguments?.home?.collectionData}/>

                {/* <Team1 /> */}

                {/* <Roadmap3 /> */}

                <Pricing1 PlansData={globalArguments?.home?.PlansData} keys={false}/>

                <Partner1 StackData={globalArguments?.home?.StackData}/>

                <Faq1 FaqData={globalArguments?.home?.FaqData}/>              

            </Layout>    
            
        </div>
    )
}


