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
import CreateClassCourseModule from './components/tutor/course/module/CreateClassCourseModule';
import ClassModulePart from './components/tutor/course/module/ClassModulePart';
import CreateTopic from './components/tutor/course/topic/CreateTopic';
import ListTopic from './components/tutor/course/topic/ListTopic';
import EditTopic from './components/tutor/course/topic/EditTopic';
import CreateClassLesson from './components/tutor/course/lesson/CreateClassLesson';
import EditCourse from './components/tutor/course/EditCourse';
import EditModule from './components/tutor/course/module/EditModule';
import ListLesson from './components/tutor/course/lesson/ListLesson';
import ListQuiz from './components/tutor/course/quiz/ListQuiz';
import ListAssignment from './components/tutor/course/assignment/ListAssignment';
import EditClassModule from './components/tutor/course/module/EditClassModule';
import EditLesson from './components/tutor/course/lesson/EditLesson';
import EditQuiz from './components/tutor/course/quiz/EditQuiz';
import EditAssignment from './components/tutor/course/assignment/EditAssignment';
import TutorDashboard from './components/tutor/dashboard/TutorDashboard';
import CreateQuestion from './components/tutor/course/question/CreateQuestion';
import EditQuestion from './components/tutor/course/question/EditQuestion';
import CreateQuestionAnswer from './components/tutor/course/question-answer/CreateQuestionAnswer';
import CreateClassTopicMaterial from './components/tutor/course/material/CreateClassTopicMaterial';
import CreateLessonMaterial from './components/tutor/course/material/CreateLessonMaterial';
import ListClassTopicMaterial from './components/tutor/course/material/ListClassTopicMaterial';
import ListLessonMaterial from './components/tutor/course/material/ListLessonMaterial';
import PaymentCallBack from './components/payment/PaymentCallBack';
import Invoice from './components/payment/Invoice';
import ListForum from './components/tutor/forum/ListForum';
import EditForum from './components/tutor/forum/EditForum';
import ListAssignmentAttempt from './components/tutor/course/assignment-attempt/ListAssignmentAttempt';
import EditAssignmentAttempt from './components/tutor/course/assignment-attempt/EditAssignmentAttempt';

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
        <Route path="/detail-course/:courseId" element={<DetailCourse />} />
        <Route path="/my-courses/learning" element={<Learning />} />
        <Route path="/tutor/courses" element={<CourseList />} />
        <Route path="/tutor/courses/create" element={<CreateCourse />} />
        {/* list course by tutorID */}
        <Route path="/tutor/course/list-course-by-tutor/:tutorId" element={<CourseList />} />
        {/* list course by tutorID */}
        <Route path="/tutor/courses/list-video-course/:tutorId" element={<ListVideoCourse />} />
        <Route path="/tutor/courses/list-class-course/:tutorId" element={<ListClassCourse />} />
        <Route path="/tutor/courses/create" element={<CreateCourse />} />
        <Route path="/tutor/courses/create/create-video-course" element={<CreateVideoCourse />} />
        <Route path="/tutor/courses/create/create-video-course/create-module/:storedCourseId" element={<CreateVideoCourseModule />} />
        <Route path="/tutor/courses/create/create-video-course/create-module/module-part/:storedModuleId" element={<ModulePart />} />
        <Route path="/tutor/courses/create/create-video-course/create-lesson/:storedModuleId" element={<CreateLesson />} />
        <Route path="/tutor/courses/create/create-video-course/create-assignment/:storedModuleId" element={<CreateAssignment />} />
        <Route path="/tutor/courses/create/create-video-course/create-quiz/:storedModuleId" element={<CreateQuiz />} />
        <Route path="/tutor/courses/edit-course/:courseId" element={<EditCourse />} />
        <Route path="/tutor/courses/edit-module/:moduleId" element={<EditModule />} />
        <Route path="/tutor/courses/edit-lesson/:lessonId" element={<EditLesson />} />
        <Route path="/tutor/courses/list-lesson/:storedModuleId" element={<ListLesson />} />
        <Route path="/tutor/courses/list-assignment/:storedModuleId" element={<ListAssignment />} />
        <Route path="/tutor/courses/edit-assignment/:assignmentId" element={<EditAssignment />} />
        <Route path="/tutor/courses/edit-quiz/:quizId" element={<EditQuiz />} />
        <Route path="/tutor/courses/list-quiz/:storedModuleId" element={<ListQuiz />} />
        <Route path="/tutor/courses/create/create-video-course/create-question/:storedQuizId" element={<CreateQuestion />} />
        <Route path="/tutor/courses/edit-question/:questionId" element={<EditQuestion />} />
        <Route path="/tutor/courses/create/create-video-course/create-question-answer/:storedQuestionId" element={<CreateQuestionAnswer />} />
        <Route path="/tutor/courses/create-lesson-material/:storedLessonId" element={<CreateLessonMaterial />} />
        <Route path="/tutor/courses/list-material-by-lesson/:storedLessonId" element={<ListLessonMaterial />} />


        {/* ---------------------------------------------------------------------------------------------------------- */}
        <Route path="/tutor/courses/create/create-class-course" element={<CreateClassCourse />} />
        <Route path="/tutor/courses/create/create-class-course/create-class-module/:storedCourseId" element={<CreateClassCourseModule />} />
        <Route path="/tutor/courses/create/create-class-course/create-class-module/class-module-part/:storedModuleId" element={<ClassModulePart />} />
        <Route path="/tutor/courses/create/create-class-course/create-class-lesson/:storedModuleId" element={<CreateClassLesson />} />
        <Route path="/tutor/courses/create/create-class-course/create-topic/:storedClassLessonId" element={<CreateTopic />} />
        <Route path="/tutor/courses/create/create-class-course/list-topic/:storedClassLessonId" element={<ListTopic />} />
        <Route path="/tutor/courses/edit-topic/:storedClassTopicId" element={<EditTopic />} />
        <Route path="/tutor/courses/edit-class-module/:moduleId" element={<EditClassModule />} />
        <Route path="/tutor/courses/create-class-material/:storedClassTopicId" element={<CreateClassTopicMaterial />} />
        <Route path="/tutor/courses/list-material-by-topic/:storedClassTopicId" element={<ListClassTopicMaterial />} />

        {/* dashboard */}
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
        {/* payment */}

        <Route path="/payment-callback" element={<PaymentCallBack />} />
        <Route path="/invoice/:transactionId" element={<Invoice />} />

        {/* forum */}
        <Route path="/list-forum/:tutorId" element={<ListForum />} />
        <Route path="/edit-forum/:forumId" element={<EditForum />} />

        {/* assignment attempt */}
        <Route path="/list-assignment-attempt/:tutorId" element={<ListAssignmentAttempt />} />
        <Route path="/edit-assignment-attempt/:assignmentAttemptId" element={<EditAssignmentAttempt />} />

      </Routes>
    </div>
  );
}

export default App;
