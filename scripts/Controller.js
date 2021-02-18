import { sortDownUp, sortUpDown } from './utils.js'

export const Controller = {
  students: [],
  filteredStudents: [],
  View: null,
  Student: null,
  async init(View, Student) {
    this.View = View
    this.Student = Student

    const GET_STUDENTS = 'https://petlatkea.dk/2021/hogwarts/students.json'
    const studentsData = await this.fetchJSON(GET_STUDENTS)

    this.students = this.createStudents(studentsData)

    this.students[2].isPrefect = true

    this.View.init(this, this.students.length)

    this.View.renderTable(this.students)

    this.View.elements.filterHeadCells.forEach(tableHeadCell => {
      tableHeadCell.addEventListener('click', () => {
        this.filteredStudents =
          this.filteredStudents.length === 0 ? this.students : this.filteredStudents
        this.filteredStudents = this.sortStudents(this.filteredStudents, tableHeadCell)
        this.View.renderTable(this.filteredStudents)
      })
    })
    this.View.elements.searchInput.addEventListener('keyup', e => {
      this.filteredStudents = this.searchStudents(this.students, e.target.value)
      this.View.renderTable(this.filteredStudents)
    })

    this.View.elements.searchInput.addEventListener('keyup', e => {
      this.filteredStudents = this.searchStudents(this.students, e.target.value)
      this.View.renderTable(this.filteredStudents)
    })

    const filterTags = this.View.elements.filterTags
    filterTags.forEach(filterTag => {
      filterTag.addEventListener('click', () => {
        const selected = !filterTag.classList.contains('tag--selected')
        if (selected) filterTag.classList.add('tag--selected')
        else filterTag.classList.remove('tag--selected')

        this.filteredStudents = this.filterStudentsByTags(this.students)
        this.View.renderTable(this.filteredStudents)
      })
    })
  },

  filterStudentsByTags(students) {
    const selectedTags = document.querySelectorAll('.tag--selected')
    let filteredStudents = []
    console.log(selectedTags)
    if (selectedTags.length === 0) {
      return students
    }

    selectedTags.forEach(tag => {
      if (tag.dataset.type === 'inclusive') {
        const filterProperty = tag.dataset.property
        const filterValue = tag.dataset.value
        students.forEach(student => {
          console.log(student[filterProperty])
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
  },
  createStudents(studentsData) {
    const students = []
    studentsData.forEach(studentJson => {
      const student = Object.create(this.Student)
      student.name = studentJson.fullname
      student.house = studentJson.house
      student.gender = studentJson.gender
      students.push(student)
    })
    return students
  },
  sortStudents(students, tableHeadCell, sortBy = null) {
    const sortByKey = sortBy ? sortBy : tableHeadCell.dataset.field

    const order = tableHeadCell.dataset.order === 'true'

    tableHeadCell.dataset.order = !order
    if (order) {
      return students.sort((a, b) => sortDownUp(a, b, sortByKey))
    }
    return students.sort((a, b) => sortUpDown(a, b, sortByKey))
  },
  searchStudents(students, searchTerm) {
    return students.filter(
      student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  },
  fetchJSON(url) {
    return fetch(url).then(res => res.json())
  }
}
