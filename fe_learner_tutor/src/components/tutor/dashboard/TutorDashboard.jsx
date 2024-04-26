import { React, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../Header'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import accountService from '../../../services/account.service'
import tutorService from '../../../services/tutor.service';
import learnerService from '../../../services/learner.service';
import walletService from '../../../services/wallet.service';
import { Chart, PieController, ArcElement, registerables } from "chart.js";

const TutorDashboard = () => {

    Chart.register(PieController, ArcElement);
    Chart.register(...registerables);
    const pieChartRef = useRef(null);
    const areaChartRef = useRef(null);

    const { tutorId } = useParams();
    const storedAccountId = localStorage.getItem('accountId');
    const [enrollmentList, setEnrollmentList] = useState([]);
    const [enrollmentLearnerList, setEnrollmentLearnerList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [salaryList, setSalaryList] = useState([]);
    const [learnerList, setLearnerList] = useState([]);
    const [rating, setRating] = useState(0);
    const [learnersPerPage] = useState(5);
    const [historiesPerPage] = useState(5);
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPage2, setCurrentPage2] = useState(0);
    const [showModal, setShowModal] = useState(false);



    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

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
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            accountService
                .getAllSalariesByAccount(storedAccountId)
                .then((res) => {
                    setSalaryList(res.data);
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
            tutorService.getAllLearnersByTutor(tutorId)
                .then((res) => {
                    // Extracting unique learner IDs
                    const uniqueLearnerIds = [...new Set(res.data.map(learner => learner.id))];
                    // Creating new array with unique learners
                    const uniqueLearnerArray = uniqueLearnerIds.map(id => res.data.find(learner => learner.id === id));
                    setLearnerList(uniqueLearnerArray);
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

    //WALLET HISTORY
    const [walletHistoryList, setWalletHistoryList] = useState([]);

    useEffect(() => {
        if (account.wallet && account.wallet?.id) {
            walletService
                .getAllWalletHistoryByWallet(account.wallet?.id)
                .then((res) => {
                    setWalletHistoryList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }, [account.wallet?.id]);


    const filteredHistories = walletHistoryList
        .filter((history) => {
            return (
                history.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount2 = Math.ceil(filteredHistories.length / historiesPerPage);

    const handlePageClick2 = (data) => {
        setCurrentPage2(data.selected);
    };
    const offset2 = currentPage2 * historiesPerPage;
    const currentHistories = filteredHistories.slice(offset2, offset2 + historiesPerPage);



    //SALARY
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const openSalaryModal = () => {
        setShowSalaryModal(true);
    };

    const closeSalaryModal = () => {
        setShowSalaryModal(false);
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const renderSalaryTable = () => {
        // Filter salary list for the selected year
        const filteredSalaries = salaryList.filter(salary => salary.year === selectedYear);

        return (
            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                <thead className="thead-light">
                    <tr>
                        {months.map((month, index) => (
                            <th key={index}>{month}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {months.map((month, index) => {
                            // Find the salary for the current month
                            const salaryForMonth = filteredSalaries.find(salary => salary.month === index + 1);
                            return (
                                <td key={index}>
                                    {salaryForMonth ? `$${salaryForMonth.amount.toFixed(2)}` : '-'}
                                </td>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        );
    };


    //COMPARE
    useEffect(() => {
        // Call createAreaChart whenever selectedYear changes or modal is shown
        createAreaChart();
    }, [selectedYear, renderSalaryTable]);



    const createAreaChart = () => {
        if (areaChartRef.current) {
            const areaChartCanvas = areaChartRef.current.getContext("2d");

            if (areaChartRef.current.chart) {
                areaChartRef.current.chart.destroy();
            }

            // Filter salary data for the selected year
            const filteredSalaries = salaryList.filter(salary => salary.year === selectedYear);

            // Extract salary for each month
            const salaryByMonth = Array.from({ length: 12 }, (_, index) => {
                const salaryForMonth = filteredSalaries.find(salary => salary.month === index + 1);
                return salaryForMonth ? salaryForMonth.amount : 0;
            });

            const data = {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                datasets: [
                    {
                        label: "Income",
                        data: salaryByMonth, // Use salary data for each month
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgba(54, 162, 235, 1)",
                        pointBorderColor: "#fff",
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            };

            const options = {
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderWidth: 1,
                            borderDash: [2],
                            borderDashOffset: [2],
                            drawBorder: false,
                            color: "rgba(0, 0, 0, 0.05)",
                            zeroLineColor: "rgba(0, 0, 0, 0.1)",
                        },
                        ticks: {
                            callback: (value) => {
                                if (value >= 1000) {
                                    return `$${value / 1000}k`;
                                }
                                return `$${value}`;
                            },
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label;
                                const value = context.formattedValue;
                                return `${label}: $${value}`;
                            },
                        },
                    },
                },
            };

            areaChartRef.current.chart = new Chart(areaChartCanvas, {
                type: "line",
                data: data,
                options: options,
            });
        }

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
                                    {loading && (
                                        <div className="loading-overlay">
                                            <div className="loading-spinner" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-md-6 col-xl-3 salary" onClick={openSalaryModal}>
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-primary border-primary border">
                                                    <i className="fe-heart font-22 avatar-title text-primary" />
                                                </div>
                                            </div>
                                            <div className="col-6 ">
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
                                                    <h3 className="text-dark mt-1"><span data-plugin="counterup">{rating.toFixed(2)}</span>%</h3>
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
                                            <table className="table table-borderless table-wrap table-hover table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Transaction Date</th>
                                                        <th>Note</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentHistories.length > 0 && currentHistories.map((history, index) => (
                                                            <tr>
                                                                <td>
                                                                    <h5 className="m-0 font-weight-normal">{history.transactionDate}</h5>
                                                                </td>
                                                                <td>
                                                                    {history.note}
                                                                </td>

                                                            </tr>
                                                        )
                                                        )
                                                    }

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
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                            <div className="modal-dialog modal-xl" role="document"> {/* Added modal-lg class here */}
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
                                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
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

                                        <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}
                {showSalaryModal && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Salary History</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeSalaryModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {/* Year selection dropdown */}
                                    <div style={{ float: 'left', marginRight: '20px', marginBottom: '5px' }}>
                                        {/* Year selection dropdown */}
                                        <select class="form-select" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                            {[...Array(5).keys()].map((_, index) => (
                                                <option key={index} value={new Date().getFullYear() - index}>{new Date().getFullYear() - index}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Render salary table based on selected year */}
                                    {renderSalaryTable()}
                                    <div className="chart-area">
                                        <canvas ref={areaChartRef} id="myAreaChart" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-dark" onClick={closeSalaryModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>
                {`
              
              .salary:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              }
              /* Custom modal size */
.custom-modal-xl {
    max-width: 90%;
    width: 90%;
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

export default TutorDashboard