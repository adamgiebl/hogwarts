import { capitalize } from './utils.js'

export const Student = {
  id: '',
  firstName: '',
  middleName: '',
  nickname: '',
  lastName: '',
  imgSrc: '',
  _house: '',
  bloodStatus: '',
  isPrefect: false,
  isExpelled: false,
  isInquisitor: false,
  set name(rawFullName) {
    rawFullName = rawFullName.trim().replace('-', ' ')
    const firstSpaceIndex = rawFullName.indexOf(' ')
    const lastSpaceIndex = rawFullName.lastIndexOf(' ')
    const firstName = rawFullName.slice(0, firstSpaceIndex)
    const lastName = rawFullName.slice(lastSpaceIndex + 1)
    const nickname = rawFullName.substring(
      rawFullName.indexOf('"') + 1,
      rawFullName.lastIndexOf('"')
    )
    const middleName = rawFullName.slice(firstSpaceIndex + 1, lastSpaceIndex)

    this.firstName = capitalize(firstName)
    this.lastName = capitalize(lastName)
    this.nickname = capitalize(nickname)
    this.middleName = middleName.includes('"') ? '' : capitalize(middleName)
    this.image = { firstName: this.firstName, lastName: this.lastName }
  },
  set house(rawHouse) {
    this._house = capitalize(rawHouse.trim())
  },
  get house() {
    return this._house
  },
  set gender(gender) {
    this._gender = capitalize(gender)
  },
  get gender() {
    return this._gender
  },
  get fullName() {
    return `${this.firstName} ${this.nickname ? this.nickname : ''} ${this.middleName} ${
      this.lastName
    }`
  },
  set image({ firstName, lastName }) {
    this._image = `./images/${lastName.toLowerCase()}_${firstName[0].toLowerCase()}.png`
  }
}

export const FilterTag = {
  textContent: '',
  filterProperty: '',
  selected: false
}
