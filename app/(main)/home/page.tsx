import { FeaturesSectionDemo } from '@/components/home/features'
import { Testimonials } from '@/components/home/testimonials'
import { Wrap } from '@/components/home/wrap-speed'
import React from 'react'

type Props = {}

const Home = (props: Props) => {
  return (
    <div>
      <Wrap />
      <div className='flex items-center justify-center flex-col'>
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-black dark:to-black">
          Revolutionizing the Judging Experience
        </h1>
        <p className='text-muted'>Instant Feedback for Participants. Streamlined Processes for Judges. All Powered by Advanced Analytics.</p>
      </div>
      <div>
        <h1 className='text-2xl md:text-2xl lg:text-4xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-black dark:to-black'> Why Choose Judge Smart?</h1>
        <FeaturesSectionDemo />
      </div>
      <div>
        <h1>Testimonials</h1>
        <Testimonials />
      </div>
    </div>
  )
}

export default Home