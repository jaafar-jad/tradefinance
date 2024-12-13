"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa'

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
  

      
      const types = ['deposit', 'withdrawal']
      const amounts = Array.from({ length: 50 }, () => Math.floor(Math.random() * 250000) + 1000)
    
      return {
          id: Math.random().toString(36).substr(2, 9),
          type: types[Math.floor(Math.random() * types.length)],
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          country: usCities[Math.floor(Math.random() * usCities.length)],
          time: new Date().toISOString()
      }
  }
  
export default function TransactionNotification() {
  const [notifications, setNotifications] = useState([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = generateTransactions()
      setNotifications(prev => {
        const updated = [...prev, newTransaction]
        if (updated.length > 1) {
          return [updated[updated.length - 1]]
        }
        return updated
      })
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newTransaction.id))
      }, 5000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
  {notifications.map((notification) => (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-0 right-0 -translate-x-1/2 z-50 w-full px-4 md:px-0 md:w-auto"
    >
      <div className="bg-white rounded-lg shadow-2xl p-1 relative mx-auto max-w-[260px] md:max-w-[290px]">
        <button
          onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="text-xs" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            {notification.type === 'deposit' ? (
              <div className="w-5 h-5 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FaArrowDown className="text-green-500 text-xs md:text-sm" />
              </div>
            ) : (
              <div className="w-5 h-5 md:w-8 md:h-8 bg-red-100 rounded-full flex items-center justify-center">
                <FaArrowUp className="text-red-500 text-xs md:text-sm" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[0.5rem] md:text-xs text-gray-900">
              An Investor from{' '}
              <span className="font-semibold">{notification.country}</span>{' '}
              {notification.type === 'deposit' ? 'deposited' : 'withdrew'}{' '}
              <span className="font-semibold">
                ${notification.amount.toLocaleString()}
              </span>
            </p>
            <p className="text-[0.7rem] text-green-500">
              Just now
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  ))}
</AnimatePresence>

  )
}
