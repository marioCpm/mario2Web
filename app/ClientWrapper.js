// components/ClientWrapper.js
'use client';  // This directive must be at the top

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { GlobalProvider } from './context/GlobalContext';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

const ClientWrapper = ({ children }) => {
    return (
        <GlobalProvider>
            <UserProvider>
                {children}
                <Analytics />
                <SpeedInsights />
            </UserProvider>
        </GlobalProvider>
    );
};

export default ClientWrapper;
