import { filterStudentsByTags, searchStudents, sortStudents } from './filtering.js'

export const Controller = {
  students: [],
  filteredStudents: [],
  View: null,
  Student: null,
  async init(View, Student) {
    this.View = View
    this.Student = Student

    const GET_STUDENTS = 'https://petlatkea.dk/2021/hogwarts/students.json'
    const GET_FAMILIES = 'https://petlatkea.dk/2021/hogwarts/families.json'
    const studentsData = await this.fetchJSON(GET_STUDENTS)
    const familiesData = await this.fetchJSON(GET_FAMILIES)

    this.students = this.createStudents(studentsData, familiesData)

    this.students[2].isPrefect = true
    this.students[6].isPrefect = true
    this.students[8].isPrefect = true
    this.students[15].isPrefect = true
    this.students[26].isPrefect = true
    this.students[13].isPrefect = true
    this.students[26].isInquisitor = true
    this.students[13].isInquisitor = true

    this.View.init(this, this.students.length)

    this.View.renderTable(this.students)

    this.View.elements.filterHeadCells.forEach(tableHeadCell => {
      tableHeadCell.addEventListener('click', () => {
        this.filteredStudents =
          this.filteredStudents.length === 0 ? this.students : this.filteredStudents
        this.filteredStudents = sortStudents(this.filteredStudents, tableHeadCell)
        this.View.renderTable(this.filteredStudents)
      })
    })
    this.View.elements.searchInput.addEventListener('keyup', e => {
      this.filteredStudents = searchStudents(this.students, e.target.value)
      this.View.renderTable(this.filteredStudents)
    })

    const filterTags = this.View.elements.filterTags
    filterTags.forEach(filterTag => {
      filterTag.addEventListener('click', () => {
        const selected = !filterTag.classList.contains('tag--selected')
        if (selected) filterTag.classList.add('tag--selected')
        else filterTag.classList.remove('tag--selected')

        this.filteredStudents = filterStudentsByTags(this.students)
        this.View.renderTable(this.filteredStudents)
      })
    })

    this.View.renderDetails(this.students[3])
  },

  refreshTable() {
    this.filteredStudents = filterStudentsByTags(this.students)
    this.View.renderTable(this.filteredStudents)
  },

  createStudents(studentsData, familiesData) {
    console.log(familiesData)
    const students = []
    studentsData.forEach((studentJson, index) => {
      const student = Object.create(this.Student)
      student.id = index.toString()
      student.name = studentJson.fullname
      student.house = studentJson.house
      student.gender = studentJson.gender
      student.bloodStatus = this.determineBloodStatus(student.lastName, familiesData)
      students.push(student)
    })
    return students
  },

  determineBloodStatus(lastName, families) {
    const half = families.half.find(
      familyName => lastName.toLowerCase() === familyName.toLowerCase()
    )
    const pure = families.pure.find(
      familyName => lastName.toLowerCase() === familyName.toLowerCase()
    )

    if (half && pure) {
      return 'Half-Blood'
    } else if (half) {
      return 'Half-Blood'
    } else if (pure) {
      return 'Pure-Blood'
    } else {
      return 'Muggle'
    }
  },

  setStudentStatus(studentId, status, value, callback = () => {}) {
    const student = this.students.find(student => student.id === studentId)
    if (!student) return console.error('Student not found')
    student[status] = value
    this.View.renderDetails(student)
    callback(student.id, status, student[status])
  },

  toggleStudentStatus(studentId, status, callback = () => {}) {
    const student = this.students.find(student => student.id === studentId)

    if (!student) return console.error('Student not found')

    if (status === 'isPrefect' && !student[status] && !this.canPrefectBeAdded(student.house)) {
      console.warn('Two prefects are already in this house.')
      return
    }

    student[status] = !student[status]
    console.log('Student status changed: ', { [status]: student[status] })
    this.View.renderDetails(student)
    callback(student.id, status, student[status])
  },

  canPrefectBeAdded(house) {
    const prefectsInHouse = this.students.filter(
      student => student.house === house && student.isPrefect
    )
    return prefectsInHouse.length < 2
  },

  fetchJSON(url) {
    return fetch(url).then(res => res.json())
  }
}
