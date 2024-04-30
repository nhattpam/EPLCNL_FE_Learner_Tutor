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

    const accountId = sessionStorage.getItem('accountId');
    const learnerId = sessionStorage.getItem('learnerId');
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
        gender: false,
        wallet: []
    });

    useEffect(() => {
        if (accountId) {
            accountService
                .getAccountById(accountId)
                .then((res) => {
                    setAccount(res.data);
                    walletService
                        .getAllWalletHistoryByWallet(res.data.wallet?.id)
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
        sessionStorage.removeItem('accountId');
        sessionStorage.removeItem('isLearner');
        sessionStorage.removeItem('isTutor');
        sessionStorage.removeItem('learnerId'); // Assuming you store authentication token in localStorage
        sessionStorage.removeItem('tutorId'); // Assuming you store authentication token in localStorage
        sessionStorage.removeItem('token'); // Assuming you store authentication token in localStorage
        sessionStorage.removeItem('isLoggedIn');
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
        if (learnerId) {
            const fetchForums = async () => {
                try {
                    const res = await learnerService.getAllForumByLearnerId(learnerId);
                    setForumList(res.data);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchForums();
        }

    }, [learnerId]);


    //start SEARCH
    const [courseList, setCourseList] = useState([]);
    const [tutorList, setTutorList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [searchResultVisible, setSearchResultVisible] = useState(false);

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
            course.name.toLowerCase().includes(query.toLowerCase()) || 
            course.tags.toLowerCase().includes(query.toLowerCase()) 
        );
        setFilteredCourses(filteredCourseResults || []);

        // Filter tutors
        const filteredTutorResults = tutorList && tutorList.filter(tutor =>
            tutor.account?.fullName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTutors(filteredTutorResults || []);

        setSearchResultVisible(true); // Show SearchResult when search is performed

    };

    // useEffect to update search results whenever searchQuery changes
    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery, courseList, tutorList]);


    const handleCloseSearchResult = () => {
        // Close the SearchResult by setting searchResultVisible to false
        setSearchResultVisible(false);
    };

    //end SEARCH


    //WALLET HISTORY
    const [walletHistoryList, setWalletHistoryList] = useState([]);




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

        if (!account || !account.fullName || account.fullName.trim() === '') {
            errors.fullName = 'Name is required';
            isValid = false;
        }

        if (!account || !account.address || account.address.trim() === '') {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (!account || !account.phoneNumber || account.phoneNumber.trim() === '') {
            errors.phoneNumber = 'Phone Number is required';
            isValid = false;
        } else if (!account || !account.phoneNumber || !/^\d{10}$/.test(account.phoneNumber.trim())) {
            errors.phoneNumber = 'Phone Number must be exactly 10 digits';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const submitAccount = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            let imageUrl = account.imageUrl; // Keep the existing imageUrl if available

            if (file) {
                try {
                    // Upload image and get the link
                    const imageData = new FormData();
                    imageData.append("file", file);
                    const imageResponse = await accountService.uploadImage(imageData);

                    // Update the imageUrl with the link obtained from the API
                    imageUrl = imageResponse.data;

                    // Log the imageUrl after updating
                    console.log("this is url: " + imageUrl);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    // Handle image upload error here, show appropriate feedback to the user
                    return;
                }
            }

            // Convert gender string to boolean if needed
            if (account.gender === "male") {
                account.gender = true;
            } else if (account.gender === "female") {
                account.gender = false;
            }

            // Update account data
            const accountData = { ...account, imageUrl };

            try {
                const res = await accountService.updateAccount(account.id, accountData);
                console.log("Update Account Successfully:", res.data);
                window.alert("Update Account Successfully");
                // Assuming you have a state management system, update account details in the state here instead of reloading the page
                window.location.reload();
            } catch (error) {
                console.error("Error updating account:", error);
                // Handle account update error here, show appropriate feedback to the user
            }
        }
    };

    //DEPOSIT
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false); // State to track loading status

    const submitDeposit = (event) => {
        event.preventDefault();
        const learnerId = sessionStorage.getItem('learnerId');
        const selectedRadioButton = document.querySelector('input[name="amount"]:checked');

        if (!selectedRadioButton) {
            // If no radio button is checked, display an error message or handle the case as needed
            console.log("Please select an amount.");
            return;
        }

        const amount = parseFloat(selectedRadioButton.value); // Capture the selected radio button value

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
                                        // Reload the page
                                        window.location.reload();
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                    window.alert("Error while processing transaction...");
                                });
                        }, 5000);
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                        window.alert("Error while processing transaction...");

                    });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                window.alert("Error while processing transaction...");

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
                                style={{ width: '200px', borderRadius: '50px', padding: `8px 25px` }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                        </div>
                        {/* Render filtered courses if there are search results */}
                        <div className='search-result'>
                            {searchResultVisible && (
                                <SearchResult
                                    searchQuery={searchQuery}
                                    filteredCourses={filteredCourses}
                                    filteredTutors={filteredTutors}
                                    onClose={handleCloseSearchResult}

                                />
                            )}

                        </div>
                    </div>



                    <nav id="navbar" className="navbar order-last order-lg-0" >
                        <ul >
                            <li>
                                <Link to="/home">Home</Link>
                            </li>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                            <li className="dropdown" >
                                <a >
                                    <span>Course</span> <i className="bi bi-chevron-down" />
                                </a>
                                <ul style={{ borderRadius: '50px', padding: `8px 25px` }}>
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
                                    <a >
                                        <span>Forums</span> <i className="bi bi-chevron-down" />
                                    </a>
                                    <ul style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                        {
                                            forumList.length > 0 && forumList.map((forum) => (
                                                <li key={forum.id}> {/* Add a key to the mapped elements */}
                                                    <a href={`/my-forum/${forum?.id}`}>{forum.course?.name}</a>
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
                                    <div className="dropdown-menu dropdown-menu-right profile-dropdown " style={{ borderRadius: '50px', padding: `8px 25px`, justifyContent: 'left' }}>
                                        {/* item*/}
                                        <div className="dropdown-header noti-title">
                                            {isLearner && (
                                                <>
                                                    <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                                    <p>Balance: ${account.wallet?.balance}
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
                                        <Link href="javascript:void(0);" className="dropdown-item notify-item" to={`/my-learning`}>
                                            <i class="fas fa-journal-whills"></i>
                                            <span>My Learning</span>
                                        </Link>
                                        {/* item*/}
                                        <Link href="javascript:void(0);" className="dropdown-item notify-item" to={`/my-transaction`}>
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
                                                                    <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                    {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Phone Number:</th>
                                                                <td>
                                                                    <input type="number" className="form-control" name="phoneNumber" value={account.phoneNumber} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                    {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber}</p>}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Address:</th>
                                                                <td>
                                                                    <input type="text" className="form-control" name="address" value={account.address} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                    {errors.address && <p className="text-danger">{errors.address}</p>}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Gender:</th>
                                                                <td>
                                                                    <select className="form-control" name="gender" value={account.gender} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}>
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
                                                <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>
                                                <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
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
                                            <button type="button" className="btn btn-warning" onClick={toggleEditMode} style={{ borderRadius: '50px', padding: `8px 25px` }}>Edit</button>
                                            <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
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
                        <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
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
                                                                <td>{new Date(walletHistory.transactionDate).toLocaleString('en-US')}</td>
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
                                                <p>No transactions found.</p>
                                            </>

                                        )
                                    }
                                </div>

                                <div className="modal-footer">
                                    {/* Conditional rendering of buttons based on edit mode */}
                                    <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: `8px 25px` }} onClick={closeWalletHistoryModal}>Close</button>
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
                        <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Deposit</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeDepositModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form onSubmit={submitDeposit}>
                                    <div className="modal-body" >
                                        {/* Conditional rendering based on edit mode */}

                                        <div>
                                            {/* Input fields for editing */}
                                            <h3>Enter the amount you want to deposit:</h3>
                                            <input className='form-control' placeholder='USD accepted' type='number' name='amount' style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                            <p>Powered by <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '10%', marginTop: '20px' }} />
                                            </p>
                                            <div className="game-options-container">
                                                <span className='span1'>
                                                    <input
                                                        type="radio"
                                                        name="amount"
                                                        className="radio"
                                                        value="100"
                                                        id="amount-100"
                                                    />
                                                    <label
                                                        htmlFor="amount-100"
                                                        className={`option ${document.querySelector('input[value="100"]:checked') ? "selected" : ""}`}
                                                    >
                                                        $100
                                                    </label>
                                                </span>
                                                <span className='span1'>
                                                    <input
                                                        type="radio"
                                                        name="amount"
                                                        className="radio"
                                                        value="200"
                                                        id="amount-200"
                                                    />
                                                    <label
                                                        htmlFor="amount-200"
                                                        className={`option ${document.querySelector('input[value="200"]:checked') ? "selected" : ""}`}
                                                    >
                                                        $200
                                                    </label>
                                                </span>
                                                <span className='span1'>
                                                    <input
                                                        type="radio"
                                                        name="amount"
                                                        className="radio"
                                                        value="300"
                                                        id="amount-300"
                                                    />
                                                    <label
                                                        htmlFor="amount-300"
                                                        className={`option ${document.querySelector('input[value="300"]:checked') ? "selected" : ""}`}
                                                    >
                                                        $300
                                                    </label>
                                                </span>
                                                <span className='span1'>
                                                    <input
                                                        type="radio"
                                                        name="amount"
                                                        className="radio"
                                                        value="400"
                                                        id="amount-400"
                                                    />
                                                    <label
                                                        htmlFor="amount-400"
                                                        className={`option ${document.querySelector('input[value="400"]:checked') ? "selected" : ""}`}
                                                    >
                                                        $400
                                                    </label>
                                                </span>
                                                <span className='span1'>
                                                    <input
                                                        type="radio"
                                                        name="amount"
                                                        className="radio"
                                                        value="500"
                                                        id="amount-500"
                                                    />
                                                    <label
                                                        htmlFor="amount-500"
                                                        className={`option ${document.querySelector('input[value="500"]:checked') ? "selected" : ""}`}
                                                    >
                                                        $500
                                                    </label>
                                                </span>



                                            </div>

                                        </div>

                                    </div>
                                    {
                                        !loading ? (
                                            <>
                                                <div className="modal-footer" style={{ marginTop: '100px' }}>
                                                    {/* Conditional rendering of buttons based on edit mode */}
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-lg btn-block"
                                                        // onClick={handlePayClick}
                                                        style={{ backgroundColor: '#f58d04', borderRadius: '50px', padding: `8px 25px` }}
                                                    >
                                                        Continue
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="modal-footer" style={{ marginTop: '100px' }}>
                                                    {/* Conditional rendering of buttons based on edit mode */}
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-lg btn-block"
                                                        disabled
                                                        style={{ backgroundColor: '#f58d04', borderRadius: '50px', padding: `8px 25px` }}
                                                    >
                                                        Loading ...
                                                    </button>
                                                </div>
                                            </>

                                        )}

                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
            <style>
                {`
                
                .module-title:hover {
                    background-color: #333;
                    color: #fff;
                    cursor: pointer;
                }
                
                .module-list li:hover {
                    background-color: #f0f0f0;
                    cursor: pointer;
                }
                
                .card.module-title {
    background-color: #FFF0D6; /* Darker background color */
    color: #000; /* White text color */
    transition: background-color 0.3s ease; /* Smooth transition effect */
}

.card.module-title:hover {
    background-color: #E7E3DC; /* Darker background color on hover */
    color: #fff
}
.game-options-container{
    width: 100%;
    height: 12rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
}

.game-options-container span{
    width: 45%;
    height: 3rem;
    border: 2px solid darkgray;
    border-radius: 20px;
    overflow: hidden;
}
span label{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s;
    font-weight: 600;
    color: rgb(22, 22, 22);
}


.span1 label:hover{
    -ms-transform: scale(1.12);
    -webkit-transform: scale(1.12);
    transform: scale(1.12);
    color: #f58d04;
    background-color: #FFF0D6
}

input[type="radio"] {
    position: relative;
    display: none;
}



.next-button-container{
    width: 50%;
    height: 3rem;
    display: flex;
    justify-content: center;
}
.next-button-container button{
    width: 8rem;
    height: 2rem;
    border-radius: 10px;
    background: none;
    color: rgb(25, 25, 25);
    font-weight: 600;
    border: 2px solid gray;
    cursor: pointer;
    outline: none;
}
.next-button-container button:hover{
    background-color: rgb(143, 93, 93);
}

.modal-container{
    display: none;
    position: fixed;
    z-index: 1; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4); 
    flex-direction: column;
    align-items: center;
    justify-content: center; 
    -webkit-animation: fadeIn 1.2s ease-in-out;
    animation: fadeIn 1.2s ease-in-out;
}

.modal-content-container{
    height: 20rem;
    width: 25rem;
    background-color: rgb(43, 42, 42);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-radius: 25px;
}

.modal-content-container h1{
    font-size: 1.3rem;
    height: 3rem;
    color: lightgray;
    text-align: center;
}

.grade-details{
    width: 15rem;
    height: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

.grade-details p{
    color: white;
    text-align: center;
}

.modal-button-container{
    height: 2rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-button-container button{
    width: 10rem;
    height: 2rem;
    background: none;
    outline: none;
    border: 1px solid rgb(252, 242, 241);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 20px;
}
.modal-button-container button:hover{
    background-color: rgb(83, 82, 82);
}

@media(min-width : 300px) and (max-width : 350px){
    .game-quiz-container{
        width: 90%;
        height: 80vh;
     }
     .game-details-container h1{
        font-size: 0.8rem;
     }

     .game-question-container{
        height: 6rem;
     }
     .game-question-container h1{
       font-size: 0.9rem;
    }

    .game-options-container span{
        width: 90%;
        height: 2.5rem;
    }
    .game-options-container span label{
        font-size: 0.8rem;
    }
    .modal-content-container{
        width: 90%;
        height: 25rem;
    }

    .modal-content-container h1{
        font-size: 1.2rem;
    }
}
.correct-answer {
    background-color: green;
}

.incorrect-answer {
    background-color: red;
}
.fixed-course-name {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background-color: #333;
    padding: 10px 0;
}

.iitem {
    transition: transform 0.3s ease;
}

.iitem:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.truncate-text {
    max-width: 200px; /* Adjust max-width as needed */
    overflow: hidden;
    text-overflow: ellipsis;
}
.option.selected {
    color: #f58d04; // Change the color to your desired color
    background-color: #FFF0D6; // Change the background color to your desired color
}

.game-options-container span input[type="radio"]:checked + label {
    background-color: #f58d04; /* Change to your desired color */
    color: #fff; /* Change to your desired text color */
}

  
            `}
            </style>
        </>


    );
};

export default Header;
