// main arrays to hold students and courses
const studentArray = [];
const courseArray = [];

// point scales for grades
const tenPointScale = {
  A: [90, 100],
  B: [80, 89],
  C: [70, 79],
  D: [60, 69],
  F: [0, 59],
};
const sevenPointScale = {
  A: [93, 100],
  B: [85, 92],
  C: [77, 84],
  D: [70, 76],
  F: [0, 69],
};

// helper functions

// Adds a new student to the studentArray
function addStudent(id, name, surname) {
  studentArray.push({
    id,
    name: name.trim(),
    surname: surname.trim(),
    takenCourses: [], // initially, no courses taken
  });
}

// Adds a new course to the courseArray
function addCourse(id, name, typeOfPointScale) {
  courseArray.push({
    id,
    name: name.trim(),
    typeOfPointScale,
    enrolledStudents: [], // initially, no students enrolled
  });
}

// Finds a student by their ID
const findStudent = (studentId) => {
  const student = studentArray.find((student) => student.id === studentId);
  if (!student) {
    alert("Student cannot be found");
    return null;
  }
  return student;
};

// Finds a course by its ID
const findCourse = (courseId) => {
  const course = courseArray.find((course) => course.id === courseId);
  if (!course) {
    alert("Course cannot be found");
    return null;
  }
  return course;
};

// Finds a course taken by a student, given studentId and courseId
const findTakenCourse = (studentId, courseId) => {
  const takenCourse = findStudent(studentId).takenCourses.find(
    (course) => course.id === courseId
  );
  if (!takenCourse) {
    alert("Course cannot be found");
    return null;
  }
  return takenCourse;
};

// Finds a student enrolled in a specific course by studentId and courseId
const findEnrolledStudent = (courseId, studentId) => {
  const enrolledStudent = findCourse(courseId).enrolledStudents.find(
    (student) => student.id === studentId
  );
  if (!enrolledStudent) {
    alert("Student cannot be found");
    return null;
  }
  return enrolledStudent;
};

// Finds a student by their full name (first and last name)
function findStudentByName(fullName) {
  return studentArray.find(
    (student) =>
      (student.name.trim() + " " + student.surname.trim()).toLowerCase() ===
      fullName.trim().toLowerCase()
  );
}

// Deletes a student from studentArray and removes them from enrolled courses
const deleteStudent = (studentId) => {
  const studentIndex = studentArray.findIndex(
    (student) => student.id === studentId
  );
  const takenCourses = findStudent(studentId).takenCourses;

  // Remove student from all courses they are enrolled in
  for (const course of takenCourses) {
    findCourse(course.id).enrolledStudents = findCourse(
      course.id
    ).enrolledStudents.filter((student) => student.id !== studentId);
  }

  // Remove the student from the student array
  if (studentIndex !== -1) {
    studentArray.splice(studentIndex, 1);
  }
};

// Calculates the term score based on midterm and final scores
function calculateTermScore(midtermScore, finalScore) {
  if (
    midtermScore > 100 ||
    midtermScore < 0 ||
    finalScore > 100 ||
    finalScore < 0
  ) {
    alert("Please enter scores between 0 and 100");
    return null;
  }
  // 40% midterm and 60% final
  return midtermScore * 0.4 + finalScore * 0.6;
}

// Calculates the letter grade based on term score and point scale type
function calculateLetterGrade(midtermScore, finalScore, typeOfPointScale) {
  const termScore = calculateTermScore(midtermScore, finalScore);
  if (typeOfPointScale === "tenPointScale") {
    // Check grade range for the 10-point scale
    for (const grade in tenPointScale) {
      if (
        termScore >= tenPointScale[grade][0] &&
        termScore <= tenPointScale[grade][1]
      ) {
        return grade;
      }
    }
  } else if (typeOfPointScale === "sevenPointScale") {
    // Check grade range for the 7-point scale
    for (const grade in sevenPointScale) {
      if (
        termScore >= sevenPointScale[grade][0] &&
        termScore <= sevenPointScale[grade][1]
      ) {
        return grade;
      }
    }
  }
}

// Calculates GPA for a student based on the courses they have taken
const calculateGPA = (studentId) => {
  const student = findStudent(studentId);
  if (student) {
    // Sum up the term scores for all taken courses and divide by the number of courses
    const totalTermScore = student.takenCourses.reduce(
      (total, course) =>
        total + calculateTermScore(course.midtermScore, course.finalScore),
      0
    );
    const totalTermScoreCount = student.takenCourses.length;
    return totalTermScore / totalTermScoreCount;
  }
  return null;
};

