import Header from '@/components/HeaderComponent'
import React from 'react'
import FAQPage from './_components/FAQPage'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

function FAQs() {
  return (
    <div>
        <Header/>
        <FAQPage/>
        <ChatWidget/>
        <Footer/>
      
    </div>
  )
}

export default FAQs
