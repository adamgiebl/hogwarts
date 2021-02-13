import { Student } from "./models/Student.js";

const GET_STUDENTS = "https://petlatkea.dk/2021/hogwarts/students.json";
const studentTable = document.querySelector(".student-table tbody");
const rowTemplate = document.querySelector(".student-row-template").content;

async function init() {
  const fetchPromise = await fetch(GET_STUDENTS);
  const studentsData = await fetchPromise.json();
  const students = [];

  studentsData.forEach((studentJson) => {
    const student = Object.create(Student);
    student.setName(studentJson.fullname);
    student.setHouse(studentJson.house);
    student.setGender(studentJson.gender);
    students.push(student);
  });

  renderTable(students);
}

function renderTable(students) {
  students.forEach((student) => {
    const rowClone = rowTemplate.cloneNode(true);
    rowClone.querySelector("[data-field=firstname]").textContent =
      student.firstName;
    rowClone.querySelector("[data-field=lastname]").textContent =
      student.lastName;
    rowClone.querySelector("[data-field=middlename]").textContent =
      student.middleName;
    rowClone.querySelector("[data-field=house]").textContent = student.house;
    rowClone.querySelector("[data-field=gender]").textContent = student.gender;
    studentTable.appendChild(rowClone);
  });
}

init();
