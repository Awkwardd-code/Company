import React from 'react'

import Footer from '@/components/Footer'
import Header from '@/components/HeaderComponent'
import BlogDetailsPage from '../_components/BlogDetailsPage'
import ChatWidget from '@/components/ChatWidget'





function Blog() {
  return (
    <div>
        <Header/>
        <BlogDetailsPage/>
        <ChatWidget/>
        <Footer/>
    </div>
  )
}

export default Blog
