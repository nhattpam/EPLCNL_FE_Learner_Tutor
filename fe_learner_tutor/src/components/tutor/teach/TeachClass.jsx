import React, { useEffect, useState } from 'react'
import Header from '../Header';
import Sidebar from '../Sidebar';
import courseService from '../../../services/course.service';
import { Link, useParams } from 'react-router-dom';
import classModuleService from '../../../services/class-module.service';
import classLessonService from '../../../services/class-lesson.service';

const TeachClass = () => {

    const { classModuleId } = useParams();
    const [classModule, setClassModule] = useState({
        courseId: ""
    });
    const [enrollmentList, setEnrollmentList] = useState([]);
    const [classTopicList, setClassTopicList] = useState([]);

    useEffect(() => {

        classModuleService.getModuleById(classModuleId)
            .then((res) => {
                setClassModule(res.data);
                console.log("This is module: " + res.data.courseId)
            })
    }, [classModuleId]);

    useEffect(() => {
        courseService
            .getAllEnrollmentsByCourse(classModule.courseId)
            .then((res) => {
                const notRefundEnrollments = res.data.filter(enrollment => enrollment.refundStatus === false);

                console.log(res.data);
                setEnrollmentList(notRefundEnrollments);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [classModule.courseId]);

    useEffect(() => {
        classLessonService
            .getAllClassTopicsByClassLesson(classModule.classLesson?.id)
            .then((res) => {
                // console.log(res.data);
                setClassTopicList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [classModule.classLesson?.id]);
    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <div className="mb-2">
                                            <div className="row">
                                                <div className="col-12 text-sm-center form-inline">
                                                    <h5>CHECK ATTENDANCE DATE: <span className='text-success'> {classModule.startDate?.substring(0, 10)}</span></h5>

                                                    <div className="table-responsive text-center">
                                                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    <th data-toggle="true">No.</th>
                                                                    <th data-toggle="true">Image</th>
                                                                    <th data-toggle="true">Full Name</th>
                                                                    <th data-toggle="true">Phone</th>
                                                                    <th data-hide="phone">Gender</th>
                                                                    <th data-hide="phone, tablet">DOB</th>
                                                                    {/* <th>Action</th> */}
                                                                    <th>Check</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    enrollmentList.length > 0 && enrollmentList.map((enrollment, index) => (
                                                                        <tr key={enrollment.id}>
                                                                            <td>{index + 1}</td>
                                                                            <td>
                                                                                <img src={enrollment.transaction?.learner?.account?.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                                                </img>
                                                                            </td>
                                                                            <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.fullName ? enrollment.transaction?.learner?.account?.fullName : 'Unknown Name'}</td>
                                                                            <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.phoneNumber ? enrollment.transaction?.learner?.account?.phoneNumber : 'Unknown Phone Number'}</td>
                                                                            <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.gender !== undefined ? (enrollment.transaction?.learner?.account?.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>
                                                                            <td>
                                                                                {enrollment.transaction?.learner?.account?.dateOfBirth && typeof enrollment.transaction.learner.account.dateOfBirth === 'string' ?
                                                                                    enrollment.transaction.learner.account.dateOfBirth.substring(0, 10) :
                                                                                    'Unknown DOB'}
                                                                            </td>
                                                                            <td><input type='checkbox' /></td>
                                                                        </tr>
                                                                    ))
                                                                }

                                                            </tbody>
                                                        </table>

                                                    </div>

                                                    <h5>TOPICS:</h5>
                                                    <div className="table-responsive">
                                                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    <th data-toggle="true">No.</th>
                                                                    <th data-toggle="true">Topic Name</th>
                                                                    <th>Description</th>
                                                                    <th data-hide="phone">Created Date</th>
                                                                    <th data-hide="phone, tablet">Updated Date</th>
                                                                    <th>Action</th>
                                                                    {/* <th>Quizzes</th> */}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    classTopicList.length > 0 && classTopicList.map((classTopic, index) => (
                                                                        <tr key={classTopic.id}>
                                                                            <td>{index + 1}</td>
                                                                            <td>{classTopic.name}</td>
                                                                            <td>{classTopic.description}</td>
                                                                            <td>{classTopic.createdDate}</td>
                                                                            <td>{classTopic.updatedDate}</td>
                                                                            <td>
                                                                                <Link to={`/list-assignment-attempt-by-topic/${classTopic.id}`} className='text-secondary'>
                                                                                    <i class="fa-regular fa-eye"></i>
                                                                                </Link>
                                                                            </td>
                                                                            {/* <td>
                                                                    <Link to={`/tutor/courses/edit-topic/${classTopic.id}`} className='text-secondary'>
                                                                        <i class="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td> */}
                                                                        </tr>
                                                                    ))}
                                                            </tbody>

                                                        </table>
                                                    </div> {/* end .table-responsive*/}
                                                </div>
                                                {
                                                    enrollmentList.length === 0 && (
                                                        <p className='text-center'>No enrollments yet.</p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* end col-12 */}
                            </div> {/* end row */}
                        </div> {/* container */}
                    </div> {/* content */}
                </div>
            </div >
            <style>
                {`
                    /* Add custom styles as needed */
                `}
            </style>
        </>
    );
}

export default TeachClass