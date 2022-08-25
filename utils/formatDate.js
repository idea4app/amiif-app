const formatDate = value => {
  const date = new Date(value)
  const day = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(date)
  const month = new Intl.DateTimeFormat('es', { month: 'short' }).format(date)
  const year = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(date)
  const formatted = `${day}-${month}-${year}`
  return formatted
}

export default formatDate