// Gets the selected course ID from the dropdown menu
const selectedCourseIdFromDropdown = () => {
  const selectedCourseId = parseInt(courseIdDropdown.value);
  return selectedCourseId;
};

// DOM elements for displaying and interacting with courses and students
const coursesTable = document.querySelector("#courses-table");
const studentCoursesTable = document.querySelector("#student-courses");
const showCoursesTableBtn = document.querySelector("#showCoursesTableBtn");
const showStudentCoursesTableBtn = document.querySelector(
  "#showStudentCoursesTableBtn"
);
const assignStudentSection = document.getElementById("assign-student-section");
const assignButton = document.getElementById(
  "assign-student-to-course-button-display"
);
const courseIdDropdown = document.getElementById("courseSelect");
const studentNameInputField = document.querySelector("#studentNameInput");
const gpaResultField = document.querySelector("#gpaResult");
const searchStudentCoursesButton = document.querySelector(
  "#searchStudentCoursesBtn"
);

// Function to populate the course table with student data
const populateCourseTable = (courseId) => {
  const tableBody = document.querySelector("#courseTable tbody");
  tableBody.innerHTML = ""; // Clear existing table rows

  // Exit if no course ID is provided
  if (!courseId) return;

  const course = findCourse(courseId); // Find the course by its ID

  // Exit if the course is not found
  if (!course) return;

  // Loop through each student enrolled in the course
  course.enrolledStudents.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name} ${student.surname}</td>
      <td>${student.midtermScore}</td>
      <td>${student.finalScore}</td>
      <td>${calculateTermScore(student.midtermScore, student.finalScore)}</td>
      <td>${calculateLetterGrade(
        student.midtermScore,
        student.finalScore,
        course.typeOfPointScale
      )}</td>
     <td>
        <button class="delete-btn" data-student-id="${
          student.id
        }" data-course-id="${course.id}">X</button>
        <button class="update-btn" data-student-id="${
          student.id
        }" data-course-id="${course.id}">Update</button>
        
      </td>
    `;
    tableBody.appendChild(row); // Add the row to the table
  });

  // Add event listener for delete buttons
  document.querySelectorAll(".delete-btn").forEach((button) =>
    button.addEventListener("click", (event) => {
      const studentId = parseInt(event.target.getAttribute("data-student-id"));
      const courseId = parseInt(event.target.getAttribute("data-course-id"));

      // Validate the IDs
      if (isNaN(studentId) || isNaN(courseId)) {
        alert("Enter a valid ID");
        return;
      }

      // Call function to delete student from course and refresh the table
      deleteStudentFromCourseAndRefresh(studentId, courseId);
      updateForm.style.display = "none"; // Hide the update form after deletion
    })
  );

  // Add event listener for update buttons
  document.querySelectorAll(".update-btn").forEach((button) =>
    button.addEventListener("click", (event) => {
      const studentId = parseInt(event.target.getAttribute("data-student-id"));
      const courseId = parseInt(event.target.getAttribute("data-course-id"));

      // Validate the IDs
      if (isNaN(studentId) || isNaN(courseId)) {
        alert("Enter a valid ID");
        return;
      }

      // Open the update form with the student and course information
      openUpdateForm(studentId, courseId);
    })
  );
};

// Function to populate the dropdown menu with available courses
const populateCourseDropdown = () => {
  const courseSelect = document.getElementById("courseSelect");

  // Loop through the courses and create an option for each course
  courseArray.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.name;
    courseSelect.appendChild(option); // Add the option to the dropdown
  });
};

// Function to populate the student's courses table
const populateStudentCoursesTable = (studentId) => {
  const tableBody = document.querySelector("#studentCoursesTable tbody");
  tableBody.innerHTML = ""; // Clear any previous results

  const student = findStudent(studentId); // Find the student by their ID

  // Alert if student is not found
  if (!student) {
    alert("Student not found.");
    return;
  }

  // Loop through the student's taken courses and populate the table
  student.takenCourses.forEach((course) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.name}</td>
      <td>${student.id}</td>
      <td>${course.midtermScore}</td>
      <td>${course.finalScore}</td>
    `;
    tableBody.appendChild(row); // Add the row to the table
  });
};

