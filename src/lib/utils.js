export const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }
  
  export const calculateDaysOnline = (startDate) => {
    const start = new Date(startDate)
    const today = new Date()
    const diffTime = Math.abs(today - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  