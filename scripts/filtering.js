export function filterStudentsByTags(students) {
  // it works, don't touch it
  const selectedTags = document.querySelectorAll('.tag--selected')
  let filteredStudents = []
  if (selectedTags.length === 0) {
    return students
  }

  selectedTags.forEach(tag => {
    if (tag.dataset.type === 'inclusive') {
      const filterProperty = tag.dataset.property
      const filterValue = tag.dataset.value
      students.forEach(student => {
        if (typeof student[filterProperty] === 'boolean') {
          if (student[filterProperty]) {
            filteredStudents.push(student)
          }
        } else {
          if (student[filterProperty].toLowerCase() === filterValue.toLowerCase()) {
            filteredStudents.push(student)
          }
        }
      })
    }
  })

  if (filteredStudents.length === 0) {
    filteredStudents = students
  }
  selectedTags.forEach(tag => {
    if (tag.dataset.type === 'exclusive') {
      const filterProperty = tag.dataset.property
      const filterValue = tag.dataset.value
      filteredStudents = filteredStudents.filter(student => {
        if (typeof student[filterProperty] === 'boolean') {
          if (student[filterProperty]) {
            return true
          }
        } else {
          if (student[filterProperty].toLowerCase() === filterValue.toLowerCase()) {
            return true
          } else {
            return false
          }
        }
      })
    }
  })
  return filteredStudents
}

export function sortStudents(students, tableHeadCell, sortBy = null) {
  const sortByKey = sortBy ? sortBy : tableHeadCell.dataset.field

  const order = tableHeadCell.dataset.order === 'true'

  tableHeadCell.dataset.order = !order
  if (order) {
    return students.sort((a, b) => sortDownUp(a, b, sortByKey))
  }
  return students.sort((a, b) => sortUpDown(a, b, sortByKey))
}
export function searchStudents(students, searchTerm) {
  return students.filter(
    student =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )
}

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