// Handle adding a new student
const handleAddStudent = () => {
  const studentId = parseInt(document.getElementById("student-id").value);

  // Validate student ID
  if (isNaN(studentId)) {
    alert("Enter a valid ID");
    return;
  }

  // Check if student ID already exists
  if (findStudent(studentId)) {
    alert("Can't be more than one student with the same ID");
    return;
  }

  // Retrieve student name and surname and add the student
  const studentName = document.getElementById("student-name").value;
  const studentSurname = document.getElementById("student-surname").value;
  addStudent(studentId, studentName, studentSurname);
};

// Handle adding a new course
const handleAddCourse = () => {
  const courseId = parseInt(document.getElementById("course-id").value);

  // Validate course ID
  if (isNaN(courseId)) {
    alert("Enter a valid ID");
    return;
  }

  // Check if course ID already exists
  if (findCourse(courseId)) {
    alert("Can't be more than one course with the same ID");
    return;
  }

  // Retrieve course name and point scale, then add the course
  const courseName = document.getElementById("course-name").value;
  const pointScale = document.getElementById("course-scale").value;
  addCourse(courseId, courseName, pointScale);

  // Refresh the course dropdown after adding a new course
  populateCourseDropdown();
};

// Handle assigning a student to a course
const handleAssignStudent = () => {
  const studentId = parseInt(
    document.getElementById("assign-student-id").value
  );

  // Validate student ID
  if (isNaN(studentId)) {
    alert("Enter a valid ID");
    return;
  }

  // Retrieve midterm and final scores
  const midtermScore = parseFloat(
    document.getElementById("midterm-score").value
  );
  const finalScore = parseFloat(document.getElementById("final-score").value);

  // Validate scores
  if (isNaN(midtermScore) || isNaN(finalScore)) {
    alert("Enter a valid score");
    return;
  }

  // Ensure scores are within valid range
  if (
    midtermScore > 100 ||
    midtermScore < 0 ||
    finalScore > 100 ||
    finalScore < 0
  ) {
    alert("Please enter scores between 0 and 100");
    return null;
  }

  // Assign the student to the course and set the letter grade
  assignStudentToCourseAndSetLetterGrade(studentId, midtermScore, finalScore);
};

// DOM Events Section

// Add event listener to the "Add Student" button
document
  .getElementById("add-student-button")
  .addEventListener("click", handleAddStudent);

// Add event listener to the "Add Course" button
document
  .getElementById("add-course-button")
  .addEventListener("click", handleAddCourse);

// Toggle the visibility of the student assignment section
assignButton.addEventListener("click", () => {
  // Check if the section is hidden or displayed and toggle accordingly
  if (assignStudentSection.style.display === "none") {
    assignStudentSection.style.display = "block";
  } else {
    assignStudentSection.style.display = "none";
  }
});

// Add event listener to the "Assign Student" button
document
  .getElementById("assign-student-button")
  .addEventListener("click", handleAssignStudent);

// Update course table when a course is selected from the dropdown
courseIdDropdown.addEventListener("change", () => {
  const selectedCourseId = selectedCourseIdFromDropdown();
  populateCourseTable(selectedCourseId); // Refresh the course table with the selected course's students
});

// Handle search for a student by name and display their enrolled courses
searchStudentCoursesButton.addEventListener("click", () => {
  const studentNameInput = studentNameInputField.value.trim();

  // Validate that the student name is provided
  if (!studentNameInput) {
    alert("Please enter a valid Student Name.");
    return;
  }

  // Find the student by name and handle cases where the student is not found
  const studentId = findStudentByName(studentNameInput).id;
  if (!studentId) {
    alert("Student cannot be found.");
    return;
  }

  // Populate the student's enrolled courses table and GPA
  populateStudentCoursesTable(studentId);
  const gpa = calculateGPA(studentId);
  gpaResultField.textContent = gpa ? gpa : "N/A"; // Display the GPA, or N/A if not available
});

// Show detailed course information when the "Detailed View" button is clicked
document.querySelector("#detailedViewBtn").addEventListener("click", () => {
  showCourseDetails(selectedCourseIdFromDropdown());
});

