export function filterStudentsByTags(students) {
  // not optimized at all, but it works
  /* 
    The reason there are two iterations over the array is because 
    once I need to add all the students to a list who have fulfil the inclusive filter and
    then I need to filter them with the exlusive filters.
    Inclusive meaning that if we choose Hufflepuff and Slytherin, it will show students from
    both houses. Exclusive means that if we choose girls and boys, it will show no-one because
    no student is boy and a girl at the same time.
    This should allow for advanced searches like:
    - only girls from Slytherin and Hufflepuff
    - only boys from Gryffindor that are Expelled
    - students from Hufflepuff that are Prefects
  
  */

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

  // if inclusive filters didn't add anyone, we need to re-fill the array
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
    return students.sort((a, b) => sortAscending(a, b, sortByKey))
  }
  return students.sort((a, b) => sortDescending(a, b, sortByKey))
}

export function searchStudents(students, searchTerm) {
  if (!searchTerm) return students
  return students.filter(
    student =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )
}

export function sortDescending(a, b, sortBy) {
  if (a[sortBy] < b[sortBy]) {
    return -1
  }
  if (a[sortBy] > b[sortBy]) {
    return 1
  }
  return 0
}

export function sortAscending(a, b, sortBy) {
  if (a[sortBy] > b[sortBy]) {
    return -1
  }
  if (a[sortBy] < b[sortBy]) {
    return 1
  }
  return 0
}
