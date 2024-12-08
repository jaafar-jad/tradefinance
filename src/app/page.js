import HeroSlider from '@/components/Home/Hero/HeroSlider'
import HomeAbout from '@/components/Home/HomeAbout/HomeAbout'
import HomeServices from '@/components/Home/HomeServices/HomeServices'
import HomePlans from '@/components/Home/HomePlans/HomePlans'
import HomeTransactions from '@/components/Home/HomeTransactions/HomeTransactions'
import HomeAffiliate from '@/components/Home/HomeAffiliate/HomeAffiliate'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
export const metadata = {
  openGraph: {
    title: 'Trade Finance | AI-Powered Trading Platform',
    description: 'Experience next-generation trading with AI-powered strategies.',
    type: 'website',
    images: [{ url: '/home-hero.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade Finance Platform',
    description: 'AI-powered trading platform with secure investment plans.',
    images: ['/home-hero.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://tradefinance.com' },
}

export default function Home() {
  return (
    <ErrorBoundary>
    <main>
      <HeroSlider />
      <HomeAbout/>
      <HomeServices/>
      <HomePlans/>
      <HomeTransactions/>
      <HomeAffiliate/>
    </main>
    </ErrorBoundary>
  )
}
