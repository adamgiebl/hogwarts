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
  hasCommonLastName: false,
  set name(rawFullName) {
    rawFullName = rawFullName.trim()
    const firstSpaceIndex = rawFullName.indexOf(' ')
    const lastSpaceIndex = rawFullName.lastIndexOf(' ')
    const firstName = rawFullName.slice(0, firstSpaceIndex)
    let lastName = rawFullName.slice(lastSpaceIndex + 1)
    const nickname = rawFullName.substring(
      rawFullName.indexOf('"') + 1,
      rawFullName.lastIndexOf('"')
    )
    const middleName = rawFullName.slice(firstSpaceIndex + 1, lastSpaceIndex)

    let lastNameWithHyphen = ''
    if (lastName.indexOf('-') !== -1) {
      const firstHyphenIndex = lastName.indexOf('-')
      const firstRemainingLetters = lastName.substring(1, firstHyphenIndex).toLowerCase()
      const firstLetterAfterHyphen = lastName
        .substring(firstHyphenIndex + 1, firstHyphenIndex + 2)
        .toUpperCase()
      const secondRemainingLetters = lastName.substring(firstHyphenIndex + 2).toLowerCase()
      const firstLetter = lastName.substring(0, 1).toUpperCase()
      lastNameWithHyphen =
        firstLetter + firstRemainingLetters + '-' + firstLetterAfterHyphen + secondRemainingLetters
    }

    this.firstName = capitalize(firstName)
    this.lastName = lastNameWithHyphen ? lastNameWithHyphen : capitalize(lastName)
    this.nickname = capitalize(nickname)
    this.middleName = middleName.includes('"') ? '' : capitalize(middleName)
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
    return `${this.firstName} ${this.nickname ? `"${this.nickname}"` : ''} ${this.middleName} ${
      this.lastName
    }`
  },
  set image({ firstName, lastName }) {
    this._image = `./images/${lastName.toLowerCase()}_${
      this.hasCommonLastName ? firstName.toLowerCase() : firstName[0].toLowerCase()
    }.png`
  }
}

export const FilterTag = {
  textContent: '',
  filterProperty: '',
  selected: false
}
