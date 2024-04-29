import React, { useEffect, useState } from 'react'
import Header from '../Header';
import Sidebar from '../Sidebar';
import courseService from '../../../services/course.service';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classModuleService from '../../../services/class-module.service';
import classLessonService from '../../../services/class-lesson.service';
import learnerAttendanceService from '../../../services/learner-attendance.service';
import attendanceService from '../../../services/attendance.service';

const TeachClass = () => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }


    const { classModuleId } = useParams();
    const [classModule, setClassModule] = useState({
        courseId: ""
    });
    const [enrollmentList, setEnrollmentList] = useState([]);
    const [classTopicList, setClassTopicList] = useState([]);
    const [learnerAttendanceList, setLearnerAttendanceList] = useState([]);

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    useEffect(() => {
        if (classModuleId) {
            classModuleService.getModuleById(classModuleId)
                .then((res) => {
                    setClassModule(res.data);
                    courseService
                        .getAllEnrollmentsByCourse(res.data.courseId)
                        .then((res) => {
                            const notRefundEnrollments = res.data.filter(enrollment => enrollment.refundStatus === false);

                            console.log(res.data);
                            setEnrollmentList(notRefundEnrollments);

                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    attendanceService.getAllLearnerAttendanceByAttendance(res.data.attendance?.id)
                        .then((res) => {
                            // console.log(res.data);
                            setLearnerAttendanceList(res.data);

                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    classLessonService
                        .getAllClassTopicsByClassLesson(res.data.classLesson?.id)
                        .then((res) => {
                            // console.log(res.data);
                            setClassTopicList(res.data);

                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    setLoading(false);

                })
        }

    }, [classModuleId]);



    //learner attendance
    const [learnerAttendance, setLearnerAttendance] = useState({
        attendanceId: classModule.attendance?.id,
        learnerId: '',
        attended: ''
    });

    const handleChange = (e, learnerId) => {
        const { checked } = e.target;
        setLearnerAttendance(prevState => ({
            ...prevState,
            [learnerId]: {
                ...prevState[learnerId],
                attended: checked
            }
        }));
    };


    const submitLearnerAttendance = async (e) => {
        e.preventDefault();
        try {
            // Create an array to store all attendance records
            const allAttendances = [];

            // Iterate over all learners in the enrollment list
            enrollmentList.forEach(enrollment => {
                const learnerId = enrollment.transaction?.learnerId;
                const attended = learnerAttendance[learnerId]?.attended || false; // Default to false if attended is not set
                // Create an attendance record for the learner
                const attendance = {
                    attendanceId: classModule.attendance?.id,
                    learnerId: learnerId,
                    attended: attended
                };
                // Push the attendance record to the array
                allAttendances.push(attendance);
            });

            // Log all attendance records before sending
            console.log("All Attendances:", allAttendances);

            // Save all learner attendances
            await Promise.all(allAttendances.map(attendance =>
                learnerAttendanceService.saveLearnerAttendance(attendance)
            ));
        } catch (error) {
            console.log(error);
        }
    };





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

                                                    {loading && (
                                                        <div className="loading-overlay">
                                                            <div className="loading-spinner" />
                                                        </div>
                                                    )}
                                                    {classModule.startDate && new Date().toISOString().substring(0, 10) === classModule.startDate.substring(0, 10) && (
                                                        <div className="table-responsive text-center">
                                                            <form
                                                                method="post"
                                                                data-parsley-validate
                                                                onSubmit={(e) => submitLearnerAttendance(e)}
                                                            >
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
                                                                            <th>Attended</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {enrollmentList.length > 0 && enrollmentList.map((enrollment, index) => (
                                                                            <tr key={enrollment.id}>
                                                                                <td>{index + 1}</td>
                                                                                <td>
                                                                                    <img src={enrollment.transaction?.learner?.account?.imageUrl} style={{ height: '70px', width: '50px' }} alt="learner-img" />
                                                                                </td>
                                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.fullName ? enrollment.transaction?.learner?.account?.fullName : 'Unknown Name'}</td>
                                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.phoneNumber ? enrollment.transaction?.learner?.account?.phoneNumber : 'Unknown Phone Number'}</td>
                                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.gender !== undefined ? (enrollment.transaction?.learner?.account?.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>
                                                                                <td>
                                                                                    {enrollment.transaction?.learner?.account?.dateOfBirth && typeof enrollment.transaction?.learner?.account?.dateOfBirth === 'string' ?
                                                                                        enrollment.transaction?.learner?.account?.dateOfBirth.substring(0, 10) :
                                                                                        'Unknown DOB'}
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="hidden"
                                                                                        value={enrollment.transaction?.learnerId}
                                                                                        name="learnerId"
                                                                                        onChange={(e) => handleChange(e)}
                                                                                    />
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name="attended"
                                                                                        checked={learnerAttendance[enrollment.transaction?.learnerId]?.attended || false}
                                                                                        onChange={(e) => handleChange(e, enrollment.transaction?.learnerId)}
                                                                                    />

                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>


                                                                <div className="form-group mb-0 mt-2">
                                                                    <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                                        Save
                                                                    </button>
                                                                </div>

                                                            </form>
                                                        </div>

                                                    )}

                                                    {classModule.startDate && new Date().toISOString().substring(0, 10) < classModule.startDate.substring(0, 10) && (
                                                        <div className="table-responsive text-center">
                                                            <form
                                                                method="post"
                                                                data-parsley-validate
                                                                onSubmit={(e) => submitLearnerAttendance(e)}
                                                            >
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
                                                                            <th>Attended</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {enrollmentList.length > 0 && enrollmentList.map((enrollment, index) => (
                                                                            <tr key={enrollment.id}>
                                                                                <td>{index + 1}</td>
                                                                                <td>
                                                                                    <img src={enrollment.transaction?.learner?.account?.imageUrl} style={{ height: '70px', width: '50px' }} alt="learner-img" />
                                                                                </td>
                                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.fullName ? enrollment.transaction?.learner?.account?.fullName : 'Unknown Name'}</td>
                                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.phoneNumber ? enrollment.transaction?.learner?.account?.phoneNumber : 'Unknown Phone Number'}</td>
                                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.gender !== undefined ? (enrollment.transaction?.learner?.account?.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>
                                                                                <td>
                                                                                    {enrollment.transaction?.learner?.account?.dateOfBirth && typeof enrollment.transaction?.learner?.account?.dateOfBirth === 'string' ?
                                                                                        enrollment.transaction?.learner?.account?.dateOfBirth.substring(0, 10) :
                                                                                        'Unknown DOB'}
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="hidden"
                                                                                        value={enrollment.transaction?.learnerId}
                                                                                        name="learnerId"
                                                                                        onChange={(e) => handleChange(e)}
                                                                                    />
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name="attended"
                                                                                        checked={learnerAttendance[enrollment.transaction?.learnerId]?.attended || false}
                                                                                        onChange={(e) => handleChange(e, enrollment.transaction?.learnerId)}
                                                                                        disabled
                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>

                                                            </form>
                                                        </div>
                                                    )}
                                                    {classModule.startDate && new Date().toISOString().substring(0, 10) > classModule.startDate.substring(0, 10) && (
                                                        <div className="table-responsive text-center">
                                                            <form
                                                                method="post"
                                                                data-parsley-validate
                                                                onSubmit={(e) => submitLearnerAttendance(e)}
                                                            >
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
                                                                            <th>Attended</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {learnerAttendanceList.length > 0 && learnerAttendanceList.map((learnerAttendance, index) => (
                                                                            <tr key={learnerAttendance.id}>
                                                                                <td>{index + 1}</td>
                                                                                <td>
                                                                                    <img src={learnerAttendance.learner?.account?.imageUrl} style={{ height: '70px', width: '50px' }} alt="learner-img" />
                                                                                </td>
                                                                                <td>{learnerAttendance.learner?.account && learnerAttendance.learner?.account?.fullName ? learnerAttendance.learner?.account?.fullName : 'Unknown Name'}</td>
                                                                                <td>{learnerAttendance.learner?.account && learnerAttendance.learner?.account?.phoneNumber ? learnerAttendance.learner?.account?.phoneNumber : 'Unknown Phone Number'}</td>
                                                                                <td>{learnerAttendance.learner?.account && learnerAttendance.learner?.account?.gender !== undefined ? (learnerAttendance.learner?.account?.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>
                                                                                <td>
                                                                                    {learnerAttendance.learner?.account?.dateOfBirth && typeof learnerAttendance.learner?.account?.dateOfBirth === 'string' ?
                                                                                        learnerAttendance.learner?.account?.dateOfBirth.substring(0, 10) :
                                                                                        'Unknown DOB'}
                                                                                </td>
                                                                                <td>

                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name={`attended-${index}`}
                                                                                        checked={learnerAttendance.attended}
                                                                                        disabled
                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>

                                                            </form>
                                                        </div>

                                                    )}


                                                    <h5 className='mt-3'>TOPICS:</h5>
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
                                                                {classTopicList.length > 0 && classTopicList.map((classTopic, index) => (
                                                                    <tr key={classTopic.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{classTopic.name}</td>
                                                                        <td>{classTopic.description}</td>
                                                                        <td>{classTopic.createdDate}</td>
                                                                        <td>{classTopic.updatedDate}</td>
                                                                        <td>
                                                                            <Link to={`/list-assignment-attempt-by-topic/${classTopic.id}`} className='text-secondary'>
                                                                                <i className="fa-regular fa-eye"></i>
                                                                            </Link>
                                                                        </td>
                                                                        {/* <td>
                                                                        <Link to={`/tutor/courses/edit-topic/${classTopic.id}`} className='text-secondary'>
                                                                            <i className="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td> */}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div> {/* end .table-responsive*/}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <style>
                {`
                      .loading-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        backdrop-filter: blur(10px); /* Apply blur effect */
                        -webkit-backdrop-filter: blur(10px); /* For Safari */
                        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999; /* Ensure it's on top of other content */
                    }
                    
                    .loading-spinner {
                        border: 8px solid rgba(245, 141, 4, 0.1); /* Transparent border to create the circle */
                        border-top: 8px solid #f58d04; /* Orange color */
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        animation: spin 1s linear infinite; /* Rotate animation */
                    }
                    
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    
                
                `}
            </style>
        </>
    );

}

export default TeachClass