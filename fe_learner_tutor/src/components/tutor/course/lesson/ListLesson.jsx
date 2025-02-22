import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../Footer'
import Header from '../../Header'
import Sidebar from '../../Sidebar'
import { Link } from 'react-router-dom'
import moduleService from '../../../../services/module.service';
import ReactPaginate from 'react-paginate';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const ListLesson = () => {

    const { storedModuleId } = useParams();
    const [lessonList, setLessonList] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [lessonsPerPage] = useState(5);

    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }


    const [module, setModule] = useState({
        name: '',
    });


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (storedModuleId) {
            moduleService
                .getModuleById(storedModuleId)
                .then((res) => {
                    setModule(res.data);
                    // console.log(module)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedModuleId]);

    useEffect(() => {
        moduleService
            .getAllLessonsByModule(storedModuleId)
            .then((res) => {
                console.log(res.data);
                setLessonList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [storedModuleId]);

    const filteredLessons = lessonList
        .filter((lesson) => {
            return (
                lesson.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredLessons.length / lessonsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * lessonsPerPage;
    const currentLessons = filteredLessons.slice(offset, offset + lessonsPerPage);



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
                                        <h4 className="page-title">LESSONS OF MODULE - <span className='text-success'>{module.name}</span> </h4>
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
                                                    {/* <div className="form-group mr-2">
                                                        <Link to={`/tutor/courses/create/create-video-course/create-module/module-part/${storedModuleId}`} className='text-danger'>
                                                            <i class="fas fa-layer-group"></i>
                                                        </Link>

                                                    </div> */}

                                                    <div className="form-group mr-2">
                                                        <Link to={`/tutor/courses/edit-module/${storedModuleId}`} className='text-success'>
                                                            <i class="fas fa-ellipsis-v"></i>
                                                        </Link>

                                                    </div>
                                                    <div className="form-group mr-2">
                                                        <Link to={`/tutor/courses/create/create-video-course/create-lesson/${storedModuleId}`} >
                                                            <button className="btn btn-success">
                                                                Create
                                                            </button>
                                                        </Link>

                                                    </div>

                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-toggle="true">Lesson Name</th>
                                                        {/* <th>Video Url</th> */}
                                                        <th data-hide="phone">Created Date</th>
                                                        <th data-hide="phone, tablet">Updated Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentLessons.length > 0 && currentLessons.map((lesson, index) => (
                                                            <tr key={lesson.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{lesson.name}</td>
                                                                {/* <td>{lesson.videoUrl}</td> */}
                                                                <td>{lesson.createdDate}</td>
                                                                <td>{lesson.updatedDate}</td>
                                                                <td>
                                                                    <Link to={`/tutor/courses/edit-lesson/${lesson.id}`} className='text-dark'>
                                                                        <i class="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>

                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                    </div> {/* end card-box */}
                                    {
                                        currentLessons.length === 0 && (
                                            <p>No lessons found.</p>
                                        )
                                    }
                                </div> {/* end col */}
                            </div>
                            {/* end row */}
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


                        </div> {/* container */}
                    </div> {/* content */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}


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

export default ListLesson