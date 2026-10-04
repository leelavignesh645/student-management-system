import { useEffect, useState } from "react";
import "./App.css";

import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  adminLogin
} from "./services/studentService";


function App() {

  // ===============================
  // STUDENT DATA
  // ===============================

  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");


  // ===============================
  // ADMIN LOGIN
  // ===============================

  const [isAdmin, setIsAdmin] = useState(
      !!localStorage.getItem("adminToken")
  );

  const [showLogin, setShowLogin] = useState(false);

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState("");


  // ===============================
  // FORM
  // ===============================

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    course: "",
    marks: ""
  });


  // ===============================
  // LOAD STUDENTS
  // ===============================

  useEffect(() => {

    loadStudents();

  }, []);


  const loadStudents = async () => {

    try {

      const response = await getStudents();

      setStudents(response.data);

    } catch (error) {

      console.error(
          "Error loading students:",
          error
      );

    }
  };


  // ===============================
  // FORM CHANGE
  // ===============================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // ===============================
  // ADD / UPDATE STUDENT
  // ===============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // ==========================
      // ADMIN UPDATE
      // ==========================

      if (editingId) {

        const studentData = {

          name: formData.name,

          age: Number(formData.age),

          course: formData.course,

          marks: Number(formData.marks)

        };

        await updateStudent(
            editingId,
            studentData
        );

        alert(
            "Student updated successfully!"
        );

      }

          // ==========================
          // STUDENT ADD
      // ==========================

      else {

        const studentData = {

          name: formData.name

        };

        await addStudent(studentData);

        alert(
            "Student added successfully!"
        );
      }


      // CLEAR FORM

      setFormData({
        name: "",
        age: "",
        course: "",
        marks: ""
      });

      setEditingId(null);

      setShowForm(false);

      await loadStudents();


    } catch (error) {

      console.error(
          "Error saving student:",
          error
      );

      if (
          error.response &&
          error.response.status === 403
      ) {

        alert(
            "Only admin can update students."
        );

      } else {

        alert(
            "Failed to save student."
        );
      }
    }
  };


  // ===============================
  // EDIT STUDENT
  // ===============================

  const handleEdit = (student) => {

    if (!isAdmin) {

      alert(
          "Only admin can edit students."
      );

      return;
    }

    setEditingId(student.id);

    setFormData({

      name: student.name,

      age: student.age,

      course: student.course,

      marks: student.marks

    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ===============================
  // DELETE STUDENT
  // ===============================

  const handleDelete = async (id) => {

    if (!isAdmin) {

      alert(
          "Only admin can delete students."
      );

      return;
    }


    const confirmDelete =
        window.confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {

      return;
    }


    try {

      await deleteStudent(id);

      alert(
          "Student deleted successfully!"
      );

      await loadStudents();

    } catch (error) {

      console.error(
          "Error deleting student:",
          error
      );

      alert(
          "Failed to delete student."
      );
    }
  };


  // ===============================
  // STUDENT ADD BUTTON
  // ===============================

  const handleAddStudent = () => {

    setEditingId(null);

    setFormData({

      name: "",

      age: "",

      course: "",

      marks: ""

    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ===============================
  // CANCEL
  // ===============================

  const handleCancel = () => {

    setShowForm(false);

    setEditingId(null);

    setFormData({

      name: "",

      age: "",

      course: "",

      marks: ""

    });
  };


  // ===============================
  // ADMIN LOGIN
  // ===============================

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoginError("");

    try {

      const response =
          await adminLogin(
              username,
              password
          );


      if (response.data.success) {

        localStorage.setItem(
            "adminToken",
            response.data.token
        );

        setIsAdmin(true);

        setShowLogin(false);

        setUsername("");

        setPassword("");

        alert(
            "Admin login successful!"
        );

      } else {

        setLoginError(
            "Invalid username or password"
        );
      }

    } catch (error) {

      console.error(
          "Login error:",
          error
      );

      setLoginError(
          "Unable to connect to server."
      );
    }
  };


  // ===============================
  // ADMIN LOGOUT
  // ===============================

  const handleLogout = () => {

    localStorage.removeItem(
        "adminToken"
    );

    setIsAdmin(false);

    setShowLogin(false);

    setShowForm(false);

    setEditingId(null);

    alert(
        "Admin logged out."
    );
  };


  // ===============================
  // SEARCH
  // ===============================

  const filteredStudents =
      students.filter((student) => {

        const search =
            searchTerm.toLowerCase();

        return (

            student.name
                ?.toLowerCase()
                .includes(search)

            ||

            student.course
                ?.toLowerCase()
                .includes(search)

            ||

            student.id
                ?.toString()
                .includes(search)

        );

      });


  // ===============================
  // DASHBOARD DATA
  // ===============================

  const javaStudents =
      students.filter(
          (student) =>
              student.course &&
              student.course
                  .toLowerCase()
                  .includes("java")
      ).length;


  const averageMarks =
      students.length > 0
          ? (
              students.reduce(
                  (total, student) =>
                      total +
                      Number(student.marks),
                  0
              ) / students.length
          ).toFixed(2)
          : "0";


  // ===============================
  // UI
  // ===============================

  return (

      <div className="app">

        {/* ========================= */}
        {/* NAVBAR */}
        {/* ========================= */}

        <nav className="navbar">

          <h2>
            Student Management System
          </h2>


          <div className="nav-links">

            <button>
              Dashboard
            </button>


            <button
                onClick={() => {

                  setShowForm(false);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });

                }}
            >
              Students
            </button>


            {!isAdmin && (

                <button
                    onClick={handleAddStudent}
                >
                  Add Student
                </button>

            )}


            {/* ADMIN */}

            {isAdmin ? (

                <button
                    className="admin-btn"
                    onClick={handleLogout}
                >
                  Logout Admin
                </button>

            ) : (

                <button
                    className="admin-btn"
                    onClick={() =>
                        setShowLogin(true)
                    }
                >
                  Admin Login
                </button>

            )}

          </div>

        </nav>


        {/* ========================= */}
        {/* MAIN */}
        {/* ========================= */}

        <main className="container">


          <h1>
            Dashboard
          </h1>


          <p className="subtitle">

            {isAdmin

                ? "Admin Mode - You can manage students"

                : "Student Mode - You can add students"}

          </p>


          {/* ========================= */}
          {/* ADMIN STATUS */}
          {/* ========================= */}

          {isAdmin && (

              <div className="admin-banner">

                🔐 Admin logged in

              </div>

          )}


          {/* ========================= */}
          {/* STATISTICS */}
          {/* ========================= */}

          <div className="stats">

            <div className="card">

              <h3>
                Total Students
              </h3>

              <p>
                {students.length}
              </p>

            </div>


            <div className="card">

              <h3>
                Java Students
              </h3>

              <p>
                {javaStudents}
              </p>

            </div>


            <div className="card">

              <h3>
                Average Marks
              </h3>

              <p>
                {averageMarks}
              </p>

            </div>

          </div>


          {/* ========================= */}
          {/* STUDENT FORM */}
          {/* ========================= */}

          {showForm && (

              <form
                  className="student-form"
                  onSubmit={handleSubmit}
              >

                <h2>

                  {editingId

                      ? "Edit Student"

                      : isAdmin

                          ? "Add Student"

                          : "Add Student Name"}

                </h2>


                {/* NAME */}

                <input
                    type="text"
                    name="name"
                    placeholder="Student Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />


                {/* ADMIN ONLY FIELDS */}

                {isAdmin && (

                    <>

                      <input
                          type="number"
                          name="age"
                          placeholder="Age"
                          value={formData.age}
                          onChange={handleChange}
                          required
                      />


                      <input
                          type="text"
                          name="course"
                          placeholder="Course"
                          value={formData.course}
                          onChange={handleChange}
                          required
                      />


                      <input
                          type="number"
                          name="marks"
                          placeholder="Marks"
                          value={formData.marks}
                          onChange={handleChange}
                          required
                      />

                    </>

                )}


                <button
                    type="submit"
                    className="add-btn"
                >

                  {editingId

                      ? "Update Student"

                      : "Save Student"}

                </button>


                <button
                    type="button"
                    className="delete-btn"
                    onClick={handleCancel}
                >
                  Cancel
                </button>

              </form>

          )}


          {/* ========================= */}
          {/* STUDENTS TABLE */}
          {/* ========================= */}

          <div className="student-section">

            <div className="section-header">

              <h2>
                Students
              </h2>


              {!isAdmin && (

                  <button
                      className="add-btn"
                      onClick={handleAddStudent}
                  >
                    + Add Student
                  </button>

              )}

            </div>


            {/* SEARCH */}

            <input
                type="text"
                placeholder="Search by name, course or ID..."
                className="search"
                value={searchTerm}
                onChange={(e) =>
                    setSearchTerm(
                        e.target.value
                    )
                }
            />


            {/* TABLE */}

            <table>

              <thead>

              <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Age</th>

                <th>Course</th>

                <th>Marks</th>

                {isAdmin && (
                    <th>Actions</th>
                )}

              </tr>

              </thead>


              <tbody>

              {filteredStudents.length > 0 ? (

                  filteredStudents.map(
                      (student) => (

                          <tr
                              key={student.id}
                          >

                            <td>
                              {student.id}
                            </td>

                            <td>
                              {student.name}
                            </td>

                            <td>
                              {student.age || "-"}
                            </td>

                            <td>
                              {student.course || "-"}
                            </td>

                            <td>
                              {student.marks || "-"}
                            </td>


                            {/* ADMIN ACTIONS */}

                            {isAdmin && (

                                <td>

                                  <button
                                      className="edit-btn"
                                      onClick={() =>
                                          handleEdit(
                                              student
                                          )
                                      }
                                  >
                                    Edit
                                  </button>


                                  <button
                                      className="delete-btn"
                                      onClick={() =>
                                          handleDelete(
                                              student.id
                                          )
                                      }
                                  >
                                    Delete
                                  </button>

                                </td>

                            )}

                          </tr>

                      )

                  )

              ) : (

                  <tr>

                    <td
                        colSpan={
                          isAdmin
                              ? "6"
                              : "5"
                        }
                        style={{
                          textAlign: "center"
                        }}
                    >
                      No students found
                    </td>

                  </tr>

              )}

              </tbody>

            </table>

          </div>

        </main>


        {/* ========================= */}
        {/* ADMIN LOGIN POPUP */}
        {/* ========================= */}

        {showLogin && (

            <div className="login-overlay">

              <div className="login-box">

                <h2>
                  Admin Login
                </h2>


                <form
                    onSubmit={handleLogin}
                >

                  <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) =>
                          setUsername(
                              e.target.value
                          )
                      }
                      required
                  />


                  <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                          setPassword(
                              e.target.value
                          )
                      }
                      required
                  />


                  {loginError && (

                      <p className="login-error">
                        {loginError}
                      </p>

                  )}


                  <button
                      type="submit"
                      className="add-btn"
                  >
                    Login
                  </button>


                  <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                          setShowLogin(false)
                      }
                  >
                    Cancel
                  </button>

                </form>

              </div>

            </div>

        )}

      </div>

  );
}

export default App;