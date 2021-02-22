# Hogwarts assignment

## Features

### Data

- [x] fetch JSON from url
- [x] clean up the data
- [x] split full names into columns (first, middle, last, nickname)

### The list

The solution must display a list of students. The list is intended for administrators to get a quick
overview of the students in the current year, and sort, filter, and search for certain properties.

#### Sorting

- [x] sorting by first name
- [x] sorting by last name
- [x] sorting by categories (house, prefects...)

#### Filtering

- [x] filter by categories (house, prefects...)
- [x] filter expelled/non-expelled

#### Searching

- [x] search by first/last name

#### List Interface

- [ ] show number of students in each house
- [x] total number of students (not expelled)
- [x] number of students expelled
- [x] number of students currently displayed

#### Details Interface

- [x] be able to click on a student and open a details view
- [x] details view must be themed/decorated with house crest and colors
- details view must show:
  - [x] first name
  - [x] middle name
  - [x] nickname
  - [x] last name
  - [x] photo of student
  - [x] house crest and colors
  - [x] blood-status
  - [x] if student is prefect
  - [x] if student is expelled
  - [x] if student is member of the inquisitorial squad
- [ ] fix images for Patil
- [ ] fix last name for Finch-Fletchley

### Functionality

#### Expelling

- [x] be able to expel a student, expelling removes a student from the list
- [x] expelling cannot be revoked
- [x] expelling adds a student to a different list

#### Prefects

- [x] be able to make student a prefect
- [x] only two students from each house can be selected prefects (boy and a girl)
- [x] be able to revoke prefect status

#### Blood status

List of families:
https://petlatkea.dk/2021/hogwarts/families.json

- [x] calculate blood status based on the list
- blood status can be:
  - pure-blooded (pure-wizard)
  - half-blooded (hald-wizard)
  - half-muggle
  - muggle

#### Inquisitorial squad

- [x] be able to appoint students to the inquisitorial squad, and remove them again
- [x] any number of students can be appointed
- [x] only pure-blood or students from Slytherin may be appointed
