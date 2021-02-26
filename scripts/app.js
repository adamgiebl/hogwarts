'use strict'

import { Student } from './Student.js'
import { View } from './View.js'
import { Controller } from './Controller.js'

Controller.init(View, Student)
window.hackTheSystem = Controller.hackTheSystem.bind(Controller)
