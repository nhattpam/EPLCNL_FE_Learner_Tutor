import React, { useEffect, useState } from 'react';
import Header from '../Header'
import Footer from '../Footer'
import { Link, useParams } from 'react-router-dom'
import courseService from '../../services/course.service'
import accountService from '../../services/account.service';
import categoryService from '../../services/category.service';

const ListCourseByCategory = () => {

    const { categoryId } = useParams();

    const [courseList, setCourseList] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [learnersCount, setLearnersCount] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await categoryService.getAllCourseByCategoryId(categoryId);
                const activeCourses = res.data.filter((course) => course.isActive === true);
                setCourseList(activeCourses);

                const learnersCounts = {}; // Object to store number of learners for each course
                for (const course of activeCourses) {
                    try {
                        const learnersResponse = await courseService.getAllEnrollmentsByCourse(course.id);
                        const learnersOfCourse = learnersResponse.data;
                        learnersCounts[course.id] = learnersOfCourse.length; // Store learner count for the course
                        console.log(`Number of learners for course ${course.name}: ` + learnersOfCourse.length);
                    } catch (error) {
                        console.error(`Error fetching learners for course ${course.name}:`, error);
                    }
                }
                setLearnersCount(learnersCounts); // Update state with learners count
            } catch (error) {
                console.log(error);
            }
        };

        fetchCourses();
    }, [categoryId]); // Empty dependency array to fetch courses only once when the component mounts

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const accountPromises = courseList.map((course) =>
                    accountService.getAccountById(course.tutor.accountId)
                );

                const accountResponses = await Promise.all(accountPromises);
                const accountData = accountResponses.map((response) => response.data);
                setAccounts(accountData);
            } catch (error) {
                console.log(error);
            }
        };

        if (courseList.length > 0) {
            fetchAccountInfo();
        }
    }, [courseList]);

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in">
                {/* ======= Breadcrumbs ======= */}
                <div className="breadcrumbs">
                    <div className="container">
                        <h2 style={{ color: '#fff' }}>Courses</h2>
                        <p style={{ color: '#000' }}>Learn English online as well as offline with Linearthinking method, dedicated teachers, supporting technology platform, guaranteed output. </p>
                    </div>
                </div>{/* End Breadcrumbs */}
                {/* ======= Courses Section ======= */}
                <section id="courses" className="courses">
                    <div className="container" data-aos="fade-up">
                        <div className="row" data-aos="zoom-in" data-aos-delay={100}>
                            {
                                courseList.length > 0 && courseList.map((course, index) => (
                                    <div key={course.id} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                        <div className="course-item">
                                            <img src={course.imageUrl} className="img-fluid" alt="..." />
                                            <div className="course-content">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h4>{course.category?.name}</h4>
                                                    <p className="price">{parseFloat(course.rating).toFixed(0)} <i class="fas fa-star text-warning "></i></p>
                                                    <p className="price">{`$${course.stockPrice}`}</p>
                                                </div>
                                                <h3><Link to={`/detail-course/${course.id}`}>{course.name}</Link></h3>
                                                <p>{course.description}</p>
                                                <div className="trainer d-flex justify-content-between align-items-center">
                                                    <div className="trainer-profile d-flex align-items-center">
                                                        {accounts[index] && (
                                                            <div key={accounts[index].id}>
                                                                <img src={accounts[index].imageUrl} className="img-fluid" alt="" />
                                                                <span>{accounts[index].fullName}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="trainer-rank d-flex align-items-center">
                                                        <i className="bx bx-user" />&nbsp;{learnersCount[course.id]}
                                                        &nbsp;
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))

                            }
                            {courseList.length <= 0 && (
                                <p>No Courses Found.</p>
                            )}

                        </div>
                    </div>
                </section>{/* End Courses Section */}
            </main>{/* End #main */}

            <Footer />
            <style>
                {`
                .course-item {
                    transition: transform 0.3s ease;
                }
                
                .course-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                
                `}
            </style>
        </>
    )
}

export default ListCourseByCategory