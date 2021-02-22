import { filterStudentsByTags, searchStudents, sortStudents } from './filtering.js'
import { HOUSE_TYPES, BLOOD_TYPES } from './types.js'

import { Popup } from './Popup.js'

export const Controller = {
  students: [],
  filteredStudents: [],
  expelledStudents: [],
  filterOnlyExpelled: false,
  View: null,
  Student: null,
  Popup: null,
  searchTerm: '',
  async init(View, Student) {
    this.View = View
    this.Student = Student

    this.Popup = Popup
    window.APP = {}
    const GET_STUDENTS = 'https://petlatkea.dk/2021/hogwarts/students.json'
    const GET_FAMILIES = 'https://petlatkea.dk/2021/hogwarts/families.json'
    const studentsData = await this.fetchJSON(GET_STUDENTS)
    const familiesData = await this.fetchJSON(GET_FAMILIES)

    this.students = this.createStudents(studentsData, familiesData)

    this.View.init(this, this.students.length)

    this.View.renderTable(this.students)

    this.filteredStudents = this.students

    this.addEventListeners()

    this.View.renderDetails(this.students[3])
  },

  applyFilters() {
    const students = this.filterOnlyExpelled ? this.expelledStudents : this.students

    const searchedThrough = searchStudents(students, this.searchTerm)
    const filteredByTags = filterStudentsByTags(searchedThrough)
    this.filteredStudents = filteredByTags
    this.View.renderTable(filteredByTags)
  },

  refreshTable() {
    this.filteredStudents = filterStudentsByTags(this.students)
    this.View.renderTable(this.filteredStudents)
  },

  createStudents(studentsData, familiesData) {
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
      return BLOOD_TYPES.HALF_BLOOD
    } else if (half) {
      return BLOOD_TYPES.HALF_BLOOD
    } else if (pure) {
      return BLOOD_TYPES.PURE_BLOOD
    } else {
      return BLOOD_TYPES.MUGGLE
    }
  },

  async expelStudent(studentId, callback = () => {}) {
    const student = this.students.find(student => student.id === studentId)
    const indexOfStudent = this.students.indexOf(student)
    if (!student) return console.error('Student not found')

    const res = await this.Popup.getConfirmation({
      title: 'Do you want to expel this student?',
      subTitle: 'This action is irreversible'
    })
    if (!res) return

    this.expelledStudents.push(student)
    this.students.splice(indexOfStudent, 1)
    console.log('User has been removed from students.')
    student.isExpelled = true
    this.View.renderDetails(student)
    callback(student.id, 'isExpelled', true)
  },

  addEventListeners() {
    this.View.elements.filterHeadCells.forEach(tableHeadCell => {
      tableHeadCell.addEventListener('click', () => {
        this.filteredStudents = sortStudents(this.filteredStudents, tableHeadCell)
        this.View.renderTable(this.filteredStudents)
      })
    })
    this.View.elements.searchInput.addEventListener('keyup', e => {
      this.searchTerm = e.target.value
      this.applyFilters(e.target.value)
    })
    const filterTags = this.View.elements.filterTags
    filterTags.forEach(filterTag => {
      filterTag.addEventListener('click', () => {
        const selected = !filterTag.classList.contains('tag--selected')
        if (selected) filterTag.classList.add('tag--selected')
        else filterTag.classList.remove('tag--selected')

        const tagIsExpelled = filterTag.dataset.property === 'isExpelled'
        if (tagIsExpelled) {
          this.filterOnlyExpelled = selected
        }
        this.applyFilters()
      })
    })
  },

  async toggleStudentStatus(studentId, status, callback = () => {}, buttonText) {
    const student = this.students.find(student => student.id === studentId)

    if (!student) return console.error('Student not found')

    if (status === 'isPrefect' && !student[status] && !this.canPrefectBeAdded(student.house)) {
      this.Popup.getConfirmation({
        title: "That won't work.",
        subTitle: 'There are already two prefects in this house. Remove one first.'
      })
      console.warn('Two prefects are already in this house.')
      return
    }
    if (
      status === 'isInquisitor' &&
      !student[status] &&
      !this.canBeInquisitorialSquadMember(student)
    ) {
      this.Popup.getConfirmation({
        title: 'This student is not worthy.',
        subTitle:
          'Only Pure-Blooded students or students from Slytherin can be members of the Inquisitorial squad.'
      })
      console.warn('This student is not worthy of the Inquisitorial squad.')
      return
    }

    const res = await this.Popup.getConfirmation({
      title: 'Change status of this student?',
      subTitle: buttonText
    })
    if (!res) return
    student[status] = !student[status]
    console.log('Student status changed: ', { [status]: student[status] })
    this.View.renderDetails(student)
    callback(student.id, status, student[status])
  },

  canBeInquisitorialSquadMember(student) {
    return student.house === HOUSE_TYPES.SLYTHERIN || student.bloodStatus === BLOOD_TYPES.PURE_BLOOD
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
