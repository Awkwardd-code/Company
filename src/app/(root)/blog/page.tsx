import React from 'react'

import BottomHeader from '@/components/BottomHeader'
import Footer from '@/components/Footer'
import Header from '@/components/HeaderComponent'

import BlogPage from './_components/BlogCard'



function Blog() {
  return (
    <div>
        <Header/>
        <BlogPage/>
        <BottomHeader/>
        <Footer/>
    </div>
  )
}

export default Blog
