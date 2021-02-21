export const Popup = {
  element: null,
  OUTCOMES: {
    CONFIRM: 'confirm',
    CANCEL: 'cancel'
  },
  appendPopup: function (config) {
    const previousPopup = document.querySelector('.popup-background')
    if (previousPopup) previousPopup.remove()
    this.element = this.createPopup(config)
    document.body.appendChild(this.element)
  },
  getConfirmation: async function (config) {
    return new Promise((resolve, reject) => {
      this.appendPopup(config)
      this.element.addEventListener('click', e => {
        if (e.target === this.element) {
          this.element.classList.add('hidden')
          resolve(false)
        }
      })
      this.element.querySelector('.popup__confirm').addEventListener('click', e => {
        this.element.classList.add('hidden')
        resolve(true)
      })
      this.element.querySelector('.popup__cancel').addEventListener('click', e => {
        this.element.classList.add('hidden')
        resolve(false)
      })
    })
  },
  createPopup: function ({ title, subTitle }) {
    const background = document.createElement('div')
    background.classList.add('popup-background')

    const container = document.createElement('div')
    container.classList.add('popup')
    const heading = document.createElement('h3')
    heading.classList.add('popup__title')
    heading.textContent = title || 'Are you sure?'
    const subHeading = document.createElement('p')
    subHeading.classList.add('popup__subtitle')
    subHeading.textContent = subTitle || ''
    const buttons = document.createElement('div')
    buttons.classList.add('popup__buttons')
    const buttonConfirm = document.createElement('button')
    const buttonCancel = document.createElement('button')
    buttonConfirm.classList.add('popup__confirm')
    buttonConfirm.textContent = 'Confirm'
    buttonCancel.classList.add('popup__cancel')
    buttonCancel.textContent = 'Cancel'
    buttons.append(buttonCancel, buttonConfirm)
    container.append(heading, subHeading, buttons)
    background.appendChild(container)

    return background
  }
}
