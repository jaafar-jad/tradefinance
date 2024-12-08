"use client"
import Head from 'next/head'
import { useParams } from "next/navigation"
import Charts from "@/components/dashboard/charts/Charts"
import TradingViewChart from "@/components/dashboard/charts/TradingViewChart"
import QuickActions from "@/components/ui/QuickActions/QuickActions"
import HomeTransactions from "@/components/Home/HomeTransactions/HomeTransactions"
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

export default function DashboardPage() {
  const params = useParams()
  const userId = params.userId

  return (
    <>
      <Head>
        <title>Trading Dashboard | Trade Finance</title>
        
        {/* Security Headers */}
        <meta name="robots" content="noindex, nofollow" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://www.tradefinance.com" />
        <meta http-equiv="X-Frame-Options" content="DENY" />
        
        {/* Cache Control */}
        <meta http-equiv="Cache-Control" content="private, no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        
        {/* PWA Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <ErrorBoundary>
      <div className="min-h-screen-mt-4 bg-gray-100">
        <Charts/>
        <QuickActions userId={userId} />
        <TradingViewChart/>
        <HomeTransactions/>
      </div>
      </ErrorBoundary>
    </>
  )
}
