import HeroSlider from '@/components/Home/Hero/HeroSlider'
import HomeAbout from   '@/components/Home/HomeAbout/HomeAbout'
import HomeServices from '@/components/Home/HomeServices/HomeServices'
import HomePlans from '@/components/Home/HomePlans/HomePlans'
import HomeTransactions from '@/components/Home/HomeTransactions/HomeTransactions'
import HomeAffiliate from '@/components/Home/HomeAffiliate/HomeAffiliate'
export default function Home() {
  return (
    <main>
      <HeroSlider />
      <HomeAbout/>
      <HomeServices/>
      <HomePlans/>
      <HomeTransactions/>
      <HomeAffiliate/>
      
    </main>
  )
}