// Toggle between displaying the courses table and student courses table
showCoursesTableBtn.addEventListener("click", () => {
  coursesTable.style.display = "block"; // Show the courses table
  studentCoursesTable.style.display = "none"; // Hide the student courses table
});

showStudentCoursesTableBtn.addEventListener("click", () => {
  coursesTable.style.display = "none"; // Hide the courses table
  studentCoursesTable.style.display = "block"; // Show the student courses table
});

// Function to update a student's information, including scores and name
function updateStudentInformation(
  studentId,
  name,
  surname,
  courseId,
  midtermScore,
  finalScore
) {
  // Validate that midterm and final scores are numbers
  if (isNaN(midtermScore) || isNaN(finalScore)) {
    alert("Please enter a valid score");
    return;
  }

  // Ensure that scores are within the valid range
  if (
    midtermScore > 100 ||
    midtermScore < 0 ||
    finalScore > 100 ||
    finalScore < 0
  ) {
    alert("Please enter scores between 0 and 100");
    return null;
  }

  const student = findStudent(studentId); // Find the student by ID
  const takenCourse = findTakenCourse(studentId, courseId); // Find the course the student is enrolled in

  if (student) {
    // Update the student's scores if the course exists
    if (takenCourse) {
      if (midtermScore !== undefined) takenCourse.midtermScore = midtermScore;
      if (finalScore !== undefined) takenCourse.finalScore = finalScore;

      // Update scores in the course's enrolled students list
      const course = findCourse(courseId);
      if (course) {
        const enrolledStudent = course.enrolledStudents.find(
          (s) => s.id === studentId
        );
        if (enrolledStudent) {
          if (midtermScore !== undefined)
            enrolledStudent.midtermScore = midtermScore;
          if (finalScore !== undefined) enrolledStudent.finalScore = finalScore;
          if (name !== undefined) enrolledStudent.name = name;
          if (surname !== undefined) enrolledStudent.surname = surname;
        }
      }
    }
  }
}

// Function to assign a student to a course with scores
function assignStudentToCourse(studentId, midtermScore, finalScore) {
  // Ensure a course is selected from the dropdown
  if (!selectedCourseIdFromDropdown()) {
    return;
  }

  // Validate student ID and score values
  if (isNaN(studentId)) {
    alert("Enter a valid ID");
    return;
  }
  if (isNaN(midtermScore) || isNaN(finalScore)) {
    alert("Enter a valid score");
    return;
  }
  if (
    midtermScore > 100 ||
    midtermScore < 0 ||
    finalScore > 100 ||
    finalScore < 0
  ) {
    alert("Please enter scores between 0 and 100");
    return null;
  }

  // Get the selected course ID and find the student and course
  const courseId = selectedCourseIdFromDropdown();
  const student = findStudent(studentId);
  const course = findCourse(courseId);

  if (student && course) {
    // Add the student to the course's enrolled students and the student's taken courses list
    student.takenCourses.push({
      id: courseId,
      name: course.name,
      midtermScore,
      finalScore,
      typeOfPointScale: course.typeOfPointScale,
    });
    course.enrolledStudents.push({
      id: studentId,
      name: student.name,
      surname: student.surname,
      midtermScore,
      finalScore,
    });
  }
}

// Function to remove a student from a course
function removeStudentFromCourse(studentId, courseId) {
  const student = findStudent(studentId);
  const course = findCourse(courseId);

  if (student && course) {
    // Remove the student from the course and the course from the student's taken courses
    student.takenCourses = student.takenCourses.filter(
      (course) => course.id !== courseId
    );
    course.enrolledStudents = course.enrolledStudents.filter(
      (student) => student.id !== studentId
    );
  }
}

// Function to set a student's letter grade based on their scores in a course
function setStudentLetterGrade(studentId, courseId) {
  const student = findStudent(studentId);
  const course = findCourse(courseId);

  if (student && course) {
    // Find the scores for the student's course
    const { midtermScore, finalScore, typeOfPointScale } =
      student.takenCourses.find((course) => course.id === courseId);

    // Calculate and assign the letter grade
    const letterGrade = calculateLetterGrade(
      midtermScore,
      finalScore,
      typeOfPointScale
    );

    // Update the student's grade and the course's enrolled student grade
    student.takenCourses.find((course) => course.id === courseId).letterGrade =
      letterGrade;
    course.enrolledStudents.find(
      (student) => student.id === studentId
    ).letterGrade = letterGrade;
  }
}

