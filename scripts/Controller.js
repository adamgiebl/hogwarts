import { filterStudentsByTags, searchStudents, sortStudents } from './filtering.js'
import { getRandomProperty, fetchJSON } from './utils.js'
import { Popup } from './Popup.js'
import { getTheHacker } from './Student.js'

import { HOUSE_TYPES, BLOOD_TYPES, STATUS_TYPES } from './types.js'

export const Controller = {
  students: [],
  filteredStudents: [],
  expelledStudents: [],
  filterOnlyExpelled: false,
  View: null,
  Student: null,
  Popup: null,
  searchTerm: '',
  hasBeenHacked: false,
  async init(View, Student) {
    this.View = View
    this.Student = Student

    this.Popup = Popup

    const GET_STUDENTS = 'https://petlatkea.dk/2021/hogwarts/students.json'
    const GET_FAMILIES = 'https://petlatkea.dk/2021/hogwarts/families.json'
    const studentsData = await fetchJSON(GET_STUDENTS)
    const familiesData = await fetchJSON(GET_FAMILIES)

    this.students = this.createStudents(studentsData, familiesData)

    this.View.init(this)

    this.totalStudentCount = this.students.length

    this.View.renderTable(this.students)

    this.filteredStudents = this.students

    this.addEventListeners()

    this.View.renderDetails(this.students[3])
  },

  applyFilters() {
    const isExpelledSelected = this.isEpxelledFilterSelected()
    const students = isExpelledSelected ? this.expelledStudents : this.students

    const searchedThrough = searchStudents(students, this.searchTerm)
    const filteredByTags = filterStudentsByTags(searchedThrough)
    this.filteredStudents = filteredByTags

    if (this.hasBeenHacked) this.randomizeBloodStatus(students)

    this.View.renderTable(filteredByTags)
  },

  createStudents(studentsData, familiesData) {
    const students = []
    const lastNames = []
    const commonLastNames = []
    studentsData.forEach((studentJson, index) => {
      const student = Object.create(this.Student)
      student.id = index.toString()
      student.name = studentJson.fullname
      student.house = studentJson.house
      student.gender = studentJson.gender
      student.bloodStatus = this.determineBloodStatus(student.lastName, familiesData)
      if (lastNames.includes(student.lastName)) commonLastNames.push(student.lastName)
      lastNames.push(student.lastName)

      students.push(student)
    })

    this.setImageSources(students, commonLastNames)

    return students
  },

  isEpxelledFilterSelected() {
    const selectedTags = [...document.querySelectorAll('.tag--selected')]
    const expelledTag = selectedTags.some(tag => tag.dataset.property === STATUS_TYPES.EXPELLED)
    return expelledTag
  },

  setImageSources(students, commonLastNames) {
    students.forEach(student => {
      if (commonLastNames.includes(student.lastName)) {
        student.hasCommonLastName = true
      }
      const indexOfHyphen = student.lastName.indexOf('-')
      if (indexOfHyphen != -1) {
        student.image = {
          firstName: student.firstName,
          lastName: student.lastName.substring(indexOfHyphen + 1)
        }
        return
      }

      student.image = { firstName: student.firstName, lastName: student.lastName }
    })
  },

  randomizeBloodStatus(students) {
    students.forEach(student => {
      if (student.bloodStatus === BLOOD_TYPES.PURE_BLOOD || student.formerPureBlood) {
        if (!student.formerPureBlood) student.formerPureBlood = true
      } else {
        student.formerNonPureBlood = true
      }
      student.bloodStatus =
        student.formerPureBlood && !student.formerNonPureBlood
          ? getRandomProperty(BLOOD_TYPES)
          : BLOOD_TYPES.PURE_BLOOD
    })
  },

  determineBloodStatus(lastName, families) {
    const half = families.half.includes(lastName)
    const pure = families.pure.includes(lastName)

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
    const res = await this.Popup.getConfirmation(
      {
        title: 'Do you want to expel this student?',
        subTitle: 'This action is irreversible'
      },
      student.id === this.hackerId && this.hasBeenHacked
    )
    if (!res) return

    this.expelledStudents.push(student)
    this.students.splice(indexOfStudent, 1)
    student.isExpelled = true
    this.View.renderDetails(student)
    this.applyFilters()
    this.View.updateFilterTags()
    callback(student.id, STATUS_TYPES.EXPELLED, true)
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
      this.applyFilters(this.searchTerm)
    })
    const filterTags = this.View.elements.filterTags

    const clickFilterTag = filterTag => {
      const selected = !filterTag.classList.contains('tag--selected')
      if (selected) filterTag.classList.add('tag--selected')
      else filterTag.classList.remove('tag--selected')

      this.applyFilters()
    }

    filterTags.forEach(filterTag => {
      filterTag.addEventListener('click', () => clickFilterTag(filterTag))
    })
  },

  async toggleStudentStatus(studentId, status, callback = () => {}, buttonText) {
    const student = this.students.find(student => student.id === studentId)

    if (!student) return console.error('Student not found')

    const isAlreadyTrue = student[status]

    if (
      status === STATUS_TYPES.PREFECT &&
      !isAlreadyTrue &&
      !this.canPrefectBeAdded(student.house)
    ) {
      this.Popup.getConfirmation({
        title: "That won't work.",
        subTitle: 'There are already two prefects in this house. Remove one first.'
      })
      return
    }
    if (
      status === STATUS_TYPES.ISQUAD &&
      !isAlreadyTrue &&
      !this.canBeInquisitorialSquadMember(student)
    ) {
      this.Popup.getConfirmation({
        title: 'This student is not worthy.',
        subTitle:
          'Only Pure-Blooded students or students from Slytherin can be members of the Inquisitorial squad.'
      })
      return
    }

    const res = await this.Popup.getConfirmation({
      title: 'Change status of this student?',
      subTitle: buttonText
    })

    if (status === STATUS_TYPES.ISQUAD && !isAlreadyTrue && this.hasBeenHacked) {
      this.fakeSetInquisitorialSquad(student)
    }

    if (!res) return
    student[status] = !student[status]
    this.View.renderDetails(student)
    this.applyFilters()
    callback(student.id, status, student[status])
  },

  fakeSetInquisitorialSquad(student) {
    setTimeout(() => {
      student.isInquisitor = false
      this.applyFilters()
      const detailTag = document.querySelector('.app__details .tag--inquisitor')

      this.View.runAnimationOnce(detailTag, 'jumpout', () => {
        this.View.renderDetails(student)
      })
    }, 3000)
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

  hackTheSystem() {
    if (this.hasBeenHacked) return
    this.hasBeenHacked = true
    this.hackerId = 'XXX42069'
    const student = getTheHacker(this.hackerId)
    this.students.unshift(student)
    this.View.updateFilterTags()
    this.applyFilters()
  }
}
