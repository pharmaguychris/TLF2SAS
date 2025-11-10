import React from 'react';

export const Background: React.FC = () => {
    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e7e5e4_100%)] dark:hidden"></div>
            <div className="absolute inset-0 -z-10 h-full w-full items-center hidden dark:block [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        </>
    );
}