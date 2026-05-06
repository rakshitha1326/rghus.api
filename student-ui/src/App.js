import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [faculties, setFaculties] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        name: "",
        emailID: "",
        mobileNo: "",
        faculty: "",
        college: "",
        course: ""
    });

    // ✅ Load faculties + students
    useEffect(() => {
        axios.get("http://localhost:5137/api/student/faculties")
            .then(res => setFaculties(res.data))
            .catch(err => console.log(err));

        loadStudents();
    }, []);

    const loadStudents = () => {
        axios.get("http://localhost:5137/api/student")
            .then(res => setStudents(res.data))
            .catch(err => console.log(err));
    };

    // ✅ Faculty change
    const handleFacultyChange = (e) => {
        const code = e.target.value;

        setForm({ ...form, faculty: code, college: "", course: "" });
        setColleges([]);
        setCourses([]);

        // Load colleges
        axios.get(`http://localhost:5137/api/student/colleges/${code}`)
            .then(res => setColleges(res.data))
            .catch(err => console.log(err));

        // Load courses (based on faculty)
        axios.get(`http://localhost:5137/api/student/courses/${code}`)
            .then(res => setCourses(res.data))
            .catch(err => console.log(err));
    };

    // ✅ College change
    const handleCollegeChange = (e) => {
        const code = e.target.value;
        setForm({ ...form, college: code });
    };

    // ✅ Input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Submit
    const handleSubmit = () => {
        if (!form.name || !form.emailID || !form.mobileNo || !form.faculty || !form.college || !form.course) {
            alert("All fields are required");
            return;
        }

        axios.post("http://localhost:5137/api/student", form)
            .then(() => {
                alert("Student Registered Successfully");

                setForm({
                    name: "",
                    emailID: "",
                    mobileNo: "",
                    faculty: "",
                    college: "",
                    course: ""
                });

                setColleges([]);
                setCourses([]);

                loadStudents();
            })
            .catch(err => {
                console.log(err);
                alert("Error saving data");
            });
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Student Registration</h2>

                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="emailID"
                    placeholder="Email"
                    value={form.emailID}
                    onChange={handleChange}
                />

                <input
                    name="mobileNo"
                    placeholder="Mobile"
                    value={form.mobileNo}
                    onChange={handleChange}
                />

                {/* ✅ Faculty */}
                <select value={form.faculty} onChange={handleFacultyChange}>
                    <option value="">Select Faculty</option>
                    {faculties.map(f => (
                        <option key={f.code} value={f.code}>
                            {f.name}
                        </option>
                    ))}
                </select>

                {/* ✅ College */}
                <select value={form.college} onChange={handleCollegeChange}>
                    <option value="">Select College</option>
                    {colleges.map(c => (
                        <option key={c.code} value={c.code}>
                            {c.name}
                        </option>
                    ))}
                </select>

                {/* ✅ Course */}
                <select name="course" value={form.course} onChange={handleChange}>
                    <option value="">Select Course</option>
                    {courses.map(c => (
                        <option key={c.code} value={c.code}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <button onClick={handleSubmit}>Submit</button>
            </div>

            {/* ✅ TABLE */}
            <div className="table-container">
                <h3>Registered Students</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Faculty</th>
                            <th>College</th>
                            <th>Course</th>
                            <th>Reg No</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s, index) => (
                            <tr key={index}>
                                <td>{s.name}</td>
                                <td>{s.emailID}</td>
                                <td>{s.mobileNo}</td>
                                <td>{s.faculty}</td>
                                <td>{s.college}</td>
                                <td>{s.course}</td>
                                <td>{s.registrationNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;