import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import accountService from '../../../services/account.service'
import tutorService from '../../../services/tutor.service';

const TutorDashboard = () => {

    const { tutorId } = useParams();
    const storedAccountId = localStorage.getItem('accountId');
    const [enrollmentList, setEnrollmentList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [learnerList, setLearnerList] = useState([]);
    const [rating, setRating] = useState(0);
    const [learnersPerPage] = useState(5);
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
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
                                        <div className="page-title-right">
                                            <form className="form-inline">
                                                <div className="form-group">
                                                    <div className="input-group input-group-sm">
                                                        <input type="text" className="form-control border" id="dash-daterange" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text bg-blue border-blue text-white">
                                                                <i className="mdi mdi-calendar-range" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href="javascript: void(0);" className="btn btn-blue btn-sm ml-2">
                                                    <i className="mdi mdi-autorenew" />
                                                </a>
                                                <a href="javascript: void(0);" className="btn btn-blue btn-sm ml-1">
                                                    <i className="mdi mdi-filter-variant" />
                                                </a>
                                            </form>
                                        </div>
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
                                        <div className="dropdown float-right">
                                            <a href="#" className="dropdown-toggle arrow-none card-drop" data-toggle="dropdown" aria-expanded="false">
                                                <i className="mdi mdi-dots-vertical" />
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                {/* item*/}
                                                <a href="javascript:void(0);" className="dropdown-item">Edit Report</a>
                                                {/* item*/}
                                                <a href="javascript:void(0);" className="dropdown-item">Export Report</a>
                                                {/* item*/}
                                                <a href="javascript:void(0);" className="dropdown-item">Action</a>
                                            </div>
                                        </div>
                                        <h4 className="header-title mb-3">Top 5 Users</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-hover table-nowrap table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th colSpan={2}>Profile</th>
                                                        <th>Currency</th>
                                                        <th>Balance</th>
                                                        <th>Reserved in orders</th>
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
                                                                    <p className="mb-0 text-muted"><small>Member Since 2017</small></p>
                                                                </td>
                                                                <td>
                                                                    <i className="mdi mdi-currency-btc text-primary" /> BTC
                                                                </td>
                                                                <td>
                                                                    0.00816117 BTC
                                                                </td>
                                                                <td>
                                                                    0.00097036 BTC
                                                                </td>
                                                                <td>
                                                                    <a href="javascript: void(0);" className="btn btn-xs btn-light"><i className="mdi mdi-plus" /></a>
                                                                    <a href="javascript: void(0);" className="btn btn-xs btn-danger"><i className="mdi mdi-minus" /></a>
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
                                        <div className="dropdown float-right">
                                            <a href="#" className="dropdown-toggle arrow-none card-drop" data-toggle="dropdown" aria-expanded="false">
                                                <i className="mdi mdi-dots-vertical" />
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                {/* item*/}
                                                <a href="javascript:void(0);" className="dropdown-item">Edit Report</a>
                                                {/* item*/}
                                                <a href="javascript:void(0);" className="dropdown-item">Export Report</a>
                                                {/* item*/}
                                                <a href="javascript:void(0);" className="dropdown-item">Action</a>
                                            </div>
                                        </div>
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

                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}

            </div>

        </>
    )
}

export default TutorDashboard