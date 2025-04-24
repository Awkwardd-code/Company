


import Header from '@/components/HeaderComponent'
import HomeSection from './_components/HomeSection'
import FeaturedSection from './_components/FeaturedSection'
import PortfolioSection from './_components/PortfolioSection'
import TestimonialSection from './_components/TestimonialSection'
import WhyUsSection from './_components/WhyUsSection'
import WhyToUsSection from './_components/WhyToUsSection'
import BlogSection from './_components/BlogSection'
import CoreTechSection from './_components/CoreTechSection'
import SupportSection from './_components/SupportSection'
import CTASection from './_components/CTASection'
import BottomHeader from '@/components/BottomHeader'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'




function HomePage() {
    return (
        <div>
            <Header/>
            <HomeSection/>
            <FeaturedSection/>
            <PortfolioSection/>
            <TestimonialSection/>
            <WhyUsSection/>
            <WhyToUsSection/>
            <BlogSection/>
            <CoreTechSection/>
            <SupportSection/>
            <CTASection/>
            {/* <ChatWidget/> */}
            <BottomHeader/>
            <Footer/>
           
            
        </div>
    )
}

export default HomePage
