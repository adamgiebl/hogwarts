export function sortUpDown(a, b, sortBy) {
  if (a[sortBy] < b[sortBy]) {
    return -1
  }
  if (a[sortBy] > b[sortBy]) {
    return 1
  }
  return 0
}

export function sortDownUp(a, b, sortBy) {
  if (a[sortBy] > b[sortBy]) {
    return -1
  }
  if (a[sortBy] < b[sortBy]) {
    return 1
  }
  return 0
}

export const capitalize = string => {
  return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase()
}
