export function formatDate(value, options = {}) {
  const date = new Date(value)

  return date.toLocaleDateString('es-MX', options)
}
