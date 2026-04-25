import { HomeAdBannerSection } from '@/components/home-ad-banner-section';
import { HomeContactSection } from '@/components/home-contact-section';
import { HomeEditorPickSection } from '@/components/home-editor-pick-section';
import { HomeHeroSection } from '@/components/home-hero-section';
import { HomeLatestSection } from '@/components/home-latest-section';
import { HomeNewsletterCta } from '@/components/home-newsletter-cta';
import { HomeNewsSection } from '@/components/home-news-section';
import { HomeTutorialsSection } from '@/components/home-tutorials-section';

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-[#FAFAFA] text-zinc-900 antialiased selection:bg-indigo-200 selection:text-indigo-900">
      <HomeHeroSection />
      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 lg:space-y-32 lg:px-8 lg:py-24">
        <HomeEditorPickSection />
        <HomeTutorialsSection />
        <HomeLatestSection />
        <HomeAdBannerSection />
        <HomeNewsSection />
        <HomeNewsletterCta />
        <HomeContactSection />
      </div>
    </div>
  );
}
