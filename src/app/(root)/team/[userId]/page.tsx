import Header from '@/components/HeaderComponent'
import React from 'react'
import Footer from '@/components/Footer'
import AuthorPage from './AutherPage'
import ChatWidget from '@/components/ChatWidget'


function Projects() {
  return (
    <div>
      <Header/>
      <AuthorPage/>
      <ChatWidget/>
      <Footer/>
    </div>
  )
}

export default Projects
