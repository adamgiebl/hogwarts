const capitalize = (string) => {
  return (
    string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase()
  );
};

export const Student = {
  firstName: "",
  middleName: "",
  nickname: "",
  lastName: "",
  imgSrc: "",
  house: "",
  bloodStatus: "",
  isPrefect: false,
  isExpelled: false,
  isInquisitor: false,
  setName: function (rawFullName) {
    rawFullName = rawFullName.trim().replace("-", " ");
    const firstSpaceIndex = rawFullName.indexOf(" ");
    const lastSpaceIndex = rawFullName.lastIndexOf(" ");
    const firstName = rawFullName.slice(0, firstSpaceIndex);
    const lastName = rawFullName.slice(lastSpaceIndex + 1);
    const nickname = rawFullName.substring(
      rawFullName.indexOf('"') + 1,
      rawFullName.lastIndexOf('"')
    );
    const middleName = rawFullName.slice(firstSpaceIndex + 1, lastSpaceIndex);

    this.firstName = capitalize(firstName);
    this.lastName = capitalize(lastName);
    this.nickname = capitalize(nickname);
    this.middleName = middleName.includes('"') ? "" : capitalize(middleName);
  },
  setHouse: function (rawHouse) {
    this.house = capitalize(rawHouse.trim());
  },
  setGender: function (gender) {
    this.gender = gender;
  },
};
