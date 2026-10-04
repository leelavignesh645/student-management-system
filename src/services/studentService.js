import axios from "axios";

const API_URL = "http://localhost:8080/students";
const ADMIN_API_URL = "http://localhost:8080/admin";


// ===============================
// STUDENTS
// ===============================

// GET ALL STUDENTS
export const getStudents = () => {
    return axios.get(API_URL);
};


// ADD STUDENT
// Student can add name
export const addStudent = (student) => {
    return axios.post(API_URL, student);
};


// UPDATE STUDENT
// ADMIN ONLY
export const updateStudent = (id, student) => {

    const token = localStorage.getItem("adminToken");

    return axios.put(
        `${API_URL}/${id}`,
        student,
        {
            headers: {
                "X-Admin-Token": token
            }
        }
    );
};


// DELETE STUDENT
// ADMIN ONLY
export const deleteStudent = (id) => {

    const token = localStorage.getItem("adminToken");

    return axios.delete(
        `${API_URL}/${id}`,
        {
            headers: {
                "X-Admin-Token": token
            }
        }
    );
};


// ===============================
// ADMIN LOGIN
// ===============================

export const adminLogin = (username, password) => {

    return axios.post(
        `${ADMIN_API_URL}/login`,
        {
            username,
            password
        }
    );
};