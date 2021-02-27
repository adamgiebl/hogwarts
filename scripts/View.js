import { HOUSE_TYPES, STATUS_TYPES } from './types.js'

export const View = {
  elements: {},
  Controller: null,

  init(Controller) {
    this.Controller = Controller
    this.elements = this.runDOMQueries()
    this.initDetails()
    this.updateFilterTags()
  },

  renderTable(students = []) {
    this.elements.tableBody.innerHTML = ''
    students.forEach((student, index) => {
      const tableRowClone = this.elements.tableRowTemplate.cloneNode(true)
      const dataCells = this.getDataCells(tableRowClone)
      const currentRow = tableRowClone.children[0]
      currentRow.dataset.studentid = student.id
      dataCells.firstName.textContent = student.firstName
      dataCells.lastName.textContent = student.lastName

      const houseTag = this.createTag(student.house, `tag--${student.house.toLowerCase()}`)
      dataCells.house.appendChild(houseTag)
      dataCells.gender.appendChild(
        this.createTag(student.gender, `tag--${student.gender.toLowerCase()}`)
      )
      dataCells.rowNumber.textContent = index + 1
      dataCells.house.style.color = `var(--${student.house.toLowerCase()})`

      currentRow.addEventListener('click', () => {
        this.runAnimationOnce(currentRow, 'anime')
        this.renderDetails(student)
      })

      this.elements.tableBody.appendChild(tableRowClone)
    })

    this.updateCount(students.length)
  },

  updateCount(resultsCount) {
    this.elements.totalStudentCount.textContent = this.Controller.totalStudentCount
    this.elements.resultsCount.textContent = resultsCount
  },

  updateFilterTags() {
    this.elements.filterTags.forEach(tag => {
      if (tag.dataset.property === 'house') {
        const filteredByHouse = this.Controller.students.filter(
          stud => stud.house.toLowerCase() === tag.dataset.value.toLowerCase()
        )
        tag.children[0].textContent = filteredByHouse.length
      }
    })
  },

  renderDetails(student) {
    const elems = this.elements
    elems.detailsTags.innerHTML = ''
    if (student.isExpelled) {
      elems.detailsView.classList.add('expelled')
    } else {
      elems.detailsView.classList.remove('expelled')
    }
    if (student.isInquisitor) {
      elems.detailsTags.appendChild(this.createTag('Inquisitorial squad', 'tag--inquisitor'))
      elems.buttonInquisitor.textContent = 'Remove from Inquisitorial squad'
    } else {
      elems.buttonInquisitor.textContent = 'Add to inquisitorial squad'
    }
    if (student.isPrefect) {
      elems.detailsTags.appendChild(this.createTag('Prefect', 'tag--prefect'))
      elems.buttonPrefect.textContent = 'Revoke Prefect status'
    } else {
      elems.buttonPrefect.textContent = 'Make prefect'
    }
    elems.detailsView.classList.add('open')
    elems.detailsName.textContent = student.fullName
    elems.detailsHouse.textContent = student.house

    elems.detailsImage.addEventListener('error', function () {
      this.src = './images/default.png'
    })
    elems.detailsImage.src = student._image

    elems.bloodStatusLabel.textContent = student.bloodStatus
    elems.genderLabel.textContent = student.gender
    this.elements.buttonExpel.dataset.studentid = student.id
    this.applyHouseTheme(student.house)
  },

  initDetails() {
    const buttonClose = this.elements.buttonCloseDetails
    const detailsView = this.elements.detailsView
    buttonClose.addEventListener('click', () => {
      detailsView.classList.remove('open')
    })
    const buttonExpel = this.elements.buttonExpel
    buttonExpel.addEventListener('click', () => {
      this.Controller.expelStudent(
        buttonExpel.dataset.studentid,
        this.visuallyReflectStatusChange.bind(this)
      )
    })

    const buttonPrefect = this.elements.buttonPrefect
    buttonPrefect.addEventListener('click', () => {
      this.Controller.toggleStudentStatus(
        buttonExpel.dataset.studentid,
        STATUS_TYPES.PREFECT,
        this.visuallyReflectStatusChange.bind(this),
        buttonPrefect.textContent
      )
    })

    const buttonInquisitor = this.elements.buttonInquisitor
    buttonInquisitor.addEventListener('click', () => {
      this.Controller.toggleStudentStatus(
        buttonExpel.dataset.studentid,
        STATUS_TYPES.ISQUAD,
        this.visuallyReflectStatusChange.bind(this),
        buttonInquisitor.textContent
      )
    })
  },

  visuallyReflectStatusChange(studentId, status) {
    const studentRow = document.querySelector(`.data-row[data-studentid=id${studentId}]`)
    const hasBeenExpelled = status === STATUS_TYPES.EXPELLED
    const animationName = hasBeenExpelled ? 'disappear' : 'anime'
    this.runAnimationOnce(studentRow, animationName, () => {
      animationName ? studentRow.remove() : null
    })
  },

  runAnimationOnce(element, className, callback = () => {}) {
    if (!element) return
    element.classList.add(className)
    element.addEventListener('animationend', () => {
      element.classList.remove(className)
      callback()
    })
  },

  createTag(text = '', className = '') {
    const tag = document.createElement('div')
    tag.classList.add(...['tag', className])
    tag.textContent = text
    return tag
  },

  applyHouseTheme(house) {
    document.body.className = ''
    document.body.classList.add(house.toLowerCase())
    this.elements.detailsView.className = 'app__details open'
    this.elements.detailsView.classList.add(house.toLowerCase())
    this.elements.detailsLabel.style.background = `var(--${house.toLowerCase()})`
    this.elements.imageWrapper.style.background = `var(--${house.toLowerCase()})`
  },

  getDataCells(row) {
    return {
      rowNumber: row.querySelector('[data-field=rowNumber]'),
      firstName: row.querySelector('[data-field=firstName]'),
      lastName: row.querySelector('[data-field=lastName]'),
      house: row.querySelector('[data-field=house]'),
      gender: row.querySelector('[data-field=gender]')
    }
  },

  runDOMQueries() {
    return {
      filterHeadCells: document.querySelectorAll('th[data-field].filter-cell'),
      filterTags: document.querySelectorAll('.filter-wrapper .tag'),
      tableBody: document.querySelector('.table tbody'),
      tableRowTemplate: document.querySelector('.row-template').content,
      detailsView: document.querySelector('.app__details'),
      detailsName: document.querySelector('.app__details .name'),
      detailsHouse: document.querySelector('.app__details .house'),
      detailsLabel: document.querySelector('.app__details .label'),
      detailsImage: document.querySelector('.app__details .image-wrapper img'),
      searchInput: document.querySelector('.search'),
      imageWrapper: document.querySelector('.image-wrapper'),
      buttonCloseDetails: document.querySelector('.close-details'),
      totalStudentCount: document.querySelector('.total-count-value'),
      resultsCount: document.querySelector('.results-count-value'),
      buttonExpel: document.querySelector('.button--expel'),
      buttonPrefect: document.querySelector('.button--prefect'),
      buttonInquisitor: document.querySelector('.button--inquisitor'),
      bloodStatusLabel: document.querySelector('.blood-status'),
      genderLabel: document.querySelector('.gender'),
      detailsTags: document.querySelector('.tags'),
      app: document.querySelector('.app')
    }
  }
}
