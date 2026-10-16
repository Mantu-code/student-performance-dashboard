let students = [];

let editingRollNo = null;


// ==========================================================
// DATE
// ==========================================================

function setDate() {

    const dateElement =
        document.getElementById("currentDate");

    const today = new Date();

    dateElement.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
}


// ==========================================================
// LOAD DASHBOARD
// ==========================================================

async function loadDashboard() {

    await loadStudents();

    await loadAnalytics();

}


// ==========================================================
// LOAD STUDENTS
// ==========================================================

async function loadStudents() {

    try {

        const response =
            await fetch("/students");

        students =
            await response.json();

        displayStudents(students);

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to connect to Python server."
        );

    }

}


// ==========================================================
// DISPLAY STUDENTS
// ==========================================================

function displayStudents(data) {

    const table =
        document.getElementById(
            "studentTable"
        );

    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    table.innerHTML = "";


    if (data.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    data.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${student["Roll No"]}
            </td>


            <td>
                <strong>
                    ${student["Name"]}
                </strong>
            </td>


            <td>
                ${student["Python"]}
            </td>


            <td>
                ${student["Maths"]}
            </td>


            <td>
                ${student["DBMS"]}
            </td>


            <td>
                ${student["Total"]}
            </td>


            <td>
                ${student["Percentage"]}%
            </td>


            <td>

                <span class="grade-badge">

                    ${student["Grade"]}

                </span>

            </td>


            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editStudent(
                        '${student["Roll No"]}'
                    )"
                >
                    Edit
                </button>


                <button
                    class="action-btn delete-btn"
                    onclick="deleteStudent(
                        '${student["Roll No"]}'
                    )"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================================
// ADD / UPDATE STUDENT
// ==========================================================

document
    .getElementById("studentForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const student = {

                roll_no:
                    document
                        .getElementById("rollNo")
                        .value,

                name:
                    document
                        .getElementById("name")
                        .value
                        .trim(),

                python:
                    document
                        .getElementById("python")
                        .value,

                maths:
                    document
                        .getElementById("maths")
                        .value,

                dbms:
                    document
                        .getElementById("dbms")
                        .value

            };


            const endpoint =
                editingRollNo === null
                    ? "/add"
                    : "/update";


            if (editingRollNo !== null) {

                student.roll_no =
                    editingRollNo;

            }


            try {

                const response =
                    await fetch(
                        endpoint,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    student
                                )

                        }
                    );


                const result =
                    await response.json();


                alert(result.message);


                if (result.success) {

                    resetForm();

                    await loadDashboard();

                    document
                        .getElementById(
                            "students"
                        )
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }

            }

            catch (error) {

                console.error(error);

                alert(
                    "Something went wrong."
                );

            }

        }
    );


// ==========================================================
// EDIT STUDENT
// ==========================================================

function editStudent(rollNo) {

    const student =
        students.find(
            item =>
                item["Roll No"] ===
                String(rollNo)
        );


    if (!student) {

        return;

    }


    editingRollNo =
        String(rollNo);


    document
        .getElementById("rollNo")
        .value =
        student["Roll No"];


    document
        .getElementById("name")
        .value =
        student["Name"];


    document
        .getElementById("python")
        .value =
        student["Python"];


    document
        .getElementById("maths")
        .value =
        student["Maths"];


    document
        .getElementById("dbms")
        .value =
        student["DBMS"];


    document
        .getElementById("rollNo")
        .disabled = true;


    document
        .getElementById("submitBtn")
        .textContent =
        "Update Student";


    document
        .getElementById("add")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ==========================================================
// DELETE STUDENT
// ==========================================================

async function deleteStudent(rollNo) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                "/delete",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            roll_no:
                                rollNo
                        })

                }
            );


        const result =
            await response.json();


        alert(result.message);


        if (result.success) {

            await loadDashboard();

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to delete student."
        );

    }

}


// ==========================================================
// RESET FORM
// ==========================================================

function resetForm() {

    editingRollNo = null;


    document
        .getElementById("studentForm")
        .reset();


    document
        .getElementById("rollNo")
        .disabled = false;


    document
        .getElementById("submitBtn")
        .textContent =
        "Add Student";

}


// ==========================================================
// SEARCH
// ==========================================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function() {

            const search =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                students.filter(
                    student =>

                        student["Name"]
                            .toLowerCase()
                            .includes(search)

                        ||

                        student["Roll No"]
                            .toLowerCase()
                            .includes(search)

                        ||

                        student["Grade"]
                            .toLowerCase()
                            .includes(search)

                );


            displayStudents(filtered);

        }
    );


// ==========================================================
// ANALYTICS
// ==========================================================

