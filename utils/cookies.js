export function createCookie({ name, value, ageInSeconds }) {
  const cookie = `${name}=${value};max-age=${ageInSeconds};path=/`
  document.cookie = cookie
}
