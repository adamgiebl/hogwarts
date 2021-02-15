import { Student } from "./models/Student.js";

async function init() {
  const GET_STUDENTS = "https://petlatkea.dk/2021/hogwarts/students.json";

  const studentsData = await fetch(GET_STUDENTS).then((res) => res.json());

  let students = createStudents(studentsData);

  renderTable(students);

  document.querySelectorAll("th[data-field]").forEach((tableHeadCell) => {
    tableHeadCell.addEventListener("click", () => {
      const newStudents = sortStudents(students, tableHeadCell);
      console.log(newStudents);
      renderTable(newStudents);
    });
  });
}

function createStudents(studentsData) {
  const students = [];
  studentsData.forEach((studentJson) => {
    const student = Object.create(Student);
    student.name = studentJson.fullname;
    student.house = studentJson.house;
    student.gender = studentJson.gender;
    students.push(student);
  });
  return students;
}

function renderTable(students) {
  const studentTable = document.querySelector(".table tbody");
  const rowTemplate = document.querySelector(".row-template").content;

  studentTable.innerHTML = "";

  students.forEach((student, index) => {
    const rowClone = rowTemplate.cloneNode(true);
    rowClone.querySelector("[data-field=firstname]").textContent =
      student.firstName;
    rowClone.querySelector("[data-field=lastname]").textContent =
      student.lastName;
    rowClone.querySelector("[data-field=house]").textContent = student.house;
    rowClone.querySelector("[data-field=gender]").textContent = student.gender;
    rowClone.querySelector("[data-field=rownumber]").textContent = index + 1;
    rowClone.querySelector(
      "[data-field=house]"
    ).style.color = `var(--${student.house.toLowerCase()})`;

    rowClone.querySelector(".data-row").addEventListener("click", function (e) {
      this.classList.add("anime");
      this.addEventListener("animationend", () => {
        this.classList.remove("anime");
      });
      renderDetails(student);
    });
    studentTable.appendChild(rowClone);
  });
}

function sortStudents(students, tableHeadCell, sortBy = null) {
  const sortByKey = sortBy ? sortBy : tableHeadCell.dataset.field;

  const order = tableHeadCell.dataset.order === "true";

  tableHeadCell.dataset.order = !order;
  console.log(order);
  if (order) {
    return students.sort((a, b) => sortDownUp(a, b, sortByKey));
  }
  return students.sort((a, b) => sortUpDown(a, b, sortByKey));
}

function sortUpDown(a, b, sortBy) {
  if (a[sortBy] < b[sortBy]) {
    return -1;
  }
  if (a[sortBy] > b[sortBy]) {
    return 1;
  }
  return 0;
}

function sortDownUp(a, b, sortBy) {
  if (a[sortBy] > b[sortBy]) {
    return -1;
  }
  if (a[sortBy] < b[sortBy]) {
    return 1;
  }
  return 0;
}

function renderDetails(student) {
  const detailsView = document.querySelector(".app__details");
  detailsView.querySelector("h3").textContent = student.fullName;
  detailsView.querySelector("span").textContent = student.house;
  detailsView.querySelector("img").src = student._image;
}

init();
