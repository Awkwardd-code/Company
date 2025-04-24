import Header from '@/components/HeaderComponent';
import React from 'react';
import BottomHeader from '@/components/BottomHeader';
import Footer from '@/components/Footer';
import MeetingSection from './_components/MeetingSection';
import InterviewScheduleUI from './_components/someting';




function MeetingArea() {
  return (
    <div>
      <Header />
      <InterviewScheduleUI/>
      <Footer />
    </div>
  );
}

export default MeetingArea;
