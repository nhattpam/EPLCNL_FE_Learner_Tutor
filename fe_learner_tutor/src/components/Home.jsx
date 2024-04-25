import React, { useEffect, useState } from 'react'; import Footer from './Footer'
import Header from './Header'
import { Link } from 'react-router-dom'
import courseService from '../services/course.service';
import accountService from '../services/account.service';
import tutorService from '../services/tutor.service';
import centerService from '../services/center.service';

const Home = () => {


  const [courseList, setCourseList] = useState([]);
  const [tutorList, setTutorList] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [learnersCount, setLearnersCount] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getAllcourse();
        const activeCourses = res.data.filter((course) => course.isActive === true);
        setCourseList(activeCourses);

        // Fetch number of learners for each course
        const learnersCounts = {}; // Object to store number of learners for each course
        for (const course of activeCourses) {
          try {
            const learnersResponse = await courseService.getAllEnrollmentsByCourse(course.id);
            const learnersOfCourse = learnersResponse.data;
            learnersCounts[course.id] = learnersOfCourse.length; // Store learner count for the course
            // console.log(`Number of learners for course ${course.name}: ` + learnersOfCourse.length);
          } catch (error) {
            console.error(`Error fetching learners for course ${course.name}:`, error);
          }
        }
        setLearnersCount(learnersCounts); // Update state with learners count
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);


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

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await tutorService.getAllTutor();
        const activeTutors = res.data.filter((tutor) => tutor.account?.isActive === true);
        const limitedTutors = activeTutors.slice(0, 6); // Limit to 6 tutors
        setTutorList(limitedTutors);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTutors();
  }, []);



  //CENTER DETAIL
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [centerCourseList, seCenterCourseList] = useState([]);

  const [center, setCenter] = useState({
    id: '',
    name: "",
    address: "",
    description: "",
    isActive: true,
    staffId: "",
    accountId: ""
  });

  const openCenterModal = (event, centerId) => {
    event.preventDefault();
    centerService
      .getCenterById(centerId)
      .then((res) => {
        setCenter(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    centerService
      .getAllCourseByCenterId(centerId)
      .then((res) => {
        const filteredCourseList = res.data.filter(x => x.isActive === true);
        const sortedCourseList = [...filteredCourseList].sort((a, b) => {
          // Assuming requestedDate is a string in ISO 8601 format
          return new Date(b.createdDate) - new Date(a.createdDate);
        });

        seCenterCourseList(sortedCourseList);
      })
      .catch((error) => {
        // console.log(error);
      });
    setShowCenterModal(true);
  };

  const closeCenterModal = () => {
    setShowCenterModal(false);
  };


  return (
    <>
      <Header />
      {/* ======= Hero Section ======= */}
      <section id="hero" className="d-flex justify-content-center align-items-center">
        <div className="container position-relative" data-aos="zoom-in" data-aos-delay={100}>
          <h1>Learning Today,<br />Leading Tomorrow</h1>
          <h2>Learning With Your Own Style</h2>
          <Link to={"/list-course"} className="btn-get-started">Get Started</Link>
        </div>
      </section>{/* End Hero */}
      <main id="main" style={{ backgroundColor: '#fff' }}>
        {/* ======= About Section ======= */}
        <section id="about" className="about" style={{ backgroundColor: '#fff' }}>
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-left" data-aos-delay={100}>
                <img src="assets/img/about.jpg" className="img-fluid" alt />
              </div>
              <div className="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 content">
                <h3>Better Understanding,
                  Better Learning.</h3>
                <ul>
                  <li><i className="bi bi-check-circle" /> The course is designed according to needs, with autonomy over learning speed and amount of knowledge, and multi-dimensional support. Contextualized Learning embeds knowledge according to the learner's context.</li>
                  <li><i className="bi bi-check-circle" /> Complete curriculum system, practice test with exclusive test bank, system of books, lectures and exercises integrated with artificial intelligence.</li>
                  <li><i className="bi bi-check-circle" /> The lesson content system is oriented and developed based on results drawn from scientific research on Personalized Learning.</li>
                </ul>

              </div>
            </div>
          </div>
        </section>{/* End About Section */}
        {/* ======= Counts Section ======= */}
        <section id="counts" className="counts section-bg" style={{ backgroundColor: '#fff' }}>
          <div className="container">
            <div className="row counters">

            </div>
          </div>
        </section>{/* End Counts Section */}
        {/* ======= Why Us Section ======= */}
        <section id="why-us" className="why-us" style={{ backgroundColor: '#fff' }}>
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-4 d-flex align-items-stretch">
                <div className="content">
                  <h3>Why Choose MeowLish?</h3>
                  <p>
                    The big difference and special feature of the MeowLish is the selection of lesson units, topics, formats... appropriate to the level and with increasing difficulty. Helps learners gradually absorb both the language and the ability to handle increasingly difficult lessons and questions over time.
                  </p>
                  <div className="text-center">
                    <a href="about.html" className="more-btn">Learn More <i className="bx bx-chevron-right" /></a>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay={100}>
                <div className="icon-boxes d-flex flex-column justify-content-center">
                  <div className="row">
                    <div className="col-xl-4 d-flex align-items-stretch info-item">
                      <div className="icon-box mt-4 mt-xl-0">
                        <i className="bx bx-receipt" />
                        <h4>A team of dedicated and experienced teachers</h4>
                        <p>With a team of teachers with many years of experience in teaching and good communication. They are teachers who are always dedicated to their students with the sole goal of improving foreign language proficiency for the younger generation.</p>
                      </div>
                    </div>
                    <div className="col-xl-4 d-flex align-items-stretch info-item">
                      <div className="icon-box mt-4 mt-xl-0">
                        <i className="bx bx-cube-alt" />
                        <h4>Pre Foundation + Foundation</h4>
                        <p>Start advanced learning with a focus on practicing how to do the 4 skills correctly and ensure the scoring criteria of the test.</p>
                      </div>
                    </div>
                    <div className="col-xl-4 d-flex align-items-stretch info-item">
                      <div className="icon-box mt-4 mt-xl-0">
                        <i className="bx bx-images" />
                        <h4>MeowLish's exclusive technology platform</h4>
                        <p>From doing Assignment and receiving corrections, to practicing Reading, Listening Test and learning Vocabulary, MeowLish has integrated it into the home practice system, exclusively for MeowLish students.</p>
                      </div>
                    </div>
                  </div>
                </div>{/* End .content*/}
              </div>
            </div>
          </div>
        </section>{/* End Why Us Section */}
        {/* ======= Features Section ======= */}
        <section id="features" className="features" style={{ backgroundColor: '#fff' }}>
          <div className="container" data-aos="fade-up">
            <div className="row" data-aos="zoom-in" data-aos-delay={100}>
              <div className="col-lg-3 col-md-4">
                <div className="icon-box">
                  <i className="ri-store-line" style={{ color: '#ffbb2c' }} />
                  <h3><a href>Expert Guidance</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4 mt-md-0">
                <div className="icon-box">
                  <i className="ri-bar-chart-box-line" style={{ color: '#5578ff' }} />
                  <h3><a href>Time-Saving Solutions</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4 mt-md-0">
                <div className="icon-box">
                  <i className="ri-calendar-todo-line" style={{ color: '#e80368' }} />
                  <h3><a href>Exceptional Quality</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4 mt-lg-0">
                <div className="icon-box">
                  <i className="ri-paint-brush-line" style={{ color: '#e361ff' }} />
                  <h3><a href>Efficient Services</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-database-2-line" style={{ color: '#47aeff' }} />
                  <h3><a href>Premium Performance</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-gradienter-line" style={{ color: '#ffa76e' }} />
                  <h3><a href>Superior Results</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-file-list-3-line" style={{ color: '#11dbcf' }} />
                  <h3><a href>Convenient Options</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-price-tag-2-line" style={{ color: '#4233ff' }} />
                  <h3><a href>Reliable Support</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-anchor-line" style={{ color: '#b2904f' }} />
                  <h3><a href>Innovative Solutions</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-disc-line" style={{ color: '#b20969' }} />
                  <h3><a href>Streamlined Processes</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-base-station-line" style={{ color: '#ff5828' }} />
                  <h3><a href>Effective Strategies</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-fingerprint-line" style={{ color: '#29cc61' }} />
                  <h3><a href>Unmatched Value</a></h3>
                </div>
              </div>
            </div>
          </div>
        </section>{/* End Features Section */}
        {/* ======= Popular Courses Section ======= */}
        <section id="popular-courses" className="courses">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Courses</h2>
              <p>Popular Courses</p>
            </div>
            <div className="row" data-aos="zoom-in" data-aos-delay={100}>
              {courseList.map((course, index) => (
                <div key={course.id} className="col-lg-4  d-flex align-items-baseline mt-3">
                  <div className="course-item" style={{ borderRadius: '30px' }}>
                    <img src={course.imageUrl} className="img-fluid" alt="..." />
                    <div className="course-content">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mr-1">{course.category?.name}</h4>
                        <div className="d-flex align-items-center mr-1"> {/* New div to contain the rating and star icon */}
                          <p className="price">{parseFloat(course.rating).toFixed(0)}</p> {/* Added mr-1 class for small right margin */}
                          <i className="fas fa-star text-warning "></i>
                        </div>
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
                              {
                                !course.tutor?.isFreelancer && (
                                  <>
                                    <div>
                                      <button style={{ backgroundColor: '#f58d04', color: '#fff', border: 'none' }} onClick={(event) => openCenterModal(event, course.tutor?.center?.id)}>{course.tutor?.center?.name}</button>
                                    </div>
                                  </>

                                )
                              }
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
              ))}
            </div>
          </div>
        </section>{/* End Popular Courses Section */}
        {
          showCenterModal && (
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
              <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Center Information</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeCenterModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {/* Conditional rendering based on edit mode */}
                    <h3 style={{ fontWeight: 'bold' }}>{center.name}</h3>
                    <h4>Address: {center.address}</h4>
                    <section id="courses" className="courses">
                      <div className="container" data-aos="fade-up">
                        <div className="row" data-aos="zoom-in" data-aos-delay={100}>
                          {
                            centerCourseList.length > 0 && centerCourseList.map((course, index) => (
                              <div key={course.id} className="col-lg-4 col-md-6 d-flex align-items-baseline">
                                <div className="course-item mt-4" style={{ borderRadius: '50px', width: '600px' }}>
                                  <img src={course.imageUrl} className="img-fluid" alt="..." />
                                  <div className="course-content">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <h4>{course.category?.name}</h4>
                                    </div>
                                    <h3><Link to={`/detail-course/${course.id}`}>{course.name}</Link></h3>
                                    <p>{course.description}</p>

                                  </div>
                                </div>
                              </div>
                            ))
                          }
                          {
                            courseList.length === 0 && (
                              <h5>No courses found.</h5>
                            )
                          }

                        </div>
                      </div>
                    </section>{/* End Courses Section */}
                  </div>

                  <div className="modal-footer">
                    {/* Conditional rendering of buttons based on edit mode */}
                    <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: `8px 25px` }} onClick={closeCenterModal}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* ======= Trainers Section ======= */}
        <section id="trainers" className="trainers">
          <div className="container" data-aos="fade-up">
            <div className="row" data-aos="zoom-in" data-aos-delay={100}>
              {tutorList.map((tutor, index) => (
                <div key={tutor.id} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                  <div className="member  info-item" style={{ borderRadius: '50px', padding: `8px 20px` }}>
                    <img src={tutor.account?.imageUrl} className="img-fluid" alt />
                    <div className="member-content">
                      <h4>{tutor.account?.fullName}</h4>
                      <span>{tutor.account?.email}</span>

                      <div className="social">
                        <a href><i className="bi bi-twitter" /></a>
                        <a href><i className="bi bi-facebook" /></a>
                        <a href><i className="bi bi-instagram" /></a>
                        <a href><i className="bi bi-linkedin" /></a>
                      </div>
                    </div>
                  </div>
                </div>

              ))}

            </div>
          </div>
        </section>{/* End Trainers Section */}
      </main>{/* End #main */}
      <Footer />

      <style>
        {`
                .info-item {
                    transition: transform 0.3s ease;
                }
                
                .info-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
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

export default Home