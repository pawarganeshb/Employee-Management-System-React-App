
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
  designation: Yup.string().required('Designation is required'),
  salary: Yup.number()
    .required('Salary is required')
    .positive('Salary must be a positive number'),
});

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [updateIndex, setUpdateIndex] = useState(null);

  const handleSubmit = (values, { resetForm }) => {
    if (updateIndex !== null) {
      setEmployees(
        employees.map((employee, i) =>
          i === updateIndex ? { ...employee, ...values } : employee
        )
      );
      setUpdateIndex(null);
    } else {
      setEmployees([...employees, values]);
    }
    resetForm();
  };

  const handleDelete = (index) => {
    setEmployees(employees.filter((employee, i) => i !== index));
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
      <div className="container mb-4" style={{marginTop:'100px'}}>
        <Formik
          enableReinitialize
          initialValues={{
            name: updateIndex !== null ? employees[updateIndex].name : '',
            dob: updateIndex !== null ? employees[updateIndex].dob : '',
            contact: updateIndex !== null ? employees[updateIndex].contact : '',
            email: updateIndex !== null ? employees[updateIndex].email : '',
            address: updateIndex !== null ? employees[updateIndex].address : '',
            department: updateIndex !== null ? employees[updateIndex].department : '',
            designation: updateIndex !== null ? employees[updateIndex].designation : '',
            salary: updateIndex !== null ? employees[updateIndex].salary : '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form className='table table-fluid'>
              <div className="form-group">
                <label className="form-label fw-bold">Name:</label>
                <Field type="text" name="name" className="form-control" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label className="form-label fw-bold">Date of Birth:</label>
                <Field type="date" name="dob" className="form-control" />
                <ErrorMessage name="dob" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label className="form-label fw-bold">Contact:</label>
                <Field type="text" name="contact" className="form-control" />
                <ErrorMessage name="contact" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label className="form-label fw-bold">Email:</label>
                <Field type="email" name="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label className="form-label fw-bold">Address:</label>
                <Field type="text" name="address" className="form-control" />
                <ErrorMessage name="address" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label className="form-label fw-bold">Department:</label>
                <Field type="text" name="department" className="form-control" />
                <ErrorMessage name="department" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label className="form-label fw-bold">Designation:</label>
                <Field type="text" name="designation" className="form-control" />
                <ErrorMessage name="designation" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label className="form-label fw-bold">Salary:</label>
                <Field type="number" name="salary" className="form-control" />
                <ErrorMessage name="salary" component="div" className="text-danger" />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                {updateIndex !== null ? 'Update' : 'Submit'}
              </button>
            </Form>
          )}
        </Formik>
        <div className="form-group w-25 mb-3 ">
          <label className='form-label mt-2 fw-bold'>Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.dob}</td>
                <td>{employee.contact}</td>
                <td>{employee.email}</td>
                <td>{employee.address}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>{employee.salary}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdate(index)}
                  >
                    Update
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