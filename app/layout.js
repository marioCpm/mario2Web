
import { Poppins, Bakbak_One } from 'next/font/google'
import "/public/assets/css/style.css"
import "/public/assets/css/responsive.css"
import ClientWrapper from './ClientWrapper'

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: "--poppins",
    display: 'swap',
})
const bakbak = Bakbak_One({
    weight: ['400'],
    subsets: ['latin'],
    variable: "--bakbak",
    display: 'swap',
})

export const metadata = {
    title: 'GALENAI | The home of simplified tutorials',
    description: 'start your journey today',
}

export default function RootLayout({ children }) {
    return (
        <html style={{zoom:"75%"}} lang="en" >
                <ClientWrapper>
                <body className={`${poppins.variable} ${bakbak.variable} body header-fixed`}>{children}</body>
                </ClientWrapper>
        </html>
    )
}
// --poppins: var(--poppins);
// --bakbak: var(--bakbak)