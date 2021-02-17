"use strict";

import { Student } from "./Student.js";
import { View } from "./View.js";
import { Controller } from "./Controller.js";

(function () {
  Controller.init(View, Student);
})();
