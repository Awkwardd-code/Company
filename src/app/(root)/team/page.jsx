import React from 'react'

import BottomHeader from '@/components/BottomHeader'
import Footer from '@/components/Footer'
import Header from '@/components/HeaderComponent'
import TeamPage from './_components/TeamPage'
import NewsLetter from '@/components/NewsLetter'



function Team() {
  return (
    <div>
        <Header/>
       <TeamPage/>
       <NewsLetter/>
        <BottomHeader/>
        <Footer/>
    </div>
  )
}

export default Team
