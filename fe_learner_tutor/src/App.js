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
import CreateVideoCourse from './components/tutor/course/CreateVideoCourse';
import CreateClassCourse from './components/tutor/course/CreateClassCourse';
import ListClassCourse from './components/tutor/course/ListClassCourse';
import ListVideoCourse from './components/tutor/course/ListVideoCourse';
import CreateVideoCourseModule from './components/tutor/course/module/CreateVideoCourseModule';
import CreateLesson from './components/tutor/course/lesson/CreateLesson';
import ModulePart from './components/tutor/course/module/ModulePart';
import CreateQuiz from './components/tutor/course/quiz/CreateQuiz';
import CreateAssignment from './components/tutor/course/assignment/CreateAssignment';

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
        <Route path="/tutor/courses/list-video-course" element={<ListVideoCourse />} />
        <Route path="/tutor/courses/list-class-course" element={<ListClassCourse />} />
        <Route path="/tutor/courses/create" element={<CreateCourse />} />
        <Route path="/tutor/courses/create/create-video-course" element={<CreateVideoCourse />} />
        <Route path="/tutor/courses/create/create-video-course/create-module" element={<CreateVideoCourseModule />} />
        <Route path="/tutor/courses/create/create-video-course/create-module/module-part" element={<ModulePart />} />
        <Route path="/tutor/courses/create/create-video-course/create-lesson" element={<CreateLesson />} />
        <Route path="/tutor/courses/create/create-video-course/create-assignment" element={<CreateAssignment />} />
        <Route path="/tutor/courses/create/create-video-course/create-quiz" element={<CreateQuiz />} />
        <Route path="/tutor/courses/create/create-class-course" element={<CreateClassCourse />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
