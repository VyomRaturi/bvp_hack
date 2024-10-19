import { FeaturesSectionDemo } from '@/components/home/features'; 
import { TailwindcssButtons } from '@/components/home/launchbtn'; 
import { Testimonials } from '@/components/home/testimonials'; 
import { Wrap } from '@/components/home/wrap-spreed'; 
import React from 'react'; 
import Footer from '@/components/home/footer';
type Props = {}; 
 
const Home = (props: Props) => { 
  return ( 
    <div className='relative'> 
      {/* <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div> */}
      {/* Hero Section */} 
      <div className="flex items-center justify-center flex-col min-h-[80vh]"> 
        <Wrap /> 
        <TailwindcssButtons /> 
      </div> 
 
      {/* Rest of the content */} 
         
        <div> 
          <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold max-w-7xl mx-auto text-center mt-6 py-6 text-gray-800"> 
            Why Choose Judge Smart? 
          </h1> 
          <FeaturesSectionDemo /> 
        </div> 
        <div> 
          <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold max-w-7xl mx-auto text-center mt-6 py-6 text-gray-800"> 
            Testimonials: Building Trust and Credibility 
          </h1> 
          <Testimonials /> 
          <Footer/>
        </div> 
      </div> 
  ); 
}; 
 
export default Home;