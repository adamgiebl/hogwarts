// one modal, and we only change the content inside
const modal = document.querySelector('.modal')

function renderStudentListItem(student) {
  function openModal() {
    modal.classList.remove('hidden')

    // using closure to pass student object into modal
    refreshModal(student)

    function togglePrefect() {
      student.prefect = !student.prefect
      // refresh the modal with new state of the student
      refreshModal(student)
    }
    modal.querySelector('.toggle-prefect-button').addEventListener('click', togglePrefect)
  }
}

function refreshModal(student) {
  // render student info here
}

//alternative with sending an ID

// one modal, and we only change the content inside
const modal = document.querySelector('.modal')

function initModal() {
  function closeModal() {
    modal.classList.add('hidden')
  }
  function openModal() {
    modal.classList.remove('hidden')
  }
  function togglePrefect(studentId) {
    student.prefect = !student.prefect
    // refresh the modal with new state of the student
    refreshModal(studentId)
  }
  modal
    .querySelector('.toggle-prefect-button')
    .addEventListener('click', e => togglePrefect(e.target.dataset.studentId))
}

function refreshModal(studentId) {
  const student = students.find(student => (student.id = studentId))

  // render student info here
}
