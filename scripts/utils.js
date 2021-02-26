export const capitalize = string => {
  return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase()
}

export const getRandomProperty = obj => {
  const keys = Object.keys(obj)
  const randIndex = Math.floor(keys.length * Math.random())
  return obj[keys[randIndex]]
}

export const fetchJSON = url => {
  return fetch(url).then(res => res.json())
}
