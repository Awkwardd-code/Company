import React from 'react'

import Footer from '@/components/Footer'
import Header from '@/components/HeaderComponent'
import TeamPage from './_components/TeamPage'
import NewsLetter from '@/components/NewsLetter'
import ChatWidget from '@/components/ChatWidget'



function Team() {
  return (
    <div>
        <Header/>
       <TeamPage/>
       <NewsLetter/>
        <ChatWidget/>
        <Footer/>
    </div>
  )
}

export default Team
