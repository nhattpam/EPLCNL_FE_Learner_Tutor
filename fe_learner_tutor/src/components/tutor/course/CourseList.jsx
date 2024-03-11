import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import tutorService from '../../../services/tutor.service';

const CourseList = () => {
    const [courseList, setCourseList] = useState([]);
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [coursesPerPage] = useState(5);
    const { tutorId } = useParams();

    useEffect(() => {
        tutorService
            .getAllCoursesByTutor(tutorId)
            .then((res) => {
                setCourseList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [tutorId]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCourses = courseList.filter((course) => {
        return course.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * coursesPerPage;
    const currentCourses = filteredCourses.slice(offset, offset + coursesPerPage);

    useEffect(() => {
        // Prevent going back
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', handleBackButtonEvent);

        return () => {
            window.removeEventListener('popstate', handleBackButtonEvent);
        };
    }, []);

    const handleBackButtonEvent = (event) => {
        window.history.pushState(null, null, window.location.pathname);
    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    <div className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <h4 className="page-title">LIST OF COURSES</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <div className="mb-2">
                                            <div className="row">
                                                <div className="col-12 text-sm-center form-inline">
                                                    <Link to="/tutor/courses/create" >
                                                        <button className="btn btn-success mr-2">
                                                            Create
                                                        </button>
                                                    </Link>

                                                    <div className="form-group">
                                                        <input type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" value={searchTerm} onChange={handleSearch} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Image</th>
                                                        <th>CODE</th>
                                                        <th>Course Name</th>
                                                        <th>Category</th>
                                                        <th>Type</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentCourses.length > 0 && currentCourses.map((course, index) => (
                                                            <tr key={course.id}>
                                                                <td>{index + 1}</td>
                                                                <td><img src={course.imageUrl} style={{ height: '50px', width: '70px' }} alt={course.name} /></td>
                                                                <td>{course.code}</td>
                                                                <td>{course.name}</td>
                                                                <td>{course.category.name}</td>
                                                                <td>
                                                                    <span className={`badge ${course.isOnlineClass ? 'badge-success' : 'badge-danger'}`}>{course.isOnlineClass ? 'Class' : 'Video'}</span>
                                                                </td>
                                                                <td>
                                                                    <span className={`badge ${course.isActive ? 'badge-success' : 'badge-danger'}`}>{course.isActive ? 'Active' : 'Inactive'}</span>
                                                                </td>
                                                                <td>
                                                                    <Link to={`/tutor/courses/edit-course/${course.id}`} className='text-secondary'>
                                                                        <i className="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {
                                        currentCourses.length === 0 && (
                                            <p>No courses found.</p>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='container-fluid'>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <ReactPaginate
                                        previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                        nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                        breakLabel={'...'}
                                        breakClassName={'page-item'}
                                        breakLinkClassName={'page-link'}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageClick}
                                        containerClassName={'pagination'}
                                        activeClassName={'active'}
                                        previousClassName={'page-item'}
                                        nextClassName={'page-item'}
                                        pageClassName={'page-item'}
                                        previousLinkClassName={'page-link'}
                                        nextLinkClassName={'page-link'}
                                        pageLinkClassName={'page-link'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                .page-item.active .page-link{
                    background-color: #20c997;
                    border-color: #20c997;
                }
            `}
            </style>
        </>
    )
}

export default CourseList;
