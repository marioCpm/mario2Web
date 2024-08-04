import Preloader from '@/components/elements/Preloader'

export default function loading() {
    return (
        < >
                                    <div style={{ 
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "black", // Optional: to cover the background
                            }} >
            <Preloader/>
            </div>
        </>
    )
}
