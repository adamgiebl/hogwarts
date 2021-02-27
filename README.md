# Hogwarts assignment

## List of Features

### Data

- ✅ fetch JSON from url
- ✅ clean up the data
- ✅ split full names into columns (first, middle, last, nickname)

### The list

The solution must display a list of students. The list is intended for administrators to get a quick
overview of the students in the current year, and sort, filter, and search for certain properties.

#### Sorting

- ✅ sorting by first name
- ✅ sorting by last name
- ✅ sorting by categories (house, prefects...)

#### Filtering

- ✅ filter by categories (house, prefects...)
- ✅ filter expelled/non-expelled

#### Searching

- ✅ search by first/last name

#### List Interface

- ✅ show number of students in each house
- ✅ total number of students (not expelled)
- ✅ number of students expelled
- ✅ number of students currently displayed

#### Details Interface

- ✅ be able to click on a student and open a details view
- ✅ details view must be themed/decorated with house crest and colors
- details view must show:
  - ✅ first name
  - ✅ middle name
  - ✅ nickname
  - ✅ last name
  - ✅ photo of student
  - ✅ house crest and colors
  - ✅ blood-status
  - ✅ if student is prefect
  - ✅ if student is expelled
  - ✅ if student is member of the inquisitorial squad
- ✅ fix images for Patil
- ✅ fix last name for Finch-Fletchley

### Functionality

#### Expelling

- ✅ be able to expel a student, expelling removes a student from the list
- ✅ expelling cannot be revoked
- ✅ expelling adds a student to a different list

#### Prefects

- ✅ be able to make student a prefect
- ✅ only two students from each house can be selected prefects (boy and a girl)
- ✅ be able to revoke prefect status

#### Blood status

List of families:
https://petlatkea.dk/2021/hogwarts/families.json

- ✅ calculate blood status based on the list
- blood status can be:
  - pure-blooded (pure-wizard)
  - half-blooded (hald-wizard)
  - half-muggle
  - muggle

#### Inquisitorial squad

- ✅ be able to appoint students to the inquisitorial squad, and remove them again
- ✅ any number of students can be appointed
- ✅ only pure-blood or students from Slytherin may be appointed

#### Hacking

- ✅ create hackTheSystem() that activates the hack mode
- ✅ you will be injected with your own name into the list of students
- ✅ you cannot be expelled
- ✅ former pure-bloods will get completely
  random blood-status, whereas half-bloods and muggle-bloods will be listed as pure-blood.
  If you can randomly modify the former pure-bloods on every redisplay (sort or filter)
  of the list, the better!
- ✅ Adding a student to the inquisitorial squad will only work for a limited time, before
  the student is automatically removed again
