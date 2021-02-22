export const View = {
  elements: {},
  Controller: null,
  totalStudentCount: null,

  init(Controller, totalStudentCount) {
    this.Controller = Controller
    this.elements = this.runDOMQueries()
    this.totalStudentCount = totalStudentCount
    this.initDetails()
  },

  renderTable(students = []) {
    this.elements.tableBody.innerHTML = ''
    students.forEach((student, index) => {
      const tableRowClone = this.elements.tableRowTemplate.cloneNode(true)
      const dataCells = this.getDataCells(tableRowClone)
      const currentRow = tableRowClone.children[0]

      currentRow.dataset.studentid = 'id' + student.id
      dataCells.firstName.textContent = student.firstName
      dataCells.lastName.textContent = student.lastName

      const houseTag = this.createTag(student.house, `tag--${student.house.toLowerCase()}`)
      dataCells.house.appendChild(houseTag)
      dataCells.gender.appendChild(this.createGenderTag(student.gender))
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
    this.elements.totalStudentCount.textContent = this.totalStudentCount
    this.elements.resultsCount.textContent = resultsCount
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
    elems.detailsView.querySelector('h3').textContent = student.fullName
    elems.detailsView.querySelector('span').textContent = student.house
    elems.detailsView.querySelector('.image-wrapper img').src = student._image
    elems.bloodStatusLabel.textContent = student.bloodStatus
    elems.genderLabel.textContent = student.gender
    this.elements.buttonExpel.dataset.studentid = student.id
    this.applyHouseColors(student.house)
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
        'isPrefect',
        this.visuallyReflectStatusChange.bind(this),
        buttonPrefect.textContent
      )
    })

    const buttonInquisitor = this.elements.buttonInquisitor
    buttonInquisitor.addEventListener('click', () => {
      this.Controller.toggleStudentStatus(
        buttonExpel.dataset.studentid,
        'isInquisitor',
        this.visuallyReflectStatusChange.bind(this),
        buttonInquisitor.textContent
      )
    })
  },

  createTag(text = '', className = '') {
    const tag = document.createElement('div')
    tag.classList.add(...['tag', className])
    tag.textContent = text
    return tag
  },

  visuallyReflectStatusChange(studentId, status, value) {
    const studentRow = document.querySelector(`.data-row[data-studentid=id${studentId}]`)
    const isExpelled = status === 'isExpelled'
    const animationName = isExpelled ? 'disappear' : 'anime'
    this.runAnimationOnce(studentRow, animationName, () => {
      return isExpelled ? studentRow.remove() : null
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

  createGenderTag(gender = 'boy') {
    const tag = document.createElement('div')
    const className = `tag--${gender.toLowerCase()}`
    tag.classList.add('tag', className)
    tag.textContent = gender
    return tag
  },

  applyHouseColors(house) {
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
      detailsLabel: document.querySelector('.app__details .label'),
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
      detailsTags: document.querySelector('.tags')
    }
  }
}
