export default async function fetchData (url) {
  const response = await fetch(url)
  return await response.json()
}