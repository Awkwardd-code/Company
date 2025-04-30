import Header from '@/components/HeaderComponent';
import React from 'react';
import BottomHeader from '@/components/BottomHeader';
import Footer from '@/components/Footer';
import InterviewScheduleUI from './_components/someting';
import NewsLetter from '@/components/NewsLetter';




function MeetingArea() {
  return (
    <div>
      <Header />
      <InterviewScheduleUI/>
      <NewsLetter/>
      <BottomHeader/>
      <Footer />
    </div>
  );
}

export default MeetingArea;
