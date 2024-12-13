"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowUp, FaArrowDown, FaClock, FaCheckCircle } from 'react-icons/fa'

const TransactionCard = ({ transaction }) => {
  if (!transaction) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-2 md:p-3 mb-2 md:mb-3 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 flex-1">
          {transaction.type === 'deposit' ? (
            <FaArrowDown className="text-green-500 text-sm md:text-xl shrink-0" />
          ) : (
            <FaArrowUp className="text-red-500 text-sm md:text-xl shrink-0" />
          )}
          
          <div className="min-w-[100px] md:min-w-[120px]">
            <p className="font-semibold text-gray-900 text-sm md:text-base">
              ${transaction.amount.toLocaleString()}
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              {transaction.country}
            </p>
          </div>
        </div>

        <div className="flex-1 hidden md:block lg:block">
          <p className="text-xs text-gray-500 font-mono truncate">
            {transaction.wallet}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-green-500 text-xs md:text-sm" />
            <span className="text-green-500 text-xs md:text-sm hidden sm:inline">
              {transaction.status}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-400">
            <FaClock className="shrink-0" />
            <span className="hidden sm:inline">
              {new Date(transaction.time).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-xs text-gray-500 md:hidden lg:hidden font-mono truncate">
          {transaction.wallet}
        </p>
      </div>
    </div>
  )
}

