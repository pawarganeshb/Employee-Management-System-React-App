import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import NavBar from './component/NavBar';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces'),
  dob: Yup.string()
    .required('Date of Birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date of Birth must be in YYYY-MM-DD format')
    .test('date', 'Date of Birth must be a valid past date', (value) => {
      const date = new Date(value);
      return date < new Date();
    }),
  contact: Yup.string()
    .required('Contact is required')
    .length(10, 'Contact must be exactly 10 digits')
    .matches(/^\d+$/, 'Contact must only contain digits'),
  email: Yup.string()
    .required('Email is required')
    .email('Email must be a valid email format'),
  address: Yup.string().required('Address is required'),
  department: Yup.string().required('Department is required'),
  salary: Yup.number()
    .required('Salary is required')
    .positive('Salary must be a positive number'),
});

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [updateIndex, setUpdateIndex] = useState(null);
  const API_URL = "http://localhost:8080/api/employees"; // Ensure correct backend URL

  // Fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (updateIndex !== null) {
      // Handle Update
      try {
        const updatedEmployee = { ...employees[updateIndex], ...values };
        await axios.put(`${API_URL}/${employees[updateIndex].id}`, updatedEmployee);
        setEmployees(
          employees.map((employee, i) =>
            i === updateIndex ? updatedEmployee : employee
          )
        );
        setUpdateIndex(null);  // Reset the index after updating
        resetForm();
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    } else {
      // Handle Add
      try {
        const response = await axios.post(API_URL, values);
        setEmployees([...employees, response.data]);
        resetForm();
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${API_URL}/${employees[index].id}`);
      setEmployees(employees.filter((employee, i) => i !== index));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleUpdate = (index) => {
    setUpdateIndex(index);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <div className="container mb-4" style={{ marginTop: '100px' }}>
        <Formik
          enableReinitialize
          initialValues={{
            name: updateIndex !== null ? employees[updateIndex].name : '',
            dob: updateIndex !== null ? employees[updateIndex].dob : '',
            contact: updateIndex !== null ? employees[updateIndex].contact : '',
            email: updateIndex !== null ? employees[updateIndex].email : '',
            address: updateIndex !== null ? employees[updateIndex].address : '',
            department: updateIndex !== null ? employees[updateIndex].department : '',
            salary: updateIndex !== null ? employees[updateIndex].salary : '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form className='table table-fluid'>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold">Name:</label>
                    <Field type="text" name="name" className="form-control" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold">Date of Birth:</label>
                    <Field type="date" name="dob" className="form-control" />
                    <ErrorMessage name="dob" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold">Contact:</label>
                    <Field type="text" name="contact" className="form-control" />
                    <ErrorMessage name="contact" component="div" className="text-danger" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold">Email:</label>
                    <Field type="email" name="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold">Address:</label>
                    <Field type="text" name="address" className="form-control" />
                    <ErrorMessage name="address" component="div" className="text-danger" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold">Department:</label>
                    <Field type="text" name="department" className="form-control" />
                    <ErrorMessage name="department" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label fw-bold">Salary:</label>
                    <Field type="number" name="salary" className="form-control" />
                    <ErrorMessage name="salary" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                {updateIndex !== null ? 'Update' : 'Submit'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="form-group w-25 mb-3">
          <label className="form-label mt-2 fw-bold">Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
        </div>

        <table className="table table-striped table-bordered table-hover table-responsive">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.dob}</td>
                <td>{employee.contact}</td>
                <td>{employee.email}</td>
                <td>{employee.address}</td>
                <td>{employee.department}</td>
                <td>{employee.salary}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleDelete(index)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUpdate(index)}
                  >
                    <i className="bi bi-pencil"></i> Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
