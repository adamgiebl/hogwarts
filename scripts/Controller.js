import { sortDownUp, sortUpDown } from './utils.js'

export const Controller = {
  students: [],
  View: null,
  Student: null,
  async init(View, Student) {
    this.View = View
    this.Student = Student
    this.View.init(this)

    const GET_STUDENTS = 'https://petlatkea.dk/2021/hogwarts/students.json'
    const studentsData = await this.fetchJSON(GET_STUDENTS)

    this.students = this.createStudents(studentsData)

    this.View.renderTable(this.students)

    this.View.elements.filterHeadCells.forEach(tableHeadCell => {
      tableHeadCell.addEventListener('click', () => {
        const newStudents = this.sortStudents(this.students, tableHeadCell)
        this.View.renderTable(newStudents)
      })
    })
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
  fetchJSON(url) {
    return fetch(url).then(res => res.json())
  }
}
