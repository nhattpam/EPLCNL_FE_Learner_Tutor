import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link, useNavigate } from 'react-router-dom';
import categoryService from '../services/category.service';
import accountService from '../services/account.service';
import courseService from '../services/course.service';
import tutorService from '../services/tutor.service';
import learnerService from '../services/learner.service';
import SearchResult from './learner/course/SearchResult';
import walletService from '../services/wallet.service';

const Header = () => {

    const accountId = localStorage.getItem('accountId');
    const learnerId = localStorage.getItem('learnerId');
    const isTutor = sessionStorage.getItem('isTutor') === 'true';
    const isLearner = sessionStorage.getItem('isLearner') === 'true';

    const [showModal, setShowModal] = useState(false);
    const [showWalletHistoryModal, setShowWalletHistoryModal] = useState(false);
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
    const [editedAccount, setEditedAccount] = useState({
        email: "",
        fullName: "",
        phoneNumber: "",
        gender: ""
    });

    const openModal = () => {
        setShowModal(true);
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

    // Handle editing account data
    const handleEdit = () => {
        // Perform editing logic here, e.g., send edited data to the server
        console.log("Editing account data:", editedAccount);
        // Close the modal after editing
        closeModal();
    };

    // Update edited account state when input values change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedAccount({ ...editedAccount, [name]: value });
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
                setWalletHistoryList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [account.wallet.id]);

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
                                                    <Link to={`/my-forum/${forum?.id}`}>{forum.course.name}</Link>
                                                </li>
                                            ))

                                        }
                                        {
                                            forumList.length === 0 && (
                                                <p>You haven't joined any course.</p>
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
                                                    <p>Balance: {account.wallet?.balance} <i class="far fa-eye" onClick={openWalletHistoryModal}></i></p>
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
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">My Account</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {/* Conditional rendering based on edit mode */}
                                    {editMode ? (
                                        <div>
                                            {/* Input fields for editing */}
                                            <form>
                                                <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%' }} />

                                                <div >
                                                    <table className="table table-responsive table-hover mt-3">
                                                        <tbody>

                                                            <tr>
                                                                <th style={{ width: '30%' }}>Full Name:</th>
                                                                <td>  <input type="text" className="form-control" id="fullName" name="fullName" value={account.fullName} onChange={handleInputChange} />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Email:</th>
                                                                <td>  <input type="email" className="form-control" id="email" name="email" value={account.email} onChange={handleInputChange} />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Phone Number:</th>
                                                                <td>
                                                                    <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={account.phoneNumber} onChange={handleInputChange} />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Gender:</th>
                                                                <td>
                                                                    <select className="form-control" id="gender" name="gender" value={account.gender} onChange={handleInputChange}>
                                                                        <option value="male">Male</option>
                                                                        <option value="female">Female</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </form>

                                        </div>
                                    ) : (
                                        <div>
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

                                    )}
                                </div>
                                <div className="modal-footer">
                                    {/* Conditional rendering of buttons based on edit mode */}
                                    {editMode ? (
                                        <button type="button" className="btn btn-success" onClick={handleEdit}>Save Changes</button>
                                    ) : (
                                        <button type="button" className="btn btn-warning" onClick={toggleEditMode}>Edit</button>
                                    )}
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* wallet history */}
            {
                showWalletHistoryModal && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                        <div className="modal-dialog" role="document">
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
                                </div>
                                <div className="modal-footer">
                                    {/* Conditional rendering of buttons based on edit mode */}
                                    <button type="button" className="btn btn-secondary" onClick={closeWalletHistoryModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>


    );
};

export default Header;
