import React from 'react'

import Footer from '@/components/Footer'
import Header from '@/components/HeaderComponent'

import BlogPage from './_components/BlogCard'
import ChatWidget from '@/components/ChatWidget'



function Blog() {
  return (
    <div>
        <Header/>
        <BlogPage/>
        <ChatWidget/>
        <Footer/>
    </div>
  )
}

export default Blog
