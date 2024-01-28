import React, { useEffect, useState } from 'react';
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"; // icons form react-icons
import tutorService from '../../../services/tutor.service';

const ListVideoCourse = () => {

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
                const videoCourses = res.data.filter(course => course.isOnlineClass === false);

                console.log(res.data);
                setCourseList(videoCourses);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [tutorId]);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    console.log(typeof courseList);

    const filteredCourses = courseList
        .filter((course) => {
            return (
                course.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * coursesPerPage;
    const currentCourses = filteredCourses.slice(offset, offset + coursesPerPage);


    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                {/* ============================================================== */}
                {/* Start Page Content here */}
                {/* ============================================================== */}
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <div className="page-title-right">
                                            <ol className="breadcrumb m-0">
                                            </ol>
                                        </div>
                                        <h4 className="page-title">List course</h4>
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
                                                    {/* Create Tutor Button */}
                                                    <Link to="/tutor/courses/create" className="btn btn-primary">
                                                        Create Course
                                                    </Link>
                                                    <div className="form-group mr-2">
                                                        <select id="demo-foo-filter-status" className="custom-select custom-select-sm">
                                                            <option value>Show all</option>
                                                            <option value="active">Active</option>
                                                            <option value="disabled">Disabled</option>
                                                            <option value="suspended">Suspended</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on"
                                                            value={searchTerm}
                                                            onChange={handleSearch} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                                                <thead>
                                                    <tr>
                                                        <th data-hide="phone">Image</th>
                                                        <th>CODE</th>
                                                        <th data-toggle="true">Course Name</th>
                                                        <th data-toggle="true">Category</th>
                                                        <th data-hide="phone, ">Type</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentCourses.map((course) => (
                                                        <tr key={course.id}>
                                                            <td>
                                                                <img src={course.imageUrl} style={{height: '50px', width: '70px'}}></img>
                                                                </td>
                                                            <td>{course.code}</td>
                                                            <td>{course.name}</td>
                                                            <td>{course.category.name}</td>
                                                            <td>
                                                                {course.isOnlineClass ? (
                                                                    <span className="badge label-table badge-success">Class</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-danger">Video</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {course.isActive ? (
                                                                    <span className="badge label-table badge-success">Active</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-danger">Inactive</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Link to={`/tutor/courses/edit-course/${course.id}`}>
                                                                    <i className="fa-regular fa-eye"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                    </div> {/* end card-box */}
                                </div> {/* end col */}
                            </div>
                            {/* end row */}

                            {/* Pagination */}
                            <div className='container-fluid'>
                                {/* Pagination */}
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ReactPaginate
                                        previousLabel={
                                            <IconContext.Provider value={{ color: "#000", size: "23px" }}>
                                                <AiFillCaretLeft />
                                            </IconContext.Provider>
                                        }
                                        nextLabel={
                                            <IconContext.Provider value={{ color: "#000", size: "23px" }}>
                                                <AiFillCaretRight />
                                            </IconContext.Provider>
                                        } breakLabel={'...'}
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

                        </div> {/* container */}
                    </div> {/* content */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}

                <Footer />
            </div>
        </>
    )
}

export default ListVideoCourse