// Function to assign a student to a course and set their letter grade
const assignStudentToCourseAndSetLetterGrade = (
  studentId,
  midtermScore,
  finalScore
) => {
  // Ensure a course is selected
  if (!selectedCourseIdFromDropdown()) {
    alert("Please select a course");
    return;
  }

  const courseId = selectedCourseIdFromDropdown();
  // Assign the student to the course and set their letter grade
  assignStudentToCourse(studentId, courseId, midtermScore, finalScore);
  setStudentLetterGrade(studentId, courseId);

  // Refresh the course table and student courses table to reflect changes
  populateCourseTable(courseId);
  populateStudentCoursesTable(studentId);
};
// Function to delete a student from a course and refresh the course table
const deleteStudentFromCourseAndRefresh = (studentId, courseId) => {
  // Call the existing function to remove the student from the course
  removeStudentFromCourse(studentId, courseId);
  // Refresh the course table to reflect the change
  populateCourseTable(courseId);
};

// Function to open the update form for a student and course
const openUpdateForm = (studentId, courseId) => {
  // Get the update form element and display it
  const updateForm = document.getElementById("updateForm");
  updateForm.style.display = "block";

  // Attach an event listener to the submit button for form submission
  document.getElementById("submitUpdate").onclick = () => {
    // Retrieve the updated values from the form input fields
    const name = document.getElementById("updateName").value || undefined;
    const surname = document.getElementById("updateSurname").value || undefined;
    const midtermScore =
      parseInt(document.getElementById("updateMidterm").value) || undefined;
    const finalScore =
      parseInt(document.getElementById("updateFinal").value) || undefined;

    // Call the function to update student information with the provided values
    updateStudentInformation(
      studentId,
      name,
      surname,
      courseId,
      midtermScore,
      finalScore
    );

    // Refresh the course table to reflect the changes
    populateCourseTable(courseId);
    // Hide the update form after submission
    updateForm.style.display = "none";
  };
};

// Function to show detailed course information
const showCourseDetails = (courseId) => {
  // Find the course by ID
  const course = findCourse(courseId);

  // If the course is not found, show an alert
  if (!course) {
    alert("Please select a course first");
    return;
  }

  if (course) {
    // Initialize the HTML content to display the course details
    let courseDetailsHtml = `<h3>Details for Course: ${course.name}</h3>`;
    let passedStudentsCount = 0;
    let failedStudentsCount = 0;
    let meanScore = 0;
    const numberOfStudents = parseInt(course.enrolledStudents.length);

    // Iterate through all enrolled students and calculate passed, failed, and mean scores
    course.enrolledStudents.forEach((enrolledStudent) => {
      const student = findStudent(enrolledStudent.id);

      // Calculate the mean score for the course
      if (student) {
        const studentCourse = student.takenCourses.find(
          (c) => c.id === courseId
        );
        if (studentCourse) {
          meanScore += calculateTermScore(
            studentCourse.midtermScore,
            studentCourse.finalScore
          );
        }
      }

      // Count how many students passed or failed the course
      if (student) {
        const studentCourse = student.takenCourses.find(
          (c) => c.id === courseId
        );

        // If the student's grade is not an F, count them as passed
        if (studentCourse && studentCourse.letterGrade !== "F") {
          passedStudentsCount++;
        }

        // If the student's grade is an F, count them as failed
        if (studentCourse && studentCourse.letterGrade === "F") {
          failedStudentsCount++;
        }
      }
    });

    // Add the summary data to the course details HTML
    courseDetailsHtml += `<p><strong>Number of Total Students: ${numberOfStudents}</strong></p>
    <p><strong>Number of Passed Students:</strong> ${passedStudentsCount}</p>
    <p><strong>Number of Failed Students:</strong> ${failedStudentsCount}</p>
    <p><strong>Mean Score:</strong> ${meanScore / numberOfStudents}</p>
    `;

    // Update the course details section with the generated HTML content
    const courseDetails = document.getElementById("courseDetails");
    courseDetails.innerHTML = courseDetailsHtml;

    // Toggle the visibility of the course details section
    if (
      courseDetails.style.display === "none" ||
      !courseDetails.style.display
    ) {
      courseDetails.style.display = "block"; // Show the course details
    } else {
      courseDetails.style.display = "none"; // Hide the course details
    }
  }
};
