import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home'; // Assuming you have a Home component
import ListCourse from './components/course/ListCourse';
import DetailCourse from './components/course/DetailCourse';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Learning from './components/learner/course/MyLearning';
import CourseList from './components/tutor/course/CourseList';
import CreateCourse from './components/tutor/course/CreateCourse';
import BusinessSignUp from './components/BusinessSignUp';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/business-register" element={<BusinessSignUp />} />
        <Route path="/list-course" element={<ListCourse />} />
        <Route path="/detail-course" element={<DetailCourse />} />
        <Route path="/my-courses/learning" element={<Learning />} />
        <Route path="/tutor/courses" element={<CourseList />} />
        <Route path="/tutor/courses/create" element={<CreateCourse />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
