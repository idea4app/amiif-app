export function validateEmail(value) {
  console.log({ value })
  return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)
}

export function validatePassword(value) {
  return (value || '').match(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
  )
}
