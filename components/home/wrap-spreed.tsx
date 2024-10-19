import React from 'react'; 
import { Cover } from '../ui/cover'; 
 
export function Wrap() { 
    return ( 
        <>
        
        
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"> 
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold max-w-7xl mx-auto text-center mt-6 py-6 bg-clip-text text-transparent bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400"> 
                Judge a Hackathon <br /> at <Cover>warp speed</Cover> 
            </h1> 
        </div> 
        </>
        
    ); 
} 
