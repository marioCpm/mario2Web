import React from 'react';

export default function ScoreComponent({ score, showScore = true, totalPentagons = 3, simple = false }) {
    const fullPentagon = (
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <path d="M10.1192 4.09438C10.7952 3.60324 11.1332 3.35767 11.5027 3.26278C11.829 3.17901 12.1712 3.17901 12.4975 3.26278C12.867 3.35767 13.205 3.60324 13.881 4.09438L19.6298 8.27108C20.3058 8.76222 20.6437 9.0078 20.8482 9.32992C21.0287 9.61436 21.1344 9.93978 21.1556 10.276C21.1795 10.6568 21.0504 11.0541 20.7922 11.8488L18.5964 18.6068C18.3382 19.4015 18.2091 19.7989 17.9659 20.0928C17.7512 20.3524 17.4743 20.5535 17.1611 20.6775C16.8064 20.818 16.3886 20.818 15.553 20.818H8.44718C7.6116 20.818 7.19381 20.818 6.83908 20.6775C6.52586 20.5535 6.24904 20.3524 6.0343 20.0928C5.79111 19.7989 5.66201 19.4015 5.4038 18.6068L3.20798 11.8488C2.94977 11.0541 2.82066 10.6568 2.84462 10.276C2.86577 9.93978 2.97151 9.61436 3.15202 9.32992C3.35645 9.0078 3.69445 8.76222 4.37045 8.27108L10.1192 4.09438Z" 
            stroke="#21E786" strokeWidth="1" strokeLinejoin="round" fill="#28e3da" filter="url(#glow)" />
        </svg>
    );

    const emptyPentagon = (
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <path d="M10.1192 4.09438C10.7952 3.60324 11.1332 3.35767 11.5027 3.26278C11.829 3.17901 12.1712 3.17901 12.4975 3.26278C12.867 3.35767 13.205 3.60324 13.881 4.09438L19.6298 8.27108C20.3058 8.76222 20.6437 9.0078 20.8482 9.32992C21.0287 9.61436 21.1344 9.93978 21.1556 10.276C21.1795 10.6568 21.0504 11.0541 20.7922 11.8488L18.5964 18.6068C18.3382 19.4015 18.2091 19.7989 17.9659 20.0928C17.7512 20.3524 17.4743 20.5535 17.1611 20.6775C16.8064 20.818 16.3886 20.818 15.553 20.818H8.44718C7.6116 20.818 7.19381 20.818 6.83908 20.6775C6.52586 20.5535 6.24904 20.3524 6.0343 20.0928C5.79111 19.7989 5.66201 19.4015 5.4038 18.6068L3.20798 11.8488C2.94977 11.0541 2.82066 10.6568 2.84462 10.276C2.86577 9.93978 2.97151 9.61436 3.15202 9.32992C3.35645 9.0078 3.69445 8.76222 4.37045 8.27108L10.1192 4.09438Z" 
            stroke="#21E786" strokeWidth="1" strokeLinejoin="round" fill="transparent" filter="url(#glow)" />
        </svg>
    );

    const calculateFullPentagons = (score, totalPentagons, simple) => {
        if (simple) {
            return Math.min(score, totalPentagons);
        }
        const maxScore = 10;
        const scorePerPentagon = maxScore / totalPentagons;
        return Math.min(Math.ceil(score / scorePerPentagon), totalPentagons);
    };

    const fullPentagons = calculateFullPentagons(score, totalPentagons, simple);
    const pentagons = [];

    for (let i = 0; i < totalPentagons; i++) {
        pentagons.push(i < fullPentagons ? <div key={i}>{fullPentagon}</div> :<div key={i}>{ emptyPentagon}</div>);
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            {pentagons}
            {showScore && (
                <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                    {score + " / "+(simple?totalPentagons:"10")}
                </div>
            )}
        </div>
    );
}
