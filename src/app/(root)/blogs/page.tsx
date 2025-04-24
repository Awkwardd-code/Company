import React from 'react'

import BottomHeader from '@/components/BottomHeader'
import Footer from '@/components/Footer'
import Header from '@/components/HeaderComponent'

import BlogDetailsPage from './_components/BlogDetailsPage'



function Blog() {
  return (
    <div>
        <Header/>
       <BlogDetailsPage/>
        <BottomHeader/>
        <Footer/>
    </div>
  )
}

export default Blog
