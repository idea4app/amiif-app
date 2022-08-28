export function fetcher(url, props = {}) {
  return fetch(url, {
    ...props,
    headers: {
      'Content-Type': 'application/json',
      ...(props.headers || {}),
    },
  })
}
