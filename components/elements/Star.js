import React from 'react';
import Link from "next/link"

export default function Star({ size }) {

    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="gold"
        className="bi bi-star-fill"
        viewBox="0 0 16 16"
    >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.84L.173 6.765c-.329-.32-.158-.863.283-.915l4.898-.71L7.538.792c.197-.403.73-.403.927 0l2.184 4.347 4.898.71c.441.065.612.596.283.915l-3.522 3.356.83 4.84c.078.443-.36.79-.746.592L8 13.187l-4.388 2.256z"/>
    </svg>
    );
}









