import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home'; // Assuming you have a Home component
import ListCourse from './components/course/ListCourse';
import DetailCourse from './components/course/DetailCourse';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MyLearning from './components/learner/course/MyLearning';
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
import CreateClassTopicQuiz from './components/tutor/course/quiz/CreateClassTopicQuiz';
import CreateClassTopicQuestion from './components/tutor/course/question/CreateClassTopicQuestion';
import CreateClassTopicAnswer from './components/tutor/course/question-answer/CreateClassTopicAnswer';
import ListClassTopicQuiz from './components/tutor/course/quiz/ListClassTopicQuiz';
import EditClassTopicQuiz from './components/tutor/course/quiz/EditClassTopicQuiz';
import EditClassTopicQuestion from './components/tutor/course/question/EditClassTopicQuestion';
import { useEffect } from 'react';
import { useState } from 'react';
import classLessonService from './services/class-lesson.service';
import classModuleService from './services/class-module.service';
import classTopicService from './services/class-topic.service';
import courseService from './services/course.service';
import enrollmentService from './services/enrollment.service';
import forumService from './services/forum.service';
import learnerService from './services/learner.service';
import lessonMaterialService from './services/lesson-material.service';
import moduleService from './services/module.service';
import questionAnswerService from './services/question-answer.service';
import questionService from './services/question.service';
import quizService from './services/quiz.service';
import transactionService from './services/transaction.service';
import tutorService from './services/tutor.service';
import centerService from './services/center.service';
import accountForumService from './services/account-forum.service';
import accountService from './services/account.service';
import assignmentAttemptService from './services/assignment-attempt.service';
import assignmentService from './services/assignment.service';
import categoryService from './services/category.service';
import StudyCourse from './components/course/StudyCourse';
import StudyClass from './components/course/StudyClass';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add a state for login status

  useEffect(() => {
    // Check if the user is already logged in by retrieving the login status from local storage
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(storedLoginStatus === 'true');

    // Retrieve the token from local storage and set it as the authentication token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      accountForumService.setToken(storedToken);
      accountService.setToken(storedToken);
      assignmentAttemptService.setToken(storedToken);
      assignmentService.setToken(storedToken);
      categoryService.setToken(storedToken);
      classLessonService.setToken(storedToken);
      classModuleService.setToken(storedToken);
      classTopicService.setToken(storedToken);
      courseService.setToken(storedToken);
      enrollmentService.setToken(storedToken);
      forumService.setToken(storedToken);
      learnerService.setToken(storedToken);
      lessonMaterialService.setToken(storedToken);
      moduleService.setToken(storedToken);
      questionAnswerService.setToken(storedToken);
      questionService.setToken(storedToken);
      quizService.setToken(storedToken);
      transactionService.setToken(storedToken);
      tutorService.setToken(storedToken);
    }

  }, []);


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/login"
          element={<SignIn setIsLoggedIn={setIsLoggedIn} />} // Pass setIsLoggedIn prop to Login component
        />
         
        {/* <Route path="/" element={<Navigate to="/home" />} /> */}
        <Route path="/home" element={<Home />} />
        {/* <Route path="/login" element={<SignIn />} /> */}
        <Route path="/register" element={<SignUp />} />
        <Route path="/business-register" element={<BusinessSignUp />} />
        <Route path="/list-course" element={<ListCourse />} />
        <Route path="/detail-course/:courseId" element={<DetailCourse />} />
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
        <Route path="/tutor/courses/create/create-class-course/create-quiz/:storedClassTopicId" element={<CreateClassTopicQuiz />} />
        <Route path="/tutor/courses/edit-topic-quiz/:quizId" element={<EditClassTopicQuiz />} />
        <Route path="/tutor/courses/create/create-class-course/create-topic-question/:storedQuizId" element={<CreateClassTopicQuestion />} />
        <Route path="/tutor/courses/edit-topic-question/:questionId" element={<EditClassTopicQuestion />} />
        <Route path="/tutor/courses/create/create-class-course/create-topic-question-answer/:storedQuestionId" element={<CreateClassTopicAnswer />} />
        <Route path="/tutor/courses/list-topic-quiz/:storedClassTopicId" element={<ListClassTopicQuiz />} />

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

        {/* learner */}
        <Route path="/study-course/:courseId" element={<StudyCourse />} />
        <Route path="/study-class/:courseId" element={<StudyClass />} />
        <Route path="/my-learning/:learnerId" element={<MyLearning />} />

      </Routes>
    </div>
  );
}

export default App;
