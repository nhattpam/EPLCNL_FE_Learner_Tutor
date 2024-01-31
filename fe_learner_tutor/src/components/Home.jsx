import React, { useEffect, useState } from 'react'; import Footer from './Footer'
import Header from './Header'
import { Link } from 'react-router-dom'
import courseService from '../services/course.service';
import accountService from '../services/account.service';

const Home = () => {


  const [courseList, setCourseList] = useState([]);
  const [tutorList, setTutorList] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getAllcourse();
        const activeCourses = res.data.filter((course) => course.isActive === true);
        setCourseList(activeCourses);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, []); // Empty dependency array to fetch courses only once when the component mounts

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
      {/* ======= Hero Section ======= */}
      <section id="hero" className="d-flex justify-content-center align-items-center">
        <div className="container position-relative" data-aos="zoom-in" data-aos-delay={100}>
          <h1>Learning Today,<br />Leading Tomorrow</h1>
          <h2>Learning With Your Own Style</h2>
          <Link to={"/list-course"} className="btn-get-started">Get Started</Link>
        </div>
      </section>{/* End Hero */}
      <main id="main">
        {/* ======= About Section ======= */}
        <section id="about" className="about">
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
        <section id="counts" className="counts section-bg">
          <div className="container">
            <div className="row counters">
              <div className="col-lg-3 col-6 text-center">
                <span data-purecounter-start={0} data-purecounter-end={1232} data-purecounter-duration={1} className="purecounter" />
                <p>Students</p>
              </div>
              <div className="col-lg-3 col-6 text-center">
                <span data-purecounter-start={0} data-purecounter-end={64} data-purecounter-duration={1} className="purecounter" />
                <p>Courses</p>
              </div>
              <div className="col-lg-3 col-6 text-center">
                <span data-purecounter-start={0} data-purecounter-end={42} data-purecounter-duration={1} className="purecounter" />
                <p>Events</p>
              </div>
              <div className="col-lg-3 col-6 text-center">
                <span data-purecounter-start={0} data-purecounter-end={15} data-purecounter-duration={1} className="purecounter" />
                <p>Trainers</p>
              </div>
            </div>
          </div>
        </section>{/* End Counts Section */}
        {/* ======= Why Us Section ======= */}
        <section id="why-us" className="why-us">
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
                    <div className="col-xl-4 d-flex align-items-stretch">
                      <div className="icon-box mt-4 mt-xl-0">
                        <i className="bx bx-receipt" />
                        <h4>A team of dedicated and experienced teachers</h4>
                        <p>With a team of teachers with many years of experience in teaching and good communication. They are teachers who are always dedicated to their students with the sole goal of improving foreign language proficiency for the younger generation.</p>
                      </div>
                    </div>
                    <div className="col-xl-4 d-flex align-items-stretch">
                      <div className="icon-box mt-4 mt-xl-0">
                        <i className="bx bx-cube-alt" />
                        <h4>Pre Foundation + Foundation</h4>
                        <p>Start advanced learning with a focus on practicing how to do the 4 skills correctly and ensure the scoring criteria of the test.</p>
                      </div>
                    </div>
                    <div className="col-xl-4 d-flex align-items-stretch">
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
        <section id="features" className="features">
          <div className="container" data-aos="fade-up">
            <div className="row" data-aos="zoom-in" data-aos-delay={100}>
              <div className="col-lg-3 col-md-4">
                <div className="icon-box">
                  <i className="ri-store-line" style={{ color: '#ffbb2c' }} />
                  <h3><a href>Lorem Ipsum</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4 mt-md-0">
                <div className="icon-box">
                  <i className="ri-bar-chart-box-line" style={{ color: '#5578ff' }} />
                  <h3><a href>Dolor Sitema</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4 mt-md-0">
                <div className="icon-box">
                  <i className="ri-calendar-todo-line" style={{ color: '#e80368' }} />
                  <h3><a href>Sed perspiciatis</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4 mt-lg-0">
                <div className="icon-box">
                  <i className="ri-paint-brush-line" style={{ color: '#e361ff' }} />
                  <h3><a href>Magni Dolores</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-database-2-line" style={{ color: '#47aeff' }} />
                  <h3><a href>Nemo Enim</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-gradienter-line" style={{ color: '#ffa76e' }} />
                  <h3><a href>Eiusmod Tempor</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-file-list-3-line" style={{ color: '#11dbcf' }} />
                  <h3><a href>Midela Teren</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-price-tag-2-line" style={{ color: '#4233ff' }} />
                  <h3><a href>Pira Neve</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-anchor-line" style={{ color: '#b2904f' }} />
                  <h3><a href>Dirada Pack</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-disc-line" style={{ color: '#b20969' }} />
                  <h3><a href>Moton Ideal</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-base-station-line" style={{ color: '#ff5828' }} />
                  <h3><a href>Verdo Park</a></h3>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 mt-4">
                <div className="icon-box">
                  <i className="ri-fingerprint-line" style={{ color: '#29cc61' }} />
                  <h3><a href>Flavor Nivelanda</a></h3>
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
                <div key={course.id} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                  <div className="course-item">
                    <img src={course.imageUrl} className="img-fluid" alt="..." />
                    <div className="course-content">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>{course.category?.name}</h4>
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
                          <i className="bx bx-user" />&nbsp;{course.numUsers}
                          &nbsp;&nbsp;
                          <i className="bx bx-heart" />&nbsp;{course.numHearts}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>{/* End Popular Courses Section */}


        {/* ======= Trainers Section ======= */}
        <section id="trainers" className="trainers">
          <div className="container" data-aos="fade-up">
            <div className="row" data-aos="zoom-in" data-aos-delay={100}>
              <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
                <div className="member">
                  <img src="assets/img/trainers/trainer-1.jpg" className="img-fluid" alt />
                  <div className="member-content">
                    <h4>Walter White</h4>
                    <span>Web Development</span>
                    <p>
                      Magni qui quod omnis unde et eos fuga et exercitationem. Odio veritatis perspiciatis quaerat qui aut aut aut
                    </p>
                    <div className="social">
                      <a href><i className="bi bi-twitter" /></a>
                      <a href><i className="bi bi-facebook" /></a>
                      <a href><i className="bi bi-instagram" /></a>
                      <a href><i className="bi bi-linkedin" /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
                <div className="member">
                  <img src="assets/img/trainers/trainer-2.jpg" className="img-fluid" alt />
                  <div className="member-content">
                    <h4>Sarah Jhinson</h4>
                    <span>Marketing</span>
                    <p>
                      Repellat fugiat adipisci nemo illum nesciunt voluptas repellendus. In architecto rerum rerum temporibus
                    </p>
                    <div className="social">
                      <a href><i className="bi bi-twitter" /></a>
                      <a href><i className="bi bi-facebook" /></a>
                      <a href><i className="bi bi-instagram" /></a>
                      <a href><i className="bi bi-linkedin" /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
                <div className="member">
                  <img src="assets/img/trainers/trainer-3.jpg" className="img-fluid" alt />
                  <div className="member-content">
                    <h4>William Anderson</h4>
                    <span>Content</span>
                    <p>
                      Voluptas necessitatibus occaecati quia. Earum totam consequuntur qui porro et laborum toro des clara
                    </p>
                    <div className="social">
                      <a href><i className="bi bi-twitter" /></a>
                      <a href><i className="bi bi-facebook" /></a>
                      <a href><i className="bi bi-instagram" /></a>
                      <a href><i className="bi bi-linkedin" /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>{/* End Trainers Section */}
      </main>{/* End #main */}
      <Footer />
    </>
  )
}

export default Home