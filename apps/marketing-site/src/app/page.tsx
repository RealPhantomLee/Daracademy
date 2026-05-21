import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SubjectsSection } from "@/components/sections/SubjectsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { GuardianSection } from "@/components/sections/GuardianSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SubjectsSection />
      <HowItWorksSection />
      <ScheduleSection />
      <GuardianSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
