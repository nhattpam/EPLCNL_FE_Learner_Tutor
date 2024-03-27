import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link, useNavigate } from 'react-router-dom';
import categoryService from '../services/category.service';
import accountService from '../services/account.service';
import courseService from '../services/course.service';
import tutorService from '../services/tutor.service';
import learnerService from '../services/learner.service';
import SearchResult from './learner/course/SearchResult';
import walletService from '../services/wallet.service';
import Dropzone from "react-dropzone";
import transactionService from '../services/transaction.service';

const Header = () => {

    const accountId = localStorage.getItem('accountId');
    const learnerId = localStorage.getItem('learnerId');
    const isTutor = sessionStorage.getItem('isTutor') === 'true';
    const isLearner = sessionStorage.getItem('isLearner') === 'true';

    const [showModal, setShowModal] = useState(false);
    const [showWalletHistoryModal, setShowWalletHistoryModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const navigate = useNavigate();


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
        if (accountId) {
            accountService
                .getAccountById(accountId)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [accountId]);


    const [editMode, setEditMode] = useState(false); // State to manage edit mode

    const openModal = () => {
        setShowModal(true);
        setEditMode(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openWalletHistoryModal = () => {
        setShowWalletHistoryModal(true);
    };

    const closeWalletHistoryModal = () => {
        setShowWalletHistoryModal(false);
    };

    const openDepositModal = () => {
        setShowDepositModal(true);
    };

    const closeDepositModal = () => {
        setShowDepositModal(false);
    };





    const handleLogout = () => {
        // Clear user session or perform any necessary logout actions
        // For example, you can use localStorage or sessionStorage to store authentication status
        localStorage.removeItem('accountId');
        sessionStorage.removeItem('isLearner');
        sessionStorage.removeItem('isTutor');
        localStorage.removeItem('learnerId'); // Assuming you store authentication token in localStorage

        // Redirect to the login page or any other page after logout
        navigate('/login');
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };


    const [categoryList, setCategoryList] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAllcategory();
                const sortedCategories = res.data.sort((a, b) => a.name.localeCompare(b.name));
                setCategoryList(sortedCategories);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCategories();
    }, []);

    const [forumList, setForumList] = useState([]);
    useEffect(() => {
        const fetchForums = async () => {
            try {
                const res = await learnerService.getAllForumByLearnerId(learnerId);
                setForumList(res.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchForums();
    }, [learnerId]);


    //start SEARCH
    const [courseList, setCourseList] = useState([]);
    const [tutorList, setTutorList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courseService.getAllcourse();
                const activeCourses = res.data.filter((course) => course.isActive === true);
                setCourseList(activeCourses);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCourses();
    }, []); // Empty dependency array to fetch courses only once when the component mounts


    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const res = await tutorService.getAllTutor(); // Add await here
                const activeTutors = res.data.filter((tutor) => tutor.account.isActive === true);
                setTutorList(activeTutors);
            } catch (error) {
                console.log(error);
            }
        };

        fetchTutors();
    }, []);

    // Function to handle search
    const handleSearch = (query) => {
        // Filter courses
        const filteredCourseResults = courseList && courseList.filter(course =>
            course.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCourses(filteredCourseResults || []);

        // Filter tutors
        const filteredTutorResults = tutorList && tutorList.filter(tutor =>
            tutor.account.fullName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTutors(filteredTutorResults || []);
    };

    // useEffect to update search results whenever searchQuery changes
    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery, courseList, tutorList]);



    //end SEARCH


    //WALLET HISTORY
    const [walletHistoryList, setWalletHistoryList] = useState([]);

    useEffect(() => {
        walletService
            .getAllWalletHistoryByWallet(account.wallet.id)
            .then((res) => {
                const filteredHistoryList = res.data;
                // Sort refundList by requestedDate
                const sortedHistoryList = [...filteredHistoryList].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.transactionDate) - new Date(a.transactionDate);
                });

                setWalletHistoryList(sortedHistoryList);
            })
            .catch((error) => {
                // console.log(error);
            });
    }, [account.wallet.id]);



    //UPDATE ACCOUNT
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
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

    const handleChange = (e) => {
        const value = e.target.value;
        setAccount({ ...account, [e.target.name]: value });
    };


    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (account.fullName.trim() === '') {
            errors.fullName = 'Name is required';
            isValid = false;
        }

        if (account.address.trim() === '') {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (account.phoneNumber.trim() === '') {
            errors.phoneNumber = 'Phone Number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(account.phoneNumber.trim())) {
            errors.phoneNumber = 'Phone Number must be exactly 10 digits';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const submitAccount = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Save account
            let imageUrl = account.imageUrl; // Keep the existing imageUrl if available

            if (file) {
                // Upload image and get the link
                const imageData = new FormData();
                imageData.append("file", file);
                const imageResponse = await accountService.uploadImage(imageData);

                // Update the imageUrl with the link obtained from the API
                let imageUrl = imageResponse.data;

                // Log the imageUrl after updating
                console.log("this is url: " + imageUrl);
                account.imageUrl = imageResponse.data;
            }

            // Update account
            const accountData = { ...account, imageUrl }; // Create a new object with updated imageUrl
            console.log(JSON.stringify(accountData))

            accountService
                .updateAccount(account.id, account)
                .then((res) => {
                    window.alert("Update Account Successfully");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    //DEPOSIT
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false); // State to track loading status

    const submitDeposit = (event) => {
        event.preventDefault();
        const learnerId = localStorage.getItem('learnerId');
        const amount = parseFloat(event.target.amount.value); // Capture the amount from the input field

        if (!learnerId) {
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            return;
        }
        setLoading(true);

        const transactionData = {
            learnerId: learnerId,
            amount: amount * 24000,
            paymentMethodId: "1dffb0d3-f5a5-4725-98fc-b4dea22f4b0e"
        };

        console.log(JSON.stringify(transactionData));

        transactionService
            .saveTransaction(transactionData)
            .then((response) => {
                transactionService
                    .payTransaction(response.data.id)
                    .then((res) => {
                        window.open(res.data, '_blank');
                        const checkTransactionStatus = setInterval(() => {
                            transactionService.getTransactionById(response.data.id)
                                .then((transactionRes) => {
                                    if (transactionRes.data.status === 'DONE') {
                                        setLoading(false);
                                        clearInterval(checkTransactionStatus);
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }, 5000);
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };
    //DEPOSIT

    //UPDATE ACCOUNT
    return (
        <>
            <header id="header" className="fixed-top">
                <div className="container d-flex align-items-center">
                    <h1 className="logo">
                        <Link to="/home">MeowLish</Link>
                    </h1>
                    <div className="search-box ms-auto">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Search for anything"
                                className="form-control"
                                style={{ width: '200px' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: '#f58d04' }}>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                        {/* Render filtered courses if there are search results */}
                        <div className='search-result'>
                            <SearchResult
                                searchQuery={searchQuery}
                                filteredCourses={filteredCourses}
                                filteredTutors={filteredTutors}
                            />
                        </div>
                    </div>



                    <nav id="navbar" className="navbar order-last order-lg-0">
                        <ul>
                            <li>
                                <Link to="/home">Home</Link>
                            </li>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                            <li className="dropdown">
                                <a href="#">
                                    <span>Course</span> <i className="bi bi-chevron-down" />
                                </a>
                                <ul>
                                    {categoryList.map((category) => (
                                        <li key={category.id}> {/* Add a key to the mapped elements */}
                                            <Link to={`/list-course-by-category/${category.id}`}>{category.name}</Link>
                                        </li>
                                    ))}
                                    <li>
                                        <Link to="/list-course">All Course</Link>
                                    </li>
                                </ul>
                            </li>
                            {!isLearner && (
                                <li>
                                    <Link to="/business-register">MeowLish Business</Link>
                                </li>
                            )}

                            {isLearner && (
                                <li className="dropdown">
                                    <a href="#">
                                        <span>Forums</span> <i className="bi bi-chevron-down" />
                                    </a>
                                    <ul>
                                        {
                                            forumList.length > 0 && forumList.map((forum) => (
                                                <li key={forum.id}> {/* Add a key to the mapped elements */}
                                                    <Link to={`/my-forum/${forum?.id}`}>{forum.course?.name}</Link>
                                                </li>
                                            ))

                                        }
                                        {
                                            forumList.length === 0 && (
                                                <>
                                                    <i class="fas fa-unlink fa-1x"></i>
                                                    <p>You haven't joined any course.</p>
                                                </>
                                            )
                                        }

                                    </ul>
                                </li>
                            )}
                            {isLearner && (
                                <li className="dropdown notification-list topbar-dropdown">
                                    <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                        {isLearner && (
                                            <img src={account.imageUrl} alt="user-image" className="rounded-circle" />

                                        )}
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                        {/* item*/}
                                        <div className="dropdown-header noti-title">
                                            {isLearner && (
                                                <>
                                                    <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                                    <p>Balance: {account.wallet?.balance}
                                                        <i class="far fa-eye text-dark ml-1" onClick={openWalletHistoryModal}></i>
                                                        <i class="fas fa-funnel-dollar text-success" onClick={openDepositModal}></i>
                                                        <i class="fas fa-funnel-dollar text-danger"></i></p>
                                                </>
                                            )}

                                        </div>
                                        {/* item*/}
                                        <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={openModal} style={{ marginTop: '-30px' }}>
                                            <i className="fe-user" />
                                            <span>My Account</span>
                                        </a>
                                        {/* item*/}
                                        <Link href="javascript:void(0);" className="dropdown-item notify-item" to={`/my-learning/${learnerId}`}>
                                            <i class="fas fa-journal-whills"></i>
                                            <span>My Learning</span>
                                        </Link>
                                        {/* item*/}
                                        <Link href="javascript:void(0);" className="dropdown-item notify-item" to={`/my-transaction/${learnerId}`}>
                                            <i class="fas fa-money-bill-wave"></i>
                                            <span>Transaction</span>
                                        </Link>
                                        <div className="dropdown-divider" />
                                        {/* item*/}
                                        <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={handleLogout}>
                                            <i className="fe-log-out" />
                                            <span>Logout</span>
                                        </a>
                                    </div>
                                </li>

                            )}
                            {!isLearner && (
                                <li>
                                    <Link to="/login">Log in</Link>
                                </li>
                            )}
                        </ul>
                        <i className="bi bi-list mobile-nav-toggle" />

                    </nav>
                    {!isLearner && (
                        <Link to="/register" className="get-started-btn">
                            Join for Free
                        </Link>
                    )}


                </div>
            </header >
            <div className='search-result'>

            </div>

            {/* My Account Modal */}
            {
                showModal && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">My Account</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                {/* Conditional rendering based on edit mode */}
                                {editMode ? (
                                    <>
                                        <form onSubmit={(e) => submitAccount(e)}>
                                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                {/* Input fields for editing */}
                                                <label htmlFor="imageUrl">
                                                    <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%', cursor: 'pointer' }} />
                                                </label>
                                                <Dropzone
                                                    onDrop={handleFileDrop}
                                                    accept="image/*"
                                                    multiple={false}
                                                    maxSize={5000000} // Maximum file size (5MB)

                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <div {...getRootProps()} className="fallback">
                                                            <input {...getInputProps()} />
                                                            <div className="dz-message needsclick">
                                                                <i className="h1 text-muted dripicons-cloud-upload" />
                                                            </div>
                                                            {imagePreview && (
                                                                <img
                                                                    src={imagePreview}
                                                                    alt="Preview"
                                                                    style={{
                                                                        width: '30%', cursor: 'pointer'
                                                                    }}
                                                                    className='rounded-circle'
                                                                />
                                                            )}
                                                        </div>

                                                    )}
                                                </Dropzone>

                                                <div className="table-responsive">
                                                    <table className="table table-hover mt-3">
                                                        <tbody>
                                                            <tr>
                                                                <th style={{ width: '30%' }}>Full Name:</th>
                                                                <td>
                                                                    <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={(e) => handleChange(e)} />
                                                                    {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Phone Number:</th>
                                                                <td>
                                                                    <input type="number" className="form-control" name="phoneNumber" value={account.phoneNumber} onChange={(e) => handleChange(e)} />
                                                                    {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber}</p>}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Address:</th>
                                                                <td>
                                                                    <input type="text" className="form-control" name="address" value={account.address} onChange={(e) => handleChange(e)} />
                                                                    {errors.address && <p className="text-danger">{errors.address}</p>}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Gender:</th>
                                                                <td>
                                                                    <select className="form-control" name="gender" value={account.gender} onChange={(e) => handleChange(e)}>
                                                                        <option value="male">Male</option>
                                                                        <option value="female">Female</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="submit" className="btn btn-success">Save Changes</button>
                                                <button type="button" className="btn btn-dark" onClick={closeModal}>Close</button>
                                            </div>
                                        </form>
                                    </>


                                ) : (
                                    <>
                                        <div className="modal-body">

                                            <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%' }} />

                                            <div>
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
                                                            <td>{account && account.phoneNumber ? account.phoneNumber : 'Unknown Phone Number'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Address:</th>
                                                            <td>{account && account.address ? account.address : 'Unknown Address'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Gender:</th>
                                                            <td>
                                                                {account.gender ? (
                                                                    <span className="badge label-table badge-success">Male</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-danger">Female</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-warning" onClick={toggleEditMode}>Edit</button>
                                            <button type="button" className="btn btn-dark" onClick={closeModal}>Close</button>
                                        </div>
                                    </>

                                )}

                            </div>
                        </div>
                    </div>
                )
            }

            {/* wallet history */}
            {
                showWalletHistoryModal && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Wallet History</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeWalletHistoryModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {/* Conditional rendering based on edit mode */}

                                    <div>
                                        {/* Input fields for editing */}
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Transaction Date</th>
                                                        <th>Note</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        walletHistoryList.length > 0 && walletHistoryList.map((walletHistory, index) => (
                                                            <tr key={walletHistory.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{walletHistory.transactionDate}</td>
                                                                <td>{walletHistory.note}</td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>

                                        </div>

                                    </div>
                                    {
                                        walletHistoryList.length === 0 && (
                                            <>
                                                <i class="fas fa-hand-holding-usd fa-2x mt-4"></i>
                                                <p>No histories found.</p>
                                            </>

                                        )
                                    }
                                </div>

                                <div className="modal-footer">
                                    {/* Conditional rendering of buttons based on edit mode */}
                                    <button type="button" className="btn btn-dark" onClick={closeWalletHistoryModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* deposit history */}
            {
                showDepositModal && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Deposit</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeDepositModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form onSubmit={submitDeposit}>
                                    <div className="modal-body">
                                        {/* Conditional rendering based on edit mode */}

                                        <div>
                                            {/* Input fields for editing */}
                                            <h3>Enter the amount you want to deposit:</h3>
                                            <input className='form-control' placeholder='USD accepted' type='number' name='amount' />
                                            <p>Powered by <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '25%', marginTop: '20px' }} />
                                            </p>

                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        {/* Conditional rendering of buttons based on edit mode */}
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg btn-block"
                                            // onClick={handlePayClick}
                                            style={{ backgroundColor: '#f58d04' }}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </>


    );
};

export default Header;
