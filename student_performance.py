import csv
import os
import numpy as np


# ============================================================
# FILE PATH
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_NAME = os.path.join(BASE_DIR, "students.csv")

HEADERS = [
    "Roll No",
    "Name",
    "Python",
    "Maths",
    "DBMS",
    "Total",
    "Percentage",
    "Grade"
]


# ============================================================
# OOP - STUDENT CLASS
# ============================================================

class Student:

    def __init__(self, roll_no, name, python_marks, maths_marks, dbms_marks):

        self.roll_no = str(roll_no)
        self.name = name
        self.python_marks = int(python_marks)
        self.maths_marks = int(maths_marks)
        self.dbms_marks = int(dbms_marks)

    def calculate_total(self):

        return (
            self.python_marks +
            self.maths_marks +
            self.dbms_marks
        )

    def calculate_percentage(self):

        return round(self.calculate_total() / 3, 2)

    def calculate_grade(self):

        percentage = self.calculate_percentage()

        if percentage >= 90:
            return "A+"
        elif percentage >= 80:
            return "A"
        elif percentage >= 70:
            return "B"
        elif percentage >= 60:
            return "C"
        elif percentage >= 40:
            return "D"
        else:
            return "F"

    def get_data(self):

        return [
            self.roll_no,
            self.name,
            self.python_marks,
            self.maths_marks,
            self.dbms_marks,
            self.calculate_total(),
            self.calculate_percentage(),
            self.calculate_grade()
        ]


# ============================================================
# INHERITANCE
# ============================================================

class RegularStudent(Student):
    pass


class ScholarshipStudent(Student):

    def scholarship_status(self):

        if self.calculate_percentage() >= 80:
            return "Eligible"

        return "Not Eligible"


# ============================================================
# CREATE CSV FILE
# ============================================================

def create_file():

    if not os.path.exists(FILE_NAME):

        with open(FILE_NAME, "w", newline="") as file:

            writer = csv.writer(file)

            writer.writerow(HEADERS)


create_file()


# ============================================================
# READ STUDENTS
# ============================================================

def get_students():

    create_file()

    students = []

    with open(FILE_NAME, "r", newline="") as file:

        reader = csv.DictReader(file)

        for row in reader:

            students.append(row)

    return students


# ============================================================
# ADD STUDENT
# ============================================================

def add_student(
    roll_no,
    name,
    python_marks,
    maths_marks,
    dbms_marks
):

    roll_no = str(roll_no).strip()
    name = str(name).strip()

    if not roll_no or not name:

        return False, "Roll number and name are required"

    try:

        python_marks = int(python_marks)
        maths_marks = int(maths_marks)
        dbms_marks = int(dbms_marks)

    except ValueError:

        return False, "Marks must be numbers"


    marks = [
        python_marks,
        maths_marks,
        dbms_marks
    ]

    if any(mark < 0 or mark > 100 for mark in marks):

        return False, "Marks must be between 0 and 100"


    students = get_students()

    for student in students:

        if student["Roll No"] == roll_no:

            return False, "Roll number already exists"


    student = RegularStudent(
        roll_no,
        name,
        python_marks,
        maths_marks,
        dbms_marks
    )


    with open(FILE_NAME, "a", newline="") as file:

        writer = csv.writer(file)

        writer.writerow(student.get_data())


    return True, "Student added successfully"


# ============================================================
# UPDATE STUDENT
# ============================================================

def update_student(
    roll_no,
    name,
    python_marks,
    maths_marks,
    dbms_marks
):

    roll_no = str(roll_no).strip()

    try:

        python_marks = int(python_marks)
        maths_marks = int(maths_marks)
        dbms_marks = int(dbms_marks)

    except ValueError:

        return False, "Marks must be numbers"


    marks = [
        python_marks,
        maths_marks,
        dbms_marks
    ]

    if any(mark < 0 or mark > 100 for mark in marks):

        return False, "Marks must be between 0 and 100"


    students = get_students()

    found = False

    updated_students = []


    for student in students:

        if student["Roll No"] == roll_no:

            found = True

            updated_student = RegularStudent(
                roll_no,
                name,
                python_marks,
                maths_marks,
                dbms_marks
            )

            updated_students.append(
                updated_student.get_data()
            )

        else:

            updated_students.append([
                student["Roll No"],
                student["Name"],
                student["Python"],
                student["Maths"],
                student["DBMS"],
                student["Total"],
                student["Percentage"],
                student["Grade"]
            ])


    if not found:

        return False, "Student not found"


    with open(FILE_NAME, "w", newline="") as file:

        writer = csv.writer(file)

        writer.writerow(HEADERS)

        writer.writerows(updated_students)


    return True, "Student updated successfully"


# ============================================================
# DELETE STUDENT
# ============================================================

def delete_student(roll_no):

    roll_no = str(roll_no).strip()

    students = get_students()

    new_students = []

    found = False


    for student in students:

        if student["Roll No"] == roll_no:

            found = True

        else:

            new_students.append([
                student["Roll No"],
                student["Name"],
                student["Python"],
                student["Maths"],
                student["DBMS"],
                student["Total"],
                student["Percentage"],
                student["Grade"]
            ])


    if not found:

        return False, "Student not found"


    with open(FILE_NAME, "w", newline="") as file:

        writer = csv.writer(file)

        writer.writerow(HEADERS)

        writer.writerows(new_students)


    return True, "Student deleted successfully"


# ============================================================
# NUMPY ANALYTICS
# ============================================================

def get_analytics():

    students = get_students()


    if not students:

        return {
            "total_students": 0,
            "average": 0,
            "highest": 0,
            "lowest": 0,
            "passed": 0,
            "failed": 0,

            "subject_average": {
                "python": 0,
                "maths": 0,
                "dbms": 0
            },

            "grades": {
                "A+": 0,
                "A": 0,
                "B": 0,
                "C": 0,
                "D": 0,
                "F": 0
            }
        }


    percentages = np.array([
        float(student["Percentage"])
        for student in students
    ])


    python_marks = np.array([
        float(student["Python"])
        for student in students
    ])


    maths_marks = np.array([
        float(student["Maths"])
        for student in students
    ])


    dbms_marks = np.array([
        float(student["DBMS"])
        for student in students
    ])


    grades = {
        "A+": 0,
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 0,
        "F": 0
    }


    for student in students:

        grade = student["Grade"]

        if grade in grades:

            grades[grade] += 1


    return {

        "total_students": int(len(students)),

        "average": round(
            float(np.mean(percentages)),
            2
        ),

        "highest": round(
            float(np.max(percentages)),
            2
        ),

        "lowest": round(
            float(np.min(percentages)),
            2
        ),

        "passed": int(
            np.sum(percentages >= 40)
        ),

        "failed": int(
            np.sum(percentages < 40)
        ),

        "subject_average": {

            "python": round(
                float(np.mean(python_marks)),
                2
            ),

            "maths": round(
                float(np.mean(maths_marks)),
                2
            ),

            "dbms": round(
                float(np.mean(dbms_marks)),
                2
            )
        },

        "grades": grades
    }