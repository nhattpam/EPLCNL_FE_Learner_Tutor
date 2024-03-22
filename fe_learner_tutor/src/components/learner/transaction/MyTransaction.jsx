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
                setTransactionList(res.data);
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

    const handleRefundClick = (transactionId) => {
        setShowRefundModal(true);
        refund.transactionId = transactionId;
        transactionService.getTransactionById(transactionId)
            .then((res) => {
                setSelectedCourseName(res.data.course.name); // Update the selected course name

            })

    };

    const submitRefund = (e) => {
        e.preventDefault();
        console.log(JSON.stringify(refund))
        // If the note is not empty, proceed with the form submission
        refundRequestService
            .saveRefundRequest(refund)
            .then((res) => {
                window.alert("You refund sent! Wait for us");
                setShowRefundModal(false)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Function to check if the transaction date exceeds 2 days
    const isTransactionDateValid = (transactionDate) => {
        const currentDate = new Date();
        const diffInMilliseconds = currentDate - new Date(transactionDate);
        const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
        return diffInDays <= 2;
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
                <section id="courses" className="courses mt-2">
                    <div className="container" data-aos="fade-up">
                        <div className="tab-content" id="myLearningTabsContent">
                            <div className="tab-pane fade show active" id="tab-content-1" style={{ marginTop: '-80px' }}>
                                <div className="container-fluid" data-aos="fade-up">
                                    <div className="list-container" data-aos="zoom-in" data-aos-delay={100}>
                                        <table className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                            <thead className="thead-light" >
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Image</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col">Payment Method</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Transaction Date</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    transactionList.length > 0 && (
                                                        transactionList.map((transaction, index) => (
                                                            <tr key={transaction.id}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>
                                                                    <img src={transaction.course.imageUrl} alt={transaction.course.name} className="img-fluid" style={{ maxWidth: '250px', maxHeight: '100px' }} />
                                                                </td>
                                                                <td>
                                                                    {transaction.course.isOnlineClass ? (
                                                                        <h3><Link to={`/detail-course/${transaction.courseId}`}>{transaction.course.name}</Link></h3>
                                                                    ) : (
                                                                        <h3><Link to={`/detail-course/${transaction.courseId}`}>{transaction.course.name}</Link></h3>
                                                                    )}
                                                                </td>
                                                                <td>${transaction.course.stockPrice}</td>
                                                                <td>{transaction.paymentMethod.name}</td>
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
                                                {
                                                    transactionList.length === 0 && (
                                                        <p>No transactions found.</p>
                                                    )
                                                }

                                            </tbody>
                                        </table>
                                        {showRefundModal && (
                                            <form method="post"
                                                className="dropzone"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate onSubmit={(e) => submitRefund(e)}>
                                                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                                    <div className="modal-dialog modal-dialog-scrollable"> {/* Add 'modal-dialog-scrollable' class */}
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title">Refund course - <span style={{ color: '#f58d04' }}>{selectedCourseName}</span> </h5>
                                                                <button type="button" className="close" onClick={() => setShowRefundModal(false)}>
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Set maxHeight and overflowY */}
                                                                <ReactQuill
                                                                    value={refund.reason}
                                                                    onChange={handleContentChange}
                                                                    modules={{
                                                                        toolbar: [
                                                                            [{ header: [1, 2, false] }],
                                                                            [{ 'direction': 'rtl' }],
                                                                            [{ 'align': [] }],
                                                                            ['code-block'],
                                                                            [{ 'color': [] }, { 'background': [] }],
                                                                            ['clean']
                                                                        ]
                                                                    }}
                                                                    theme="snow"
                                                                    preserveWhitespace={true}
                                                                />

                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" onClick={() => setShowRefundModal(false)}>Close</button>
                                                                <button type="button" className="btn btn-primary" style={{ backgroundColor: '#f58d04' }} onClick={(e) => submitRefund(e)}>Send</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                        <h4>Your refund requests:</h4>
                                        {

                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    {
                                                        refundRequestList.length > 0 && (
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Image</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Payment Method</th>
                                                                <th scope="col">Amount</th>
                                                                <th scope="col">Request Date</th>
                                                                <th scope="col">Reason</th>
                                                                <th scope="col">Status</th>
                                                                <th scope="col"></th>
                                                            </tr>
                                                        )

                                                    }
                                                    {
                                                        refundRequestList.length === 0 && (
                                                            <h6>You have no refunds.</h6>
                                                        )
                                                    }

                                                </thead>
                                                <tbody>
                                                    {
                                                        refundRequestList.length > 0 && refundRequestList.map((refund, index) => (
                                                            <tr key={refund.id}>
                                                                <th scope="row">{index + 1}</th>
                                                                <td>
                                                                    <img src={refund.enrollment.transaction.course.imageUrl} alt={refund.enrollment.transaction.course.name} className="img-fluid" style={{ maxWidth: '250px', maxHeight: '100px' }} />
                                                                </td>
                                                                <td>
                                                                    {refund.enrollment.transaction.course.isOnlineClass ? (
                                                                        <h3><Link to={`/detail-course/${refund.enrollment.transaction.courseId}`}>{refund.enrollment.transaction.course.name}</Link></h3>
                                                                    ) : (
                                                                        <h3><Link to={`/detail-course/${refund.enrollment.transaction.courseId}`}>{refund.enrollment.transaction.course.name}</Link></h3>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {refund.enrollment.transaction.paymentMethod.name}
                                                                </td>
                                                                <td>
                                                                    ${refund.enrollment.transaction.amount / 24000}
                                                                </td>
                                                                <td>
                                                                    {refund.requestedDate}
                                                                </td>
                                                                <td dangerouslySetInnerHTML={{ __html: refund.reason }} />
                                                                <td>
                                                                    {refund.status}
                                                                </td>

                                                            </tr>

                                                        ))}
                                                </tbody>
                                            </table>

                                        }

                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

            <Footer />
        </>
    );
};


export default MyTransaction;
