export const View = {
  elements: {},
  Controller: null,

  init(Controller) {
    this.Controller = Controller
    this.elements = this.runDOMQueries()
  },

  renderTable(students) {
    this.elements.tableBody.innerHTML = ''

    students.forEach((student, index) => {
      const tableRowClone = this.elements.tableRowTemplate.cloneNode(true)
      const dataCells = this.getDataCells(tableRowClone)
      const currentRow = tableRowClone.children[0]
      dataCells.firstName.textContent = student.firstName
      dataCells.lastName.textContent = student.lastName

      const houseTag = this.createTag(student.house, `var(--${student.house.toLowerCase()})`)
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
  },

  renderDetails(student) {
    const detailsView = this.elements.detailsView
    detailsView.classList.add('open')
    detailsView.querySelector('h3').textContent = student.fullName
    detailsView.querySelector('span').textContent = student.house
    detailsView.querySelector('img').src = student._image
    this.applyLabel(student.house)
  },

  createTag(text = '', color = '') {
    const tag = document.createElement('div')
    tag.classList.add('tag')
    tag.textContent = text
    tag.style.background = color
    return tag
  },

  runAnimationOnce(element, className) {
    element.classList.add(className)
    element.addEventListener('animationend', () => {
      element.classList.remove(className)
    })
  },

  createGenderTag(gender = 'boy') {
    const tag = document.createElement('div')
    const className = `tag--${gender}`
    tag.classList.add('tag', className)
    tag.textContent = gender
    return tag
  },

  applyLabel(house) {
    this.elements.detailsLabel.style.background = `var(--${house.toLowerCase()})`
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
      filterHeadCells: document.querySelectorAll('th[data-field]'),
      tableBody: document.querySelector('.table tbody'),
      tableRowTemplate: document.querySelector('.row-template').content,
      detailsView: document.querySelector('.app__details'),
      detailsLabel: document.querySelector('.app__details .label')
    }
  }
}
