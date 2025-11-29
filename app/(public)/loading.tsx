import React from 'react';
import {SuspenseContent} from "@components/Suspense/SuspenseContent";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Loading Payment page...</h1>
            <SuspenseContent/>
        </div>
    );
}
