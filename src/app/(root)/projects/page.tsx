import Header from '@/components/HeaderComponent'
import React from 'react'
import ProjectsPage from './_components/ProjectsPage'
import BottomHeader from '@/components/BottomHeader'
import Footer from '@/components/Footer'
import ProjectDetailsPage from './_components/ProjectDetailsPage'

function Projects() {
  return (
    <div>
      <Header/>
      <ProjectDetailsPage/>
      <BottomHeader/>
      <Footer/>
    </div>
  )
}

export default Projects
