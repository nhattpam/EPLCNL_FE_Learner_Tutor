import React, { useState, useEffect, useRef } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';
import learnerService from '../../../services/learner.service';
import transactionService from '../../../services/transaction.service';
import refundRequestService from '../../../services/refund-request.service';
import ReactQuill from 'react-quill';

const MyTransaction = () => {
    const learnerId = localStorage.getItem('learnerId');
    const [transactionList, setTransactionList] = useState([]);
    const [refundRequestList, setRefundRequestList] = useState([]);
    const contentRef = useRef(null);
    const [showRefundModal, setShowRefundModal] = useState(false); // State variable for modal visibility
    const [selectedCourseName, setSelectedCourseName] = useState(''); // State variable to store the name of the selected course


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

            })
            .catch((error) => {
                console.log(error);
            });
    }, [learnerId]);

    useEffect(() => {
        learnerService
            .getAllRefundRequestByLearnerId(learnerId)
            .then((res) => {
                setRefundRequestList(res.data);
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
                            <div className="tab-pane fade show active" id="tab-content-1">
                                <section id="courses" className="courses">
                                    <div className="container-fluid" data-aos="fade-up">
                                        <div className="list-container" data-aos="zoom-in" data-aos-delay={100}>
                                            <table className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
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
                                                            transactionList.map((transaction, index) => (
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
                                                                    <td>{transaction.transactionDate}</td>
                                                                    <td>{transaction.status}</td>
                                                                    {/* <td>
                                                                    {isTransactionDateValid(transaction.transactionDate) && (
                                                                        <a className='btn btn-primary' style={{ backgroundColor: '#f58d04' }} onClick={() => handleRefundClick(transaction.id)}>
                                                                            Request a refund
                                                                        </a>
                                                                    )}
                                                                </td> */}
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
                                </section>



                            </div>
                            <div className="tab-pane fade" id="tab-content-2">
                                {/* Course Content for Tab 2 */}
                                <section id="courses" className="courses">
                                    <div className="container" data-aos="fade-up">
                                        <div className="row " data-aos="zoom-in" data-aos-delay={100}>
                                            <table id="demo-foo-filtering"
                                                className="table table-borderless table-hover table-nowrap table-centered mb-0"
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
                                                                    {refund.requestedDate}
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
                                        <div className="modal-dialog  modal-dialog-scrollable">
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
            `}
            </style>
        </>
    );
};


export default MyTransaction;
