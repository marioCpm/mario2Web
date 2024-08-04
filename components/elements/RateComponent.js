import React, { useState } from 'react';

export default function RateComponent({ score = 5, setScore, totalPentagons = 5 }) {
    const [hoverIndex, setHoverIndex] = useState(null);

    const fullPentagon = (index) => (
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => setScore ? setScore(index + 1) : null}>
            <path d="M10.1192 4.09438C10.7952 3.60324 11.1332 3.35767 11.5027 3.26278C11.829 3.17901 12.1712 3.17901 12.4975 3.26278C12.867 3.35767 13.205 3.60324 13.881 4.09438L19.6298 8.27108C20.3058 8.76222 20.6437 9.0078 20.8482 9.32992C21.0287 9.61436 21.1344 9.93978 21.1556 10.276C21.1795 10.6568 21.0504 11.0541 20.7922 11.8488L18.5964 18.6068C18.3382 19.4015 18.2091 19.7989 17.9659 20.0928C17.7512 20.3524 17.4743 20.5535 17.1611 20.6775C16.8064 20.818 16.3886 20.818 15.553 20.818H8.44718C7.6116 20.818 7.19381 20.818 6.83908 20.6775C6.52586 20.5535 6.24904 20.3524 6.0343 20.0928C5.79111 19.7989 5.66201 19.4015 5.4038 18.6068L3.20798 11.8488C2.94977 11.0541 2.82066 10.6568 2.84462 10.276C2.86577 9.93978 2.97151 9.61436 3.15202 9.32992C3.35645 9.0078 3.69445 8.76222 4.37045 8.27108L10.1192 4.09438Z"
                fill="#28e3da" />
        </svg>
    );

    const emptyPentagon = (index) => (
        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => setScore ? setScore(index + 1) : null}>
            <path d="M10.1192 4.09438C10.7952 3.60324 11.1332 3.35767 11.5027 3.26278C11.829 3.17901 12.1712 3.17901 12.4975 3.26278C12.867 3.35767 13.205 3.60324 13.881 4.09438L19.6298 8.27108C20.3058 8.76222 20.6437 9.0078 20.8482 9.32992C21.0287 9.61436 21.1344 9.93978 21.1556 10.276C21.1795 10.6568 21.0504 11.0541 20.7922 11.8488L18.5964 18.6068C18.3382 19.4015 18.2091 19.7989 17.9659 20.0928C17.7512 20.3524 17.4743 20.5535 17.1611 20.6775C16.8064 20.818 16.3886 20.818 15.553 20.818H8.44718C7.6116 20.818 7.19381 20.818 6.83908 20.6775C6.52586 20.5535 6.24904 20.3524 6.0343 20.0928C5.79111 19.7989 5.66201 19.4015 5.4038 18.6068L3.20798 11.8488C2.94977 11.0541 2.82066 10.6568 2.84462 10.276C2.86577 9.93978 2.97151 9.61436 3.15202 9.32992C3.35645 9.0078 3.69445 8.76222 4.37045 8.27108L10.1192 4.09438Z"
                fill="transparent" stroke="#28e3da" />
        </svg>
    );

    const fullStar = (index) => (
        <div key={"key_40_"+index} style={{ margin: "5px" }}>
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={() => setScore ? setScore(index + 1) : null}>
                <path stroke="#28e3da" fill="gold" d="M12 .587l3.515 7.11 7.94.78-5.703 5.293 1.507 7.84L12 17.534l-7.259 4.076 1.507-7.84L.545 8.477l7.94-.78z" />
            </svg>
        </div>
    );
    const emptyStar = (index) => (
        <div key={"key_41_"+index} style={{ margin: "5px" }}>
            <svg margin="10px" width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={() => setScore ? setScore(index + 1) : null}>
                <path fill="none" stroke="#28e3da" d="M12 .587l3.515 7.11 7.94.78-5.703 5.293 1.507 7.84L12 17.534l-7.259 4.076 1.507-7.84L.545 8.477l7.94-.78z" />
            </svg>
        </div>
    );
    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            {Array.from({ length: totalPentagons }, (_, i) => i <= (hoverIndex !== null ? hoverIndex : score - 1) ? fullStar(i) : emptyStar(i))}
        </div>
    );
}
