import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../Footer'
import Header from '../../Header'
import Sidebar from '../../Sidebar'
import { Link } from 'react-router-dom'
import moduleService from '../../../../services/module.service';
import ReactPaginate from 'react-paginate';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import topicService from '../../../../services/topic.service';

const ListClassTopicQuiz = () => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }

    const { storedClassTopicId } = useParams();
    const [quizList, setQuizList] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [quizsPerPage] = useState(5);


    const [classTopic, setClassTopic] = useState({
        name: '',
    });


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (storedClassTopicId) {
            topicService
                .getClassTopicById(storedClassTopicId)
                .then((res) => {
                    classTopic(res.data);
                    // console.log(module)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedClassTopicId]);

    useEffect(() => {
        topicService
            .getAllQuizzesByClassTopic(storedClassTopicId)
            .then((res) => {
                console.log(res.data);
                setQuizList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [storedClassTopicId]);

    const filteredQuizs = quizList
        .filter((quiz) => {
            return (
                quiz.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredQuizs.length / quizsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * quizsPerPage;
    const currentQuizs = filteredQuizs.slice(offset, offset + quizsPerPage);

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
                                        <h4 className="page-title">QUIZZES OF TOPIC - <span className='text-success'>{classTopic.name}</span></h4>
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

                                                    <div className="form-group mr-2">
                                                        <Link to={`/tutor/courses/edit-class-topic/${storedClassTopicId}`} className='text-success'>
                                                            <i class="fas fa-ellipsis-v"></i>
                                                        </Link>

                                                    </div>
                                                    <div className="form-group mr-2">
                                                        <Link to={`/tutor/courses/create/create-video-course/create-quiz/${storedClassTopicId}`}>
                                                            <button className="btn btn-success">
                                                                <i className="fas fa-plus-circle"></i> Create
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
                                                        <th data-toggle="true">Quiz Name</th>
                                                        <th>Grade to pass</th>
                                                        <th>Times</th>
                                                        <th data-hide="phone">Created Date</th>
                                                        <th data-hide="phone, tablet">Updated Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentQuizs.length > 0 && currentQuizs.map((quiz, index) => (
                                                            <tr key={quiz.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{quiz.name}</td>
                                                                <td>{quiz.gradeToPass}</td>
                                                                <td>{quiz.deadline}</td>
                                                                <td>{quiz.createdDate}</td>
                                                                <td>{quiz.updatedDate}</td>
                                                                <td>
                                                                    <Link to={`/tutor/courses/edit-quiz/${quiz.id}`} className='text-secondary'>
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
                                        currentQuizs.length === 0 && (
                                            <p>No quizzes found.</p>
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

export default ListClassTopicQuiz