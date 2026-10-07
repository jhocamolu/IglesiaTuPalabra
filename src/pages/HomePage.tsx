import React from 'react';
import { Navbar } from '../components/Navbar.tsx';
import { Hero } from '../components/Hero.tsx';
import { AboutSection } from '../components/AboutSection.tsx';
import { ServicesSection } from '../components/ServicesSection.tsx';
import { MinistriesSection } from '../components/MinistriesSection.tsx';
import { GroupsSection } from '../components/GroupsSection.tsx';
import { EventsSection } from '../components/EventsSection.tsx';
import { SocialSection } from '../components/SocialSection.tsx';
import { VisitSection } from '../components/VisitSection.tsx';
import { WhatsAppFloating } from '../components/WhatsAppFloating.tsx';
import { Footer } from '../components/Footer.tsx';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <main className="grow">
        <Hero />
        <AboutSection />
        <ServicesSection />
        <MinistriesSection />
        <GroupsSection />
        <EventsSection />
        <SocialSection />
        <VisitSection />
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
};