export default function HomeTransactions() {
  const [activeTab, setActiveTab] = useState('deposits')
  const [transactions, setTransactions] = useState({
    deposits: [],
    withdrawals: []
  })

  useEffect(() => {
    const generateTransactions = (type) => {
      const usCities = [
        // Northeast
        'Manhattan, NY', 'Queens, NY', 'Staten Island, NY', 'Bronx, NY', 'Albany, NY',
        'Syracuse, NY', 'Yonkers, NY', 'Schenectady, NY', 'Ithaca, NY', 'Poughkeepsie, NY',
        'Cambridge, MA', 'Worcester, MA', 'Springfield, MA', 'Lowell, MA', 'Quincy, MA',
        'Providence, RI', 'Warwick, RI', 'Cranston, RI', 'Pawtucket, RI', 'Newport, RI',
        'Hartford, CT', 'New Haven, CT', 'Stamford, CT', 'Bridgeport, CT', 'Waterbury, CT',
        'Newark, NJ', 'Trenton, NJ', 'Atlantic City, NJ', 'Princeton, NJ', 'Camden, NJ',
        
        // Southeast
        'Charleston, SC', 'Myrtle Beach, SC', 'Columbia, SC', 'Greenville, SC', 'Hilton Head, SC',
        'Jacksonville, FL', 'Miami Beach, FL', 'Pensacola, FL', 'Daytona Beach, FL', 'Gainesville, FL',
        'Savannah, GA', 'Augusta, GA', 'Macon, GA', 'Athens, GA', 'Columbus, GA',
        'Charlotte, NC', 'Wilmington, NC', 'Chapel Hill, NC', 'Greensboro, NC', 'Winston-Salem, NC',
        
        // Midwest
        'Ann Arbor, MI', 'Grand Rapids, MI', 'Lansing, MI', 'Flint, MI', 'Kalamazoo, MI',
        'Naperville, IL', 'Peoria, IL', 'Rockford, IL', 'Champaign, IL', 'Springfield, IL',
        'Dayton, OH', 'Toledo, OH', 'Akron, OH', 'Canton, OH', 'Youngstown, OH',
        'Bloomington, IN', 'South Bend, IN', 'Evansville, IN', 'Carmel, IN', 'Hammond, IN',
        
        // Southwest
        'Scottsdale, AZ', 'Mesa, AZ', 'Tempe, AZ', 'Chandler, AZ', 'Gilbert, AZ',
        'San Antonio, TX', 'El Paso, TX', 'Plano, TX', 'Frisco, TX', 'McKinney, TX',
        'Santa Fe, NM', 'Las Cruces, NM', 'Rio Rancho, NM', 'Roswell, NM', 'Farmington, NM',
        'Norman, OK', 'Broken Arrow, OK', 'Edmond, OK', 'Stillwater, OK', 'Lawton, OK',
        
        // West Coast
        'San Jose, CA', 'Sacramento, CA', 'Oakland, CA', 'Berkeley, CA', 'Palo Alto, CA',
        'Santa Monica, CA', 'Pasadena, CA', 'Long Beach, CA', 'Anaheim, CA', 'Irvine, CA',
        'Bellevue, WA', 'Tacoma, WA', 'Spokane, WA', 'Vancouver, WA', 'Olympia, WA',
        'Eugene, OR', 'Salem, OR', 'Gresham, OR', 'Hillsboro, OR', 'Bend, OR',
        
        // Mountain Region
        'Boulder, CO', 'Fort Collins, CO', 'Aurora, CO', 'Lakewood, CO', 'Pueblo, CO',
        'Provo, UT', 'Ogden, UT', 'Sandy, UT', 'Orem, UT', 'St. George, UT',
        'Bozeman, MT', 'Missoula, MT', 'Helena, MT', 'Great Falls, MT', 'Billings, MT',
        'Reno, NV', 'Henderson, NV', 'Carson City, NV', 'Sparks, NV', 'North Las Vegas, NV',
        
        // Alaska & Hawaii
        'Fairbanks, AK', 'Sitka, AK', 'Ketchikan, AK', 'Wasilla, AK', 'Kenai, AK',
        'Kailua, HI', 'Hilo, HI', 'Kahului, HI', 'Kaneohe, HI', 'Pearl City, HI',
        
        // Central
        'Omaha, NE', 'Lincoln, NE', 'Bellevue, NE', 'Grand Island, NE', 'Kearney, NE',
        'Sioux Falls, SD', 'Rapid City, SD', 'Aberdeen, SD', 'Brookings, SD', 'Watertown, SD',
        'Fargo, ND', 'Bismarck, ND', 'Grand Forks, ND', 'Minot, ND', 'West Fargo, ND',
        'Des Moines, IA', 'Cedar Rapids, IA', 'Davenport, IA', 'Iowa City, IA', 'Waterloo, IA',

         // Tech Hubs & Suburbs
  'Mountain View, CA', 'Cupertino, CA', 'Menlo Park, CA', 'Sunnyvale, CA', 'Redwood City, CA',
  'Belmont, CA', 'Foster City, CA', 'San Mateo, CA', 'Redmond, WA', 'Kirkland, WA',
  
  // College Towns
  'State College, PA', 'Davis, CA', 'Boulder, CO', 'Madison, WI', 'Amherst, MA',
  'Oxford, MS', 'Charlottesville, VA', 'Lawrence, KS', 'Eugene, OR', 'Athens, GA',
  
  // Historical Towns
  'Plymouth, MA', 'Salem, MA', 'Lexington, MA', 'Concord, MA', 'Gettysburg, PA',
  'Williamsburg, VA', 'St. Augustine, FL', 'New Orleans, LA', 'Natchez, MS', 'Boston, MA',
  
  // Resort Towns
  'Vail, CO', 'Breckenridge, CO', 'Park City, UT', 'Lake Tahoe, CA', 'Palm Springs, CA',
  'Martha Vineyard, MA', 'Nantucket, MA', 'Bar Harbor, ME', 'Ocean City, MD', 'Virginia Beach, VA',
  
  // Growing Metro Areas
  'Boise, ID', 'Nashville, TN', 'Raleigh, NC', 'Austin, TX', 'Denver, CO',
  'Fort Worth, TX', 'Charlotte, NC', 'Phoenix, AZ', 'Salt Lake City, UT', 'Las Vegas, NV',

  // New England Communities
  'Brattleboro, VT', 'Burlington, VT', 'Stowe, VT', 'Montpelier, VT', 'Bennington, VT',
  'Portsmouth, NH', 'Nashua, NH', 'Concord, NH', 'Manchester, NH', 'Hanover, NH',
  'Kennebunkport, ME', 'Portland, ME', 'Augusta, ME', 'Bangor, ME', 'Camden, ME',
  
  // Mid-Atlantic Towns
  'Allentown, PA', 'Bethlehem, PA', 'Scranton, PA', 'Erie, PA', 'Harrisburg, PA',
  'Ithaca, NY', 'Saratoga Springs, NY', 'Lake Placid, NY', 'Woodstock, NY', 'Cooperstown, NY',
  'Asbury Park, NJ', 'Morristown, NJ', 'Cape May, NJ', 'Montclair, NJ', 'Princeton, NJ',
  
  // Southern Gems
  'Asheville, NC', 'Outer Banks, NC', 'Beaufort, SC', 'Greenville, SC', 'Charleston, SC',
  'Savannah, GA', 'St. Simons Island, GA', 'Jekyll Island, GA', 'Tybee Island, GA', 'Athens, GA',
  'Gulf Shores, AL', 'Mobile, AL', 'Huntsville, AL', 'Auburn, AL', 'Tuscaloosa, AL',
  
  // Florida Destinations
  'Naples, FL', 'Sarasota, FL', 'St. Augustine, FL', 'Boca Raton, FL', 'Delray Beach, FL',
  'West Palm Beach, FL', 'Fort Lauderdale, FL', 'Key Largo, FL', 'Marathon, FL', 'Islamorada, FL',
  
  // Midwest Towns
  'Traverse City, MI', 'Mackinac Island, MI', 'Holland, MI', 'Frankenmuth, MI', 'Saugatuck, MI',
  'Door County, WI', 'Lake Geneva, WI', 'Green Bay, WI', 'Eau Claire, WI', 'La Crosse, WI',
  'Duluth, MN', 'Rochester, MN', 'Bemidji, MN', 'Brainerd, MN', 'Alexandria, MN',
  
  // Texas Cities
  'New Braunfels, TX', 'Georgetown, TX', 'Round Rock, TX', 'The Woodlands, TX', 'Sugar Land, TX',
  'Galveston, TX', 'South Padre Island, TX', 'Corpus Christi, TX', 'Amarillo, TX', 'Lubbock, TX',
  
  // Western Towns
  'Sedona, AZ', 'Flagstaff, AZ', 'Prescott, AZ', 'Jerome, AZ', 'Bisbee, AZ',
  'Taos, NM', 'Los Alamos, NM', 'Silver City, NM', 'Truth or Consequences, NM', 'Ruidoso, NM',
  
  // California Communities
  'Carmel-by-the-Sea, CA', 'Big Sur, CA', 'Solvang, CA', 'Ojai, CA', 'Santa Barbara, CA',
  'Laguna Beach, CA', 'Newport Beach, CA', 'Coronado, CA', 'La Jolla, CA', 'Palm Desert, CA',
  
  // Pacific Northwest
  'Port Townsend, WA', 'Leavenworth, WA', 'Walla Walla, WA', 'Friday Harbor, WA', 'Port Angeles, WA',
  'Cannon Beach, OR', 'Hood River, OR', 'Ashland, OR', 'Newport, OR', 'Seaside, OR',
  
  // Mountain West
  'Jackson, WY', 'Cody, WY', 'Sheridan, WY', 'Laramie, WY', 'Casper, WY',
  'Missoula, MT', 'Whitefish, MT', 'Big Sky, MT', 'Red Lodge, MT', 'Livingston, MT',
  'Sun Valley, ID', 'Coeur d Alene, ID', 'McCall, ID', 'Sandpoint, ID', 'Idaho Falls, ID'
      ];
      

      const amounts = Array.from(
        { length: 50 }, 
        () => Math.floor(Math.random() * 250000) + 1000
      )

      const wallets = Array.from({ length: 50 }, () => 
        Array.from({ length: 64 }, () => 
          '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join('')
      )
      
      return Array.from({ length: 50 }, (_, i) => ({
        id: `${type}-${i}`,
        type,
        amount: amounts[i],
        wallet: wallets[i],
        country: usCities[Math.floor(Math.random() * usCities.length)],
        status: 'Confirmed',
        time: new Date(Date.now() - Math.random() * 86400000).toISOString()
      }))
    }

    setTransactions({
      deposits: generateTransactions('deposit'),
      withdrawals: generateTransactions('withdrawal')
    })
  }, [])

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-lg mx-auto"
        >
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('deposits')}
              className={`px-3 py-2 text-sm rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'deposits'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Latest Deposits
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'withdrawals'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Latest Withdrawals
            </button>
          </div>

          <div className="relative h-[400px] overflow-hidden rounded-xl bg-gray-100 px-2 py-4">
            <div className="absolute inset-0 pointer-events-none z-10" />
            
            {transactions[activeTab].length > 0 && (
              <div 
                className="animate-scroll"
                style={{ '--scroll-speed': '110s' }}
              >
                <div className="space-y-2">
                  {transactions[activeTab].map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                  {transactions[activeTab].map((transaction) => (
                    <TransactionCard 
                      key={`${transaction.id}-duplicate`} 
                      transaction={transaction} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
