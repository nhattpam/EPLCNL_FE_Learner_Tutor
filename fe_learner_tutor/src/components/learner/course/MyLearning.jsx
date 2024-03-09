import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Link } from 'react-router-dom';
import learnerService from '../../../services/learner.service';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import ReactQuill from 'react-quill';
import feedbackService from '../../../services/feedback.service';
import reportService from '../../../services/report.service';
import StarRating from './StarRating';
import Dropzone from "react-dropzone";
import courseService from '../../../services/course.service';
import enrollmentService from '../../../services/enrollment.service';
import refundRequestService from '../../../services/refund-request.service';


const MyLearning = () => {

    const learnerId = localStorage.getItem('learnerId');


    const [enrollmentList, setEnrollmentList] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false); // State variable for modal visibility
    const [showReportModal, setShowReportModal] = useState(false); // State variable for modal visibility
    const [learnersCount, setLearnersCount] = useState({});
    const [showRefundModal, setShowRefundModal] = useState(false); // State variable for modal visibility
    const [selectedCourseName, setSelectedCourseName] = useState(''); // State variable to store the name of the selected course

    const contentRef = useRef(null);


    useEffect(() => {
        learnerService
            .getAllEnrollmentByLearnerId(learnerId)
            .then(async (res) => {
                setEnrollmentList(res.data);
                const learnersCounts = {}; // Object to store number of learners for each course
                for (const enrollment of res.data) {
                    try {
                        const learnersResponse = await courseService.getAllEnrollmentsByCourse(enrollment.transaction.courseId);
                        const learnersOfCourse = learnersResponse.data;
                        learnersCounts[enrollment.transaction.courseId] = learnersOfCourse.length; // Store learner count for the course
                    } catch (error) {
                        console.error(`Error fetching learners for course ${enrollment.course.name}:`, error);
                    }
                }
                setLearnersCount(prevState => ({ ...prevState, ...learnersCounts })); // Update state with learners count
            })
            .catch((error) => {
                console.log(error);
            });
    }, [learnerId]);


    //FEEBACK
    const [feedback, setFeedback] = useState({
        feedbackContent: "",
        transaction: "",
        rating: ""
    });

    const handleContentChange = (value) => {
        setFeedback({ ...feedback, feedbackContent: value });
    };

    const handleRatingChange = (value) => {
        setFeedback({ ...feedback, rating: value }); // Update the rating state
    };
    const handleFeedbackClick = (courseId, learnerId) => {
        setShowFeedbackModal(true);
        setShowReportModal(false);
        feedback.courseId = courseId;
        feedback.learnerId = learnerId;
    };

    const submitFeedback = (e) => {
        e.preventDefault();
        console.log(JSON.stringify(feedback))
        // If the note is not empty, proceed with the form submission
        feedbackService
            .saveFeedback(feedback)
            .then((res) => {
                window.alert("You feedback sent! Thank you");
                setShowFeedbackModal(false)
            })
            .catch((error) => {
                console.log(error);
            });
    };
    //FEEBACK

    //REPORT
    const [report, setReport] = useState({
        reason: "",
        learnerId: "",
        courseId: "",
        imageUrl: ""
    });

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleFileDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);

            // Set the image preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setImagePreview(previewUrl);
        }
    };

    const handleReportClick = (courseId, learnerId) => {
        setShowReportModal(true);
        setShowFeedbackModal(false);
        report.courseId = courseId;
        report.learnerId = learnerId;
    };

    const handleReasonChange = (value) => {
        setReport({ ...report, reason: value });
    };

    const submitReport = async (e) => {
        e.preventDefault();
        let imageUrl = report.imageUrl; // Keep the existing imageUrl if available

        if (file) {
            // Upload image and get the link
            const imageData = new FormData();
            imageData.append("file", file);
            const imageResponse = await courseService.uploadImage(imageData);

            // Update the imageUrl with the link obtained from the API
            imageUrl = imageResponse.data;

        }

        // Save course
        const reportData = { ...report, imageUrl }; // Create a new object with updated imageUrl

        // If the note is not empty, proceed with the form submission
        reportService
            .saveReport(reportData)
            .then((res) => {
                window.alert("You Report sent! Thank you");
                setShowReportModal(false)
            })
            .catch((error) => {
                console.log(error);
            });
    };
    //REPORT

    //REFUND
    const [refund, setRefund] = useState({
        reason: "",
        enrollmentId: "",
    });

    const handleReasonRefundChange = (value) => {
        setRefund({ ...refund, reason: value });
    };

    const handleRefundClick = (enrollmentId) => {
        setShowRefundModal(true);
        refund.enrollmentId = enrollmentId;
        enrollmentService.getEnrollmentById(enrollmentId)
            .then((res) => {
                setSelectedCourseName(res.data.transaction.course.name); // Update the selected course name

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
            <main id="main" data-aos="fade-in">
                {/* ======= Breadcrumbs ======= */}
                <div className="breadcrumbs" >
                    <div className="container" >
                        <h2 style={{ color: '#fff' }}>My learning</h2>
                    </div>
                </div>
                {/* End Breadcrumbs */}
                {/* ======= Courses Section ======= */}
                <section id="courses" className="courses" style={{ marginTop: '-30px' }}>
                    <div className="container" data-aos="fade-up">
                        {/* Nav Tabs */}
                        <ul className="nav nav-tabs" id="myLearningTabs">
                            <li className="nav-item">
                                <a className="nav-link active" id="tab1" data-bs-toggle="tab" href="#tab-content-1">
                                    All courses
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="tab2" data-bs-toggle="tab" href="#tab-content-2">
                                    Certificates
                                </a>
                            </li>

                        </ul>
                        {/* Tab Content */}
                        <div className="tab-content" id="myLearningTabsContent" style={{ marginTop: '-70px' }}>

                            <div className="tab-pane fade show active" id="tab-content-1">
                                <section id="courses" className="courses">
                                    <div className="container" data-aos="fade-up">
                                        <div className="row " data-aos="zoom-in" data-aos-delay={100}>
                                            {
                                                enrollmentList.length > 0 && (
                                                    enrollmentList.map((enrollment, index) => (
                                                        <div key={enrollment.transaction.courseId} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                                            <div className="course-item " id='iitem'>
                                                                <img src={enrollment.transaction.course.imageUrl} className="img-fluid" alt="..." />
                                                                <div className="course-content">
                                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                                        <h4>{enrollment.transaction.course.category?.name}</h4>
                                                                        <p className="price">{parseFloat(enrollment.transaction.course.rating).toFixed(0)} <i class="fas fa-star text-warning "></i></p>
                                                                        <p className="price">{`$${enrollment.transaction.course.stockPrice}`}</p>
                                                                    </div>
                                                                    {enrollment.transaction.course.isOnlineClass && (
                                                                        <h3><Link to={`/study-class/${enrollment.transaction.courseId}`}>{enrollment.transaction.course.name}</Link></h3>

                                                                    )}
                                                                    {!enrollment.transaction.course.isOnlineClass && (
                                                                        <h3><Link to={`/study-course/${enrollment.transaction.courseId}`}>{enrollment.transaction.course.name}</Link></h3>

                                                                    )}
                                                                    <p>{enrollment.transaction.course.description}</p>
                                                                    <div className="trainer d-flex justify-content-between align-items-center">
                                                                        <div className="trainer-profile d-flex align-items-center">
                                                                            <img src={enrollment.transaction.course.tutor.account.imageUrl} className="img-fluid" alt="" />
                                                                            <span>{enrollment.transaction.course.tutor.account.fullName}</span>
                                                                        </div>

                                                                        <div className="trainer-rank d-flex align-items-center">
                                                                            <i className="bx bx-user" />&nbsp;{learnersCount[enrollment.transaction.course.id]}
                                                                            &nbsp;&nbsp;
                                                                            <i class="far fa-grin-stars" onClick={() => handleFeedbackClick(enrollment.transaction.courseId, learnerId)}></i>
                                                                            &nbsp;&nbsp;&nbsp;
                                                                            <i class="fas fa-flag" onClick={() => handleReportClick(enrollment.transaction.courseId, learnerId)}></i>
                                                                        </div>
                                                                    </div>
                                                                    {isTransactionDateValid(enrollment.enrolledDate) && (
                                                                        <a className='btn btn-primary' style={{ backgroundColor: '#f58d04' }} onClick={() => handleRefundClick(enrollment.id)}>
                                                                            Request a refund
                                                                        </a>
                                                                    )}

                                                                    {showFeedbackModal && (
                                                                        <form id="demo-form" data-parsley-validate onSubmit={(e) => submitFeedback(e)}>
                                                                            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                                                <div className="modal-dialog  modal-dialog-scrollable">
                                                                                    <div className="modal-content">
                                                                                        <div className="modal-header">
                                                                                            <h5 className="modal-title">Feedback for course - <span style={{ color: '#f58d04' }}>{enrollment.transaction.course.name}</span> </h5>
                                                                                            <button type="button" className="close" onClick={() => setShowFeedbackModal(false)}>
                                                                                                <span aria-hidden="true">&times;</span>
                                                                                            </button>
                                                                                        </div>
                                                                                        <div className="modal-body">
                                                                                            <StarRating onChange={handleRatingChange} />

                                                                                            <ReactQuill
                                                                                                value={feedback.feedbackContent}
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
                                                                                                preserveWhitespace={true} // Add this line to preserve whitespace

                                                                                            />
                                                                                        </div>
                                                                                        <div className="modal-footer">
                                                                                            <button type="button" className="btn btn-secondary" onClick={() => setShowFeedbackModal(false)}>Close</button>
                                                                                            <button type="button" className="btn btn-primary" style={{ backgroundColor: '#f58d04' }} onClick={(e) => submitFeedback(e)}>Send</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </form>


                                                                    )}
                                                                    {showReportModal && (
                                                                        <form method="post"
                                                                            className="dropzone"
                                                                            id="myAwesomeDropzone"
                                                                            data-plugin="dropzone"
                                                                            data-previews-container="#file-previews"
                                                                            data-upload-preview-template="#uploadPreviewTemplate"
                                                                            data-parsley-validate onSubmit={(e) => submitReport(e)}>
                                                                            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                                                <div className="modal-dialog modal-dialog-scrollable"> {/* Add 'modal-dialog-scrollable' class */}
                                                                                    <div className="modal-content">
                                                                                        <div className="modal-header">
                                                                                            <h5 className="modal-title">Report course - <span style={{ color: '#f58d04' }}>{enrollment.transaction.course.name}</span> </h5>
                                                                                            <button type="button" className="close" onClick={() => setShowReportModal(false)}>
                                                                                                <span aria-hidden="true">&times;</span>
                                                                                            </button>
                                                                                        </div>
                                                                                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Set maxHeight and overflowY */}
                                                                                            <ReactQuill
                                                                                                value={report.reason}
                                                                                                onChange={handleReasonChange}
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
                                                                                            <Dropzone
                                                                                                onDrop={handleFileDrop}
                                                                                                accept="image/*"
                                                                                                multiple={false}
                                                                                                maxSize={5000000}
                                                                                            >
                                                                                                {({ getRootProps, getInputProps }) => (
                                                                                                    <div {...getRootProps()} className="fallback">
                                                                                                        <input {...getInputProps()} />
                                                                                                        <div className="dz-message needsclick">
                                                                                                            <i className="h1 text-muted dripicons-cloud-upload" />
                                                                                                            <h3>Drop files here or click to upload.</h3>
                                                                                                        </div>
                                                                                                        {imagePreview && (
                                                                                                            <img
                                                                                                                src={imagePreview}
                                                                                                                alt="Preview"
                                                                                                                style={{
                                                                                                                    maxWidth: "100%",
                                                                                                                    maxHeight: "200px",
                                                                                                                    marginTop: "10px",
                                                                                                                }}
                                                                                                            />
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}
                                                                                            </Dropzone>

                                                                                            <div
                                                                                                className="dropzone-previews mt-3"
                                                                                                id="file-previews"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="modal-footer">
                                                                                            <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Close</button>
                                                                                            <button type="button" className="btn btn-primary" style={{ backgroundColor: '#f58d04' }} onClick={(e) => submitReport(e)}>Send</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    )}
                                                                    {showRefundModal && (
                                                                        <form method="post"
                                                                            className="dropzone"
                                                                            id="myAwesomeDropzone"
                                                                            data-plugin="dropzone"
                                                                            data-previews-container="#file-previews"
                                                                            data-upload-preview-template="#uploadPreviewTemplate"
                                                                            data-parsley-validate onSubmit={(e) => submitRefund(e)}>
                                                                            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                                                                                                onChange={handleReasonRefundChange}
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

                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )
                                            }
                                            {
                                                enrollmentList.length === 0 && (
                                                    <p>You haven't joined any course yet.</p>
                                                )
                                            }

                                        </div>
                                    </div>
                                </section>{/* End Courses Section */}
                            </div>


                            <div className="tab-pane fade" id="tab-content-2">
                                {/* Course Content for Tab 2 */}
                                {/* You can customize this content based on your needs */}
                            </div>

                        </div>
                    </div>
                </section>
                {/* End Courses Section */}
            </main>
            {/* End #main */}
            <Footer />
            <style>
                {`
                    /* Add this CSS to ensure scrolling within modal body */
                    /* Add this CSS to ensure scrolling within modal body */
.modal-body {
  max-height: calc(100vh - 200px); /* Adjust the value (200px) as needed to accommodate the modal header and footer */
  overflow-y: auto; /* Enable vertical scrolling when content exceeds max height */
}

/* Add this CSS to create a sticky footer */
.modal-footer {
  position: sticky;
  bottom: 0;
  background-color: #fff; /* Optional: Set background color for footer */
  padding: 15px; /* Optional: Add padding to footer */
}

                    
                    /* Add this CSS to set a high z-index for modals */
                    .modal {
                      z-index: 9999; /* Set a high z-index value */
                    }
                    
                    #iitemiitem {
                        transition: transform 0.3s ease;
                    }
                    
                    #iitem:hover {
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    }
                    
                `}
            </style>
        </>
    );
};

export default MyLearning;
