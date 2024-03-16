import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../Header'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import accountService from '../../../services/account.service'
import tutorService from '../../../services/tutor.service';
import learnerService from '../../../services/learner.service';

const TutorDashboard = () => {

    const { tutorId } = useParams();
    const storedAccountId = localStorage.getItem('accountId');
    const [enrollmentList, setEnrollmentList] = useState([]);
    const [enrollmentLearnerList, setEnrollmentLearnerList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [courseTutorList, setCourseTutorList] = useState([]);
    const [learnerList, setLearnerList] = useState([]);
    const [rating, setRating] = useState(0);
    const [learnersPerPage] = useState(5);
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        gender: "",
        wallet: []
    });

    useEffect(() => {
        if (storedAccountId) {
            accountService
                .getAccountById(storedAccountId)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedAccountId]);

    useEffect(() => {
        if (tutorId) {
            tutorService
                .getAllEnrollmentsByTutor(tutorId)
                .then((res) => {
                    setEnrollmentList(res.data)
                })
                .catch((error) => {
                    console.log(error);
                });
            tutorService
                .getAllLearnersByTutor(tutorId)
                .then((res) => {
                    setLearnerList(res.data)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [tutorId]);

    const filteredLearners = learnerList
        .filter((learner) => {
            return (
                learner.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredLearners.length / learnersPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };
    const offset = currentPage * learnersPerPage;
    const currentLearners = filteredLearners.slice(offset, offset + learnersPerPage);


    useEffect(() => {
        if (tutorId) {
            let totalRating = 0; // Initialize totalRating variable
            tutorService
                .getAllCoursesByTutor(tutorId)
                .then((res) => {
                    setCourseList(res.data);
                    res.data.forEach(course => {
                        totalRating += course.rating; // Add course rating to totalRating
                    });
                    setRating(totalRating); // Update rating state with the totalRating
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [tutorId]);



    const openModal = (learnerId, accountId) => {
        accountService
            .getAccountById(accountId)
            .then((res) => {
                setAccount(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        learnerService.getAllEnrollmentByLearnerId(learnerId)
            .then((res) => {
                setEnrollmentLearnerList(res.data);
            })
        const filteredEnrollments = enrollmentLearnerList.filter(enrollment =>
            enrollment.transaction?.course?.tutorId === tutorId
        );
        filteredEnrollments.forEach(element => {
            console.log(JSON.stringify(element))
        });
        setEnrollmentLearnerList(filteredEnrollments)




        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };


    return (


        <>
            <div id="wrapper">
                <Header />
                <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
                    isStaff={sessionStorage.getItem('isStaff') === 'true'}
                    isCenter={sessionStorage.getItem('isCenter') === 'true'} />
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
                                        
                                        <h4 className="page-title">Dashboard</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-primary border-primary border">
                                                    <i className="fe-heart font-22 avatar-title text-primary" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="mt-1">$<span data-plugin="counterup">{account.wallet?.balance}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Total Revenue</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-success border-success border">
                                                    <i className="fe-shopping-cart font-22 avatar-title text-success" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="text-dark mt-1"><span data-plugin="counterup">{enrollmentList.length}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Total Enrollments</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-info border-info border">
                                                    <i className="fe-bar-chart-line- font-22 avatar-title text-info" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="text-dark mt-1"><span data-plugin="counterup">{rating}</span>%</h3>
                                                    <p className="text-muted mb-1 text-truncate">Course Rating</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}

                            </div>
                            {/* end row*/}
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="card-box">

                                        <h4 className="header-title mb-3">Top 5 Users</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-hover table-nowrap table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th colSpan={2}>Profile</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentLearners.length > 0 && currentLearners.map((learner, index) => (
                                                            <tr>
                                                                <td style={{ width: 36 }}>
                                                                    <img src={learner.account?.imageUrl} alt="contact-img" title="contact-img" className="rounded-circle avatar-sm" />
                                                                </td>
                                                                <td>
                                                                    <h5 className="m-0 font-weight-normal">{learner.account?.fullName}</h5>
                                                                    <p className="mb-0 text-muted"><small>Member Since {learner.account?.createdDate ? learner.account.createdDate.substring(0, 4) : ""}</small></p>
                                                                </td>
                                                                <td>
                                                                    {learner.account?.email}
                                                                </td>
                                                                <td>
                                                                    {learner.account?.phoneNumber}
                                                                </td>

                                                                <td>
                                                                    <a href="javascript: void(0);" className="btn btn-xs btn-light" onClick={() => openModal(learner.id, learner.account?.id)}><i class="far fa-eye"></i></a>
                                                                </td>
                                                            </tr>

                                                        ))}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div> {/* end col */}
                                <div className="col-xl-6">
                                    <div className="card-box">
                                        <h4 className="header-title mb-3">Revenue History</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-nowrap table-hover table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Marketplaces</th>
                                                        <th>Date</th>
                                                        <th>Payouts</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <h5 className="m-0 font-weight-normal">Themes Market</h5>
                                                        </td>
                                                        <td>
                                                            Oct 15, 2018
                                                        </td>
                                                        <td>
                                                            $5848.68
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-soft-warning text-warning">Upcoming</span>
                                                        </td>
                                                        <td>
                                                            <a href="javascript: void(0);" className="btn btn-xs btn-light"><i className="mdi mdi-pencil" /></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 className="m-0 font-weight-normal">Freelance</h5>
                                                        </td>
                                                        <td>
                                                            Oct 12, 2018
                                                        </td>
                                                        <td>
                                                            $1247.25
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-soft-success text-success">Paid</span>
                                                        </td>
                                                        <td>
                                                            <a href="javascript: void(0);" className="btn btn-xs btn-light"><i className="mdi mdi-pencil" /></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 className="m-0 font-weight-normal">Share Holding</h5>
                                                        </td>
                                                        <td>
                                                            Oct 10, 2018
                                                        </td>
                                                        <td>
                                                            $815.89
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-soft-success text-success">Paid</span>
                                                        </td>
                                                        <td>
                                                            <a href="javascript: void(0);" className="btn btn-xs btn-light"><i className="mdi mdi-pencil" /></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 className="m-0 font-weight-normal">Envato's Affiliates</h5>
                                                        </td>
                                                        <td>
                                                            Oct 03, 2018
                                                        </td>
                                                        <td>
                                                            $248.75
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-soft-danger text-danger">Overdue</span>
                                                        </td>
                                                        <td>
                                                            <a href="javascript: void(0);" className="btn btn-xs btn-light"><i className="mdi mdi-pencil" /></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 className="m-0 font-weight-normal">Marketing Revenue</h5>
                                                        </td>
                                                        <td>
                                                            Sep 21, 2018
                                                        </td>
                                                        <td>
                                                            $978.21
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-soft-warning text-warning">Upcoming</span>
                                                        </td>
                                                        <td>
                                                            <a href="javascript: void(0);" className="btn btn-xs btn-light"><i className="mdi mdi-pencil" /></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 className="m-0 font-weight-normal">Advertise Revenue</h5>
                                                        </td>
                                                        <td>
                                                            Sep 15, 2018
                                                        </td>
                                                        <td>
                                                            $358.10
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-soft-success text-success">Paid</span>
                                                        </td>
                                                        <td>
                                                            <a href="javascript: void(0);" className="btn btn-xs btn-light"><i className="mdi mdi-pencil" /></a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div> {/* end .table-responsive*/}
                                    </div> {/* end card-box*/}
                                </div> {/* end col */}
                            </div>
                            {/* end row */}
                        </div> {/* container */}
                    </div> {/* content */}
                    {/* Footer Start */}
                    {showModal && (
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                            <div className="modal-dialog modal-lg" role="document"> {/* Added modal-lg class here */}
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Learner Information</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Adjust max height as needed */}
                                        <div>
                                            <div className='row'>
                                                <div className="col-md-4">
                                                    <img src={account.imageUrl} alt="avatar" className="rounded-circle mt-4" style={{ width: '50%' }} />
                                                </div>
                                                <div className="col-md-8">
                                                    <table className="table table-responsive table-hover mt-3">
                                                        <tbody>
                                                            <tr>
                                                                <th style={{ width: '30%' }}>Full Name:</th>
                                                                <td>{account.fullName}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Email:</th>
                                                                <td>{account.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Phone Number:</th>
                                                                <td>{account.phoneNumber}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Gender:</th>
                                                                <td>{account.gender ? "Male" : "Female"}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
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
                                                            enrollmentLearnerList.length > 0 && enrollmentLearnerList.map((enrollment, index) => (
                                                                <tr key={enrollment.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td><img src={enrollment.transaction?.course?.imageUrl} style={{ height: '50px', width: '70px' }} alt={enrollment.transaction?.course?.name} /></td>
                                                                    <td>{enrollment.transaction?.course?.code}</td>
                                                                    <td>{enrollment.transaction?.course?.name}</td>
                                                                    <td>{enrollment.transaction?.course?.category?.name}</td>
                                                                    <td>
                                                                        <span className={`badge ${enrollment.transaction?.course?.isOnlineClass ? 'badge-success' : 'badge-danger'}`}>{enrollment.transaction?.course?.isOnlineClass ? 'Class' : 'Video'}</span>
                                                                    </td>
                                                                    <td>
                                                                        <span className={`badge ${enrollment.transaction?.course?.isActive ? 'badge-success' : 'badge-danger'}`}>{enrollment.transaction?.course?.isActive ? 'Active' : 'Inactive'}</span>
                                                                    </td>
                                                                    <td>
                                                                        <Link to={`/tutor/courses/edit-course/${enrollment.transaction?.course?.id}`} className='text-secondary'>
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

                                    </div>
                                    <div className="modal-footer">

                                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}

            </div>

        </>
    )
}

export default TutorDashboard