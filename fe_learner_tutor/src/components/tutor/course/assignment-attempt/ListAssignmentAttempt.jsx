import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../Footer'
import Header from '../../Header'
import Sidebar from '../../Sidebar'
import { Link } from 'react-router-dom'
import moduleService from '../../../../services/module.service';
import ReactPaginate from 'react-paginate';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import tutorService from '../../../../services/tutor.service';

const ListAssignmentAttempt = () => {

    const { tutorId } = useParams();
    const [assignmentAttemptList, setAssignmentAttemptList] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [assignmentAttemptPerPage] = useState(5);

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


    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    useEffect(() => {
        tutorService
            .getAllAssignmentAttemptsByTutor(tutorId)
            .then((res) => {
                const filteredAssignmentAttemptList = res.data;
                // Sort refundList by requestedDate
                const sortedAssignmentAttemptList = [...filteredAssignmentAttemptList].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.attemptedDate) - new Date(a.attemptedDate);
                });

                setAssignmentAttemptList(sortedAssignmentAttemptList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [tutorId]);

    const filteredAssignmentAttempts = assignmentAttemptList
        .filter((assignmentAttempt) => {
            return (
                assignmentAttempt.answerText.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignmentAttempt.assignment?.questionText.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignmentAttempt.learner?.account?.fullName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignmentAttempt.totalGrade.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount = Math.ceil(filteredAssignmentAttempts.length / assignmentAttemptPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * assignmentAttemptPerPage;
    const currentAssignmentAttempts = filteredAssignmentAttempts.slice(offset, offset + assignmentAttemptPerPage);


    // Function to truncate text
    const truncateText = (text) => {
        const maxLength = 50; // You can adjust this value as needed
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "..."; // Truncate text if it exceeds maxLength
        } else {
            return text;
        }
    };



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
                                        <h4 className="page-title">LIST OF ASSIGNMENT ATTEMPTS</h4>
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
                                                    <div className="form-group">
                                                    </div>
                                                    <div className="form-group">
                                                        <input id="demo-foo-search" onChange={handleSearch} type="text"
                                                            placeholder="Search" className="form-control form-control-sm" autoComplete="on"
                                                            style={{ borderRadius: '50px', padding: `18px 25px` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {loading && (
                                            <div className="loading-overlay">
                                                <div className="loading-spinner" />
                                            </div>
                                        )}
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>No.</th>
                                                        <th data-toggle="true">Assignment Question</th>
                                                        <th>Learner</th>
                                                        <th data-hide="phone">Attempted Date</th>
                                                        <th data-hide="phone, tablet">Grade</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentAssignmentAttempts.length > 0 && currentAssignmentAttempts.map((assignmentAttempt, index) => (
                                                            <tr key={assignmentAttempt.id}>
                                                                <td>{index + 1}</td>
                                                                <td dangerouslySetInnerHTML={{ __html: truncateText(assignmentAttempt.assignment?.questionText) }}></td>

                                                                <td>{assignmentAttempt.learner?.account?.fullName}</td>
                                                                <td>{new Date(assignmentAttempt.attemptedDate).toLocaleString('en-US')}</td>
                                                                <td><span className="badge label-table badge-danger">{assignmentAttempt.totalGrade}</span></td>
                                                                <td>
                                                                    <Link to={`/edit-assignment-attempt/${assignmentAttempt.id}`} className='text-warning'>
                                                                        <i class="fas fa-star-half-alt"></i>                                                                </Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                        {
                                            currentAssignmentAttempts.length === 0 && (
                                                <p className='text-center mt-3'>No attempts found.</p>
                                            )
                                        }
                                    </div> {/* end card-box */}

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
    )
}

export default ListAssignmentAttempt