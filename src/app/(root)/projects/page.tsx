import Header from '@/components/HeaderComponent'
import React from 'react'
import ProjectsPage from './_components/ProjectsPage'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'


function Projects() {
  return (
    <div>
      <Header/>
      <ProjectsPage/>
      <ChatWidget/>
      <Footer/>
    </div>
  )
}

export default Projects