async function loadAnalytics() {

    try {

        const response =
            await fetch(
                "/analytics"
            );


        const data =
            await response.json();


        // ---------------- CARDS ----------------

        document
            .getElementById(
                "totalStudents"
            )
            .textContent =
            data.total_students;


        document
            .getElementById(
                "averagePercentage"
            )
            .textContent =
            data.average + "%";


        document
            .getElementById(
                "passedStudents"
            )
            .textContent =
            data.passed;


        document
            .getElementById(
                "failedStudents"
            )
            .textContent =
            data.failed;


        // ---------------- HIGHEST ----------------

        document
            .getElementById(
                "highestPercentage"
            )
            .textContent =
            data.highest + "%";


        // ---------------- LOWEST ----------------

        document
            .getElementById(
                "lowestPercentage"
            )
            .textContent =
            data.lowest + "%";


        // ---------------- PASS RATE ----------------

        let passRate = 0;


        if (data.total_students > 0) {

            passRate =
                (
                    data.passed /
                    data.total_students
                ) * 100;

        }


        document
            .getElementById(
                "passRate"
            )
            .textContent =
            passRate.toFixed(1) + "%";


        // ---------------- SUBJECT ----------------

        const python =
            data.subject_average.python;


        const maths =
            data.subject_average.maths;


        const dbms =
            data.subject_average.dbms;


        document
            .getElementById(
                "pythonAverage"
            )
            .textContent =
            python;


        document
            .getElementById(
                "mathsAverage"
            )
            .textContent =
            maths;


        document
            .getElementById(
                "dbmsAverage"
            )
            .textContent =
            dbms;


        document
            .getElementById(
                "analyticsPython"
            )
            .textContent =
            python;


        document
            .getElementById(
                "analyticsMaths"
            )
            .textContent =
            maths;


        document
            .getElementById(
                "analyticsDbms"
            )
            .textContent =
            dbms;


        document
            .getElementById(
                "analyticsOverall"
            )
            .textContent =
            data.average;


        // ---------------- BARS ----------------

        document
            .getElementById(
                "pythonBar"
            )
            .style.width =
            python + "%";


        document
            .getElementById(
                "mathsBar"
            )
            .style.width =
            maths + "%";


        document
            .getElementById(
                "dbmsBar"
            )
            .style.width =
            dbms + "%";


        // ---------------- GRADES ----------------

        const grades =
            data.grades;


        document
            .getElementById(
                "gradeTotal"
            )
            .textContent =
            data.total_students;


        document
            .getElementById(
                "gradeAPlus"
            )
            .textContent =
            grades["A+"];


        document
            .getElementById(
                "gradeA"
            )
            .textContent =
            grades["A"];


        document
            .getElementById(
                "gradeB"
            )
            .textContent =
            grades["B"];


        document
            .getElementById(
                "gradeC"
            )
            .textContent =
            grades["C"];


        document
            .getElementById(
                "gradeD"
            )
            .textContent =
            grades["D"];


        document
            .getElementById(
                "gradeF"
            )
            .textContent =
            grades["F"];


        // ---------------- GRADE CIRCLE ----------------

        updateGradeCircle(grades);


    }

    catch (error) {

        console.error(error);

    }

}


// ==========================================================
// GRADE CIRCLE
// ==========================================================

function updateGradeCircle(grades) {

    const total =
        Object.values(grades)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );


    if (total === 0) {

        document
            .querySelector(
                ".grade-circle"
            )
            .style.background =
            "#e9edf3";

        return;

    }


    const aPlus =
        grades["A+"];


    const a =
        grades["A"];


    const b =
        grades["B"];


    const c =
        grades["C"];


    const d =
        grades["D"];


    const f =
        grades["F"];


    const aPlusDeg =
        (aPlus / total) * 360;


    const aDeg =
        (a / total) * 360;


    const bDeg =
        (b / total) * 360;


    const cDeg =
        (c / total) * 360;


    const dDeg =
        (d / total) * 360;


    const aEnd =
        aPlusDeg + aDeg;


    const bEnd =
        aEnd + bDeg;


    const cEnd =
        bEnd + cDeg;


    const dEnd =
        cEnd + dDeg;


    const circle =
        document.querySelector(
            ".grade-circle"
        );


    circle.style.background =
        `
        conic-gradient(
            #172554 0deg ${aPlusDeg}deg,
            #2864d7 ${aPlusDeg}deg ${aEnd}deg,
            #16835b ${aEnd}deg ${bEnd}deg,
            #7556d9 ${bEnd}deg ${cEnd}deg,
            #d69e2e ${cEnd}deg ${dEnd}deg,
            #dc3c4b ${dEnd}deg 360deg
        )
        `;

}


// ==========================================================
// START
// ==========================================================

setDate();

loadDashboard();