import React, { useState, useEffect, useRef } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link, useNavigate } from 'react-router-dom';
import learnerService from '../../../services/learner.service';
import transactionService from '../../../services/transaction.service';
import refundRequestService from '../../../services/refund-request.service';
import ReactQuill from 'react-quill';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"; // icons form react-icons
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';

const MyTransaction = () => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }

    const learnerId = sessionStorage.getItem('learnerId');
    const [transactionList, setTransactionList] = useState([]);
    const [refundRequestList, setRefundRequestList] = useState([]);
    const contentRef = useRef(null);
    const [showRefundModal, setShowRefundModal] = useState(false); // State variable for modal visibility
    const [selectedCourseName, setSelectedCourseName] = useState(''); // State variable to store the name of the selected course

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [transactionsPerPage] = useState(5);



    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    useEffect(() => {
        learnerService
            .getAllTransactionByLearnerId(learnerId)
            .then((res) => {
                // Filter the transactions where isActive is true
                const filteredTransactionList = res.data;
                // Sort refundList by requestedDate
                const sortedTransactionList = [...filteredTransactionList].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.transactionDate) - new Date(a.transactionDate);
                });
                setTransactionList(sortedTransactionList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [learnerId]);

    useEffect(() => {
        learnerService
            .getAllRefundRequestByLearnerId(learnerId)
            .then((res) => {
                // Sort refund requests by requestedDate
                const sortedRefundRequests = res.data.sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate));
                setRefundRequestList(sortedRefundRequests);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [learnerId]);
    
    const scroll = (scrollOffset) => {
        contentRef.current.scrollLeft += scrollOffset;
    };

    //REFUND
    const [refund, setRefund] = useState({
        reason: "",
        transactionId: "",
    });

    const handleContentChange = (value) => {
        setRefund({ ...refund, reason: value });
    };




    const [showReasonModal, setShowReasonModal] = useState(false); // State variable for modal visibility
    const [refundSurveyList, setRefundSurveyList] = useState([]);

    const handleReasonClick = (refundId) => {
        setShowReasonModal(true);

        refundRequestService.getAllRefundSurveyByRefundRequestId(refundId)
            .then((res) => {
                setRefundSurveyList(res.data)
            }).catch((error) => {
                console.log(error);
            });

    };


    const filteredTransactions = transactionList.filter(transaction => {
        const course = transaction.course;
        return (
            (!course ||  // Include transactions where course is null
                course.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.code.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.stockPrice.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.category?.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    });

    const pageCount = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(offset, offset + transactionsPerPage);

    return (
        <>
            <Header />
            <main id="main" data-aos="fade-in" style={{ backgroundColor: '#fff' }}>
                <div className="breadcrumbs">
                    <div className="container">
                        <h2 style={{ color: '#fff' }}>My Transaction</h2>
                    </div>
                </div>
                <section id="courses" className="courses" style={{ marginTop: '-30px' }}>
                    <div className="container" data-aos="fade-up">
                        {/* Nav Tabs */}
                        <ul className="nav nav-tabs" id="myLearningTabs">
                            <li className="nav-item">
                                <a className="nav-link active" id="tab1" data-bs-toggle="tab" href="#tab-content-1">
                                    Transaction
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="tab2" data-bs-toggle="tab" href="#tab-content-2">
                                    Refund
                                </a>
                            </li>

                        </ul>
                        {/* Tab Content */}
                        <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-70px' }}>
                            {loading && (
                                <div className="loading-overlay">
                                    <div className="loading-spinner" />
                                </div>
                            )}
                            <div className="tab-pane fade show active" id="tab-content-1">
                                <section id="courses" className="courses">
                                    <div className="container-fluid" data-aos="fade-up">
                                        <div className="list-container" data-aos="zoom-in" data-aos-delay={100}>
                                            <table className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light" >
                                                    <tr>
                                                        <th scope="col"></th>
                                                        <th scope="col"></th>
                                                        <th scope="col">Payment Method</th>
                                                        <th scope="col">Amount</th>
                                                        <th scope="col">Transaction Date</th>
                                                        <th scope="col">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        transactionList.length > 0 && (
                                                            currentTransactions.map((transaction, index) => (
                                                                <tr key={transaction.id}>
                                                                    <td>
                                                                        <i class="fa-solid fa-cart-shopping fa-2x"></i>                                                                    </td>
                                                                    {
                                                                        transaction.courseId !== null && (
                                                                            <td>
                                                                                {transaction.course?.isOnlineClass ? (
                                                                                    <h3><Link to={`/detail-course/${transaction.courseId}`}>{transaction.course?.name}</Link></h3>
                                                                                ) : (
                                                                                    <h3><Link to={`/detail-course/${transaction.courseId}`}>{transaction.course?.name}</Link></h3>
                                                                                )}
                                                                            </td>
                                                                        )
                                                                    }
                                                                    {
                                                                        transaction.courseId === null && (
                                                                            <td><h3>Deposit</h3></td>
                                                                        )
                                                                    }


                                                                    <td>{transaction.paymentMethod?.name}</td>
                                                                    <td>${transaction.amount / 24000}</td>
                                                                    <td>{new Date(transaction.transactionDate).toLocaleString('en-US')}</td>
                                                                    <td>{transaction.status === "PROCESSING" ? "FAILED" : transaction.status}</td>

                                                                </tr>

                                                            ))
                                                        )
                                                    }


                                                </tbody>
                                            </table>
                                            {
                                                transactionList.length === 0 && (
                                                    <>
                                                        <i class="fas fa-file-invoice fa-2x"></i>
                                                        <h5 className='text-center'>No transactions found.</h5>
                                                    </>
                                                )
                                            }


                                        </div>
                                    </div>
                                    {/* Pagination */}
                                    <div className='container-fluid mt-2'>
                                        {/* Pagination */}
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <ReactPaginate
                                                previousLabel={
                                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                        <AiFillCaretLeft />
                                                    </IconContext.Provider>
                                                }
                                                nextLabel={
                                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
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
                                </section>



                            </div>
                            <div className="tab-pane fade" id="tab-content-2">
                                {/* Course Content for Tab 2 */}
                                <section id="courses" className="courses">
                                    <div className="container" data-aos="fade-up">
                                        <div className="row " data-aos="zoom-in" data-aos-delay={100}>
                                            <table id="demo-foo-filtering"
                                                className="table table-borderless table-hover table-wrap table-centered mb-0"
                                                data-page-size={7}
                                            >
                                                <thead className="thead-light">
                                                    {
                                                        refundRequestList.length > 0 && (
                                                            <tr>
                                                                <th scope="col">Image</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Payment Method</th>
                                                                <th scope="col">Amount</th>
                                                                <th scope="col">Request Date</th>
                                                                <th scope="col">Reason</th>
                                                                <th scope="col">Status</th>
                                                            </tr>
                                                        )

                                                    }
                                                    {
                                                        refundRequestList.length === 0 && (
                                                            <>
                                                                <i class="fas fa-paper-plane fa-2x"></i>
                                                                <h5>No requests found.</h5>

                                                            </>
                                                        )
                                                    }

                                                </thead>
                                                <tbody>
                                                    {
                                                        refundRequestList.length > 0 && refundRequestList.map((refund, index) => (
                                                            <tr key={refund.id}>
                                                                <td>
                                                                    <img src={refund.enrollment?.transaction?.course?.imageUrl} alt={refund.enrollment?.transaction?.course?.name} className="img-fluid" style={{ maxWidth: '250px', maxHeight: '100px' }} />
                                                                </td>
                                                                <td style={{ color: `#f58d04` }}>
                                                                    {refund.enrollment?.transaction?.course?.isOnlineClass ? (
                                                                        <h3><Link style={{ color: `#f58d04` }} to={`/detail-course/${refund.enrollment?.transaction?.courseId}`}>{refund.enrollment?.transaction?.course?.name}</Link></h3>
                                                                    ) : (
                                                                        <h3 ><Link style={{ color: `#f58d04` }} to={`/detail-course/${refund.enrollment?.transaction?.courseId}`} >{refund.enrollment?.transaction?.course?.name}</Link></h3>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {refund.enrollment?.transaction?.paymentMethod?.name}
                                                                </td>
                                                                <td>
                                                                    ${refund.enrollment?.transaction?.amount / 24000}
                                                                </td>
                                                                <td>
                                                                    {new Date(refund.requestedDate).toLocaleString('en-US')}
                                                                </td>
                                                                <td>
                                                                    <i class="fa-regular fa-hand" onClick={() => handleReasonClick(refund.id)}></i>
                                                                </td>
                                                                <td>
                                                                    {refund.status}
                                                                </td>

                                                            </tr>

                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            {showReasonModal && (
                                <form id="demo-form" data-parsley-validate>
                                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                        <div className="modal-dialog  modal-dialog-scrollable modal-lg">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Reasons </h5>
                                                    <button type="button" className="close" onClick={() => setShowReasonModal(false)}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th data-toggle="true">No.</th>
                                                                <th data-toggle="true">Reason</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                refundSurveyList.length > 0 && refundSurveyList.map((cus, index) => (

                                                                    <tr>
                                                                        <td>{index + 1}</td>
                                                                        <td>{cus.reason}</td>
                                                                    </tr>
                                                                ))
                                                            }


                                                        </tbody>

                                                    </table>
                                                    {
                                                        refundSurveyList.length === 0 && (
                                                            <p className='text-center'>No reasons found.</p>
                                                        )
                                                    }
                                                </div>

                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: `8px 25px` }} onClick={() => setShowReasonModal(false)}>Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>


                            )}


                        </div>

                    </div>

                </section>

            </main>

            <Footer />
            <style>
                {`
              
                a {
                    color: #f58d04;
                    text-decoration: none;
                    background-color: transparent;
                }
                a:hover {
                    color: #000;
                    text-decoration: none;
                    background-color: transparent;
                }
                .page-item.active .page-link{
                    background-color: #f58d04;
                    border-color: #f58d04;
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
    );
};


export default MyTransaction;
