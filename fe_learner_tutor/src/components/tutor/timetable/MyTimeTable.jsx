import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import tutorService from '../../../services/tutor.service';
import courseService from '../../../services/course.service';
import classLessonService from '../../../services/class-lesson.service';
import { event } from 'jquery';

const MyTimeTable = () => {
    const { tutorId } = useParams();

    const [courseList, setCourseList] = useState([]);
    const [classModuleList, setClassModuleList] = useState([]);
    const [classTopicList, setClassTopicList] = useState([]);
    const [startDate, setStartDate] = useState(getStartOfWeek(new Date()));
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }


    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseResponse = await tutorService.getAllCoursesByTutor(tutorId);
                const classCourses = courseResponse.data.filter(course => course.isOnlineClass === true);

                setCourseList(classCourses);

                const classModulesPromises = classCourses.map(course =>
                    courseService.getAllClassModulesByCourse(course.id)
                );

                const classModulesResponses = await Promise.all(classModulesPromises);
                const classModules = classModulesResponses.flatMap(response => response.data);
                setClassModuleList(classModules);

                const classTopicsPromises = classModules.map(classModule =>
                    classLessonService.getAllClassTopicsByClassLesson(classModule.classLesson?.id)
                );

                const classTopicsResponses = await Promise.all(classTopicsPromises);
                const classTopics = classTopicsResponses.flatMap(response => response.data);
                setClassTopicList(classTopics);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [tutorId]);

    // Function to get the day of the week for a given date
    const getDayOfWeek = (dateString) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        const startOfWeek = getStartOfWeek(startDate);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6); // Assuming weeks run from Monday to Sunday
        if (date >= startOfWeek && date <= endOfWeek) {
            return days[date.getDay()];
        }
        return null;
    };


    // Function to get the start of the current week
    function getStartOfWeek(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(date);
        startOfWeek.setDate(diff);
        return startOfWeek;
    }

    // Function to handle previous week button click
    const handlePreviousWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() - 7);
        setStartDate(newStartDate);
    };

    // Function to handle next week button click
    const handleNextWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() + 7);
        setStartDate(getStartOfWeek(newStartDate));
    };

    // Function to generate a random color code
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Function to generate time slots within the range
    const generateTimeSlots = () => {
        const slots = [];
        const startTime = new Date(`01/01/2024 07:00 AM`);
        const endTime = new Date(`01/02/2024 00:00 AM`);
        let currentTime = new Date(startTime);

        while (currentTime < endTime) {
            slots.push(currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
            currentTime.setHours(currentTime.getHours() + 1);
        }

        return slots;
    };


    //go to teach class
    const handleTeachClass = (event, classModuleId) => {
        event.preventDefault();
        navigate(`/teach-class/${classModuleId}`)
    }

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
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between mb-3">
                                                <button className="btn btn-success" onClick={handlePreviousWeek} style={{ borderRadius: '50px', padding: `8px 25px` }}>Previous Week</button>
                                                <span style={{ fontWeight: 'bold', fontSize: 'larger' }}>{new Date(startDate).toLocaleDateString('en-US')}</span> {/* Display date without time */}
                                                <button className="btn btn-success" onClick={handleNextWeek} style={{ borderRadius: '50px', padding: `8px 25px` }}>Next Week</button>
                                            </div>

                                            {loading && (
                                                <div className="loading-overlay">
                                                    <div className="loading-spinner" />
                                                </div>
                                            )}
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            {/* Generate columns for each day of the week */}
                                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                                                                <th key={index}>
                                                                    <div>{day}</div>
                                                                    {/* Display the start date for each day */}
                                                                    <div>
                                                                        {classModuleList
                                                                            .filter(classModule => getDayOfWeek(classModule.startDate) === day)
                                                                            .map((classModule, index) => (
                                                                                <div key={index}>{new Date(classModule.startDate).toLocaleDateString('en-US')}</div>
                                                                            ))}
                                                                    </div>
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {/* Display classes */}
                                                        {generateTimeSlots().map((time, timeIndex) => (
                                                            <tr key={timeIndex}>
                                                                <td>{time}</td>
                                                                {/* Generate columns for each day of the week */}
                                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dayIndex) => {
                                                                    const modulesForDay = classModuleList.filter(classModule => getDayOfWeek(classModule.startDate) === day);
                                                                    return (
                                                                        <td key={dayIndex} style={{
                                                                            backgroundColor: modulesForDay.some(classModule => {
                                                                                const startTime = new Date(`01/01/2024 ${classModule.classLesson?.classHours.split(' - ')[0]}`);
                                                                                const endTime = new Date(`01/01/2024 ${classModule.classLesson?.classHours.split(' - ')[1]}`);
                                                                                return startTime <= new Date(`01/01/2024 ${time}`) && endTime >= new Date(`01/01/2024 ${time}`);
                                                                            }) ? getRandomColor() : 'transparent'
                                                                        }}>
                                                                            <div>
                                                                                {
                                                                                    modulesForDay.length > 0 && modulesForDay.map((classModule, classIndex) => (
                                                                                        <div key={classIndex}>
                                                                                            {/* Check if class falls within the time range */}
                                                                                            {(new Date(`01/01/2024 ${classModule.classLesson?.classHours.split(' - ')[0]}`) <= new Date(`01/01/2024 ${time}`) &&
                                                                                                new Date(`01/01/2024 ${classModule.classLesson?.classHours.split(' - ')[1]}`) >= new Date(`01/01/2024 ${time}`)) && (
                                                                                                    <div onClick={(event) => handleTeachClass(event, classModule.id)}>
                                                                                                        <div>{classModule.classLesson?.classHours}</div>
                                                                                                        <div>
                                                                                                            <a href={classModule.classLesson?.classUrl} target="_blank" rel="noopener noreferrer">Join Class</a>
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <span className='text-danger' style={{ fontWeight: 'bold' }}>Topics:</span>
                                                                                                            {classTopicList
                                                                                                                .filter(topic => topic.classLessonId === classModule.classLesson?.id)
                                                                                                                .map((topic, topicIndex) => (
                                                                                                                    <div key={topicIndex}>- {topic.name}</div>
                                                                                                                ))}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div> {/* end card body*/}
                                    </div> {/* end card */}
                                </div>
                                {/* end col-12 */}
                            </div> {/* end row */}
                        </div> {/* container */}
                    </div> {/* content */}
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
};

export default MyTimeTable;
