import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import accountService from '../../services/account.service';
import tutorService from '../../services/tutor.service';
import paperWorkTypeService from '../../services/paper-work-type.service';
import Dropzone from 'react-dropzone';
import paperWorkService from '../../services/paper-work.service';
import walletService from '../../services/wallet.service';

const Header = () => {

    const accountId = localStorage.getItem('accountId');
    const [showModal, setShowModal] = useState(false);
    const [showQualificationModal, setShowQualificationModal] = useState(false);
    const navigate = useNavigate();
    const storedTutorId = localStorage.getItem('tutorId');


    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
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


    const handleLogout = () => {
        // Clear user session or perform any necessary logout actions
        // For example, you can use localStorage or sessionStorage to store authentication status
        localStorage.removeItem('authToken'); // Assuming you store authentication token in localStorage

        // Redirect to the login page or any other page after logout
        navigate('/login');
    };

    useEffect(() => {
        const handleBackwardNavigation = () => {
            // Redirect users to a specific page when they try to go back
            navigate('/prevent-back');
        };

        window.addEventListener('popstate', handleBackwardNavigation);

        return () => {
            window.removeEventListener('popstate', handleBackwardNavigation);
        };
    }, [navigate]);

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

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const [editMode, setEditMode] = useState(false); // State to manage edit mode
    const [editedAccount, setEditedAccount] = useState({
        email: "",
        fullName: "",
        phoneNumber: "",
        gender: ""
    });

    //qualification
    const openQualificationModal = () => {
        setShowQualificationModal(true);

    };

    const closeQualificationModal = () => {
        setShowQualificationModal(false);
    };

    const [paperWork, setPaperWork] = useState({
        paperWorkUrl: "",
        paperWorkTypeId: "",
        tutorId: storedTutorId,
    });

    const [paperWorkList, setPaperWorkList] = useState([]);
    const [paperWorkTypeList, setPaperWorkTypeList] = useState([]);

    useEffect(() => {
        paperWorkTypeService
            .getAllPaperWorkType()
            .then((res) => {
                setPaperWorkTypeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    useEffect(() => {
        tutorService
            .getAllPaperWorksByTutor(storedTutorId)
            .then((res) => {
                setPaperWorkList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [storedTutorId]);

    const [file, setFile] = useState(null);
    const [pdfPreview, setPdfPreview] = useState("");


    const handleFileDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);

            // Set the PDF preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setPdfPreview(previewUrl);
        }
    };

    const submitPaperWork = async (e) => {
        e.preventDefault();

        try {
            // Save account
            let paperWorkUrl = paperWork.paperWorkUrl; // Keep the existing imageUrl if available

            if (file) {
                // Upload image and get the link
                const paperWorkData = new FormData();
                paperWorkData.append('file', file);
                const paperWorkResponse = await paperWorkService.uploadMaterial(paperWorkData);

                // Update the imageUrl with the link obtained from the API
                paperWorkUrl = paperWorkResponse.data;

                // Log the imageUrl after updating
                // console.log("this is url: " + materialUrl);
            }

            const paperWorkData = { ...paperWork, paperWorkUrl }; // Create a new object with updated imageUrl
            console.log(JSON.stringify(paperWorkData))


            // Save account
            const paperWorklResponse = await paperWorkService.savePaperWork(paperWorkData);

            // Fetch the updated list of paperwork
            tutorService.getAllPaperWorksByTutor(storedTutorId)
                .then((res) => {
                    setPaperWorkList(res.data);
                    // window.alert("Upload successfully");
                })
                .catch((error) => {
                    console.log(error);
                });
            // console.log(courseResponse.data);
            const paperWorkJson = JSON.stringify(paperWorklResponse.data);

            const paperWorkJsonParse = JSON.parse(paperWorkJson);


        } catch (error) {
            console.log(error);
        }
    };

    //delete paperWork
    const deletePaperWork = async (id) => {
        await paperWorkService.deletePaperWorkById(id);

        // Fetch the updated list of paperwork
        tutorService.getAllPaperWorksByTutor(storedTutorId)
            .then((res) => {
                setPaperWorkList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //WALLET HISTORY
    const [walletHistoryList, setWalletHistoryList] = useState([]);

    useEffect(() => {
        walletService
            .getAllWalletHistoryByWallet(account.wallet?.id)
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
    }, [account.wallet?.id]);

    const [showWalletHistoryModal, setShowWalletHistoryModal] = useState(false);

    const openWalletHistoryModal = () => {
        setShowWalletHistoryModal(true);
    };

    const closeWalletHistoryModal = () => {
        setShowWalletHistoryModal(false);
    };


    return (
        <>
            {/* Topbar Start */}
            <div className="navbar-custom" style={{ backgroundColor: '#242732' }}>
                <div className="container-fluid">
                    <ul className="list-unstyled topnav-menu float-right mb-0">

                        <li className="dropdown d-inline-block d-lg-none">
                            <a className="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <i className="fe-search noti-icon" />
                            </a>
                            <div className="dropdown-menu dropdown-lg dropdown-menu-right p-0">
                                <form className="p-3">
                                    <input type="text" className="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                                </form>
                            </div>
                        </li>



                        <li className="dropdown notification-list topbar-dropdown">
                            <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <img src={account.imageUrl} alt="user-image" className="rounded-circle" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                {/* item*/}
                                <div className="dropdown-header noti-title">
                                    <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                    <p>Balance: {account.wallet?.balance} <i class="far fa-eye" onClick={openWalletHistoryModal}></i></p>
                                </div>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={openModal} style={{ marginTop: '-30px' }}>
                                    <i className="fe-user" />
                                    <span>My Account</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={openQualificationModal}>
                                    <i class="fas fa-scroll"></i>
                                    <span>Qualification</span>
                                </a>
                                {/* item*/}

                                <div className="dropdown-divider" />
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={handleLogout}>
                                    <i className="fe-log-out" />
                                    <span>Logout</span>
                                </a>
                            </div>
                        </li>
                    </ul>
                    {/* LOGO */}
                    <div className="logo-box">
                        <Link to={`/tutor-dashboard/${storedTutorId}`} className="logo logo-light text-center">
                            <span style={{ fontFamily: 'Comic Sans MS', fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                MEOWLISH
                            </span>
                        </Link>
                    </div>


                    <div className="clearfix" />
                </div>
            </div>
            {/* end Topbar */}
            {/* My Account Modal */}
            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
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
            )}

            {/* Tutor Qualification Modal */}
            {showQualificationModal && (
                <>
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document"> {/* Added modal-dialog-centered class */}

                            <div className="modal-content">
                                <form
                                    method="post"
                                    className="dropzone"
                                    id="myAwesomeDropzone"
                                    data-plugin="dropzone"
                                    data-previews-container="#file-previews"
                                    data-upload-preview-template="#uploadPreviewTemplate"
                                    data-parsley-validate
                                    onSubmit={(e) => submitPaperWork(e)}
                                >

                                    <div className="modal-header">
                                        <h5 className="modal-title">My Qualification</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeQualificationModal}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                        <div>
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Type</th>
                                                        <th scope="col">Url</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paperWorkList.length > 0 && paperWorkList.map((paperWork, index) => (

                                                        <tr>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{paperWork.paperWorkType.name}</td>
                                                            <td className='text-truncate' style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Link to={paperWork.paperWorkUrl}>{paperWork.paperWorkUrl}</Link></td>
                                                            <th scope="row" onClick={() => deletePaperWork(paperWork.id)} ><i class="fas fa-trash text-danger"></i></th>
                                                        </tr>
                                                    ))}


                                                </tbody>
                                            </table>
                                            {
                                                paperWorkList.length === 0 && (
                                                    <p className='text-center'>No paper works.</p>
                                                )
                                            }
                                            {/* Input fields for editing */}
                                            <div className="form-group">
                                                <select
                                                    className="form-control"
                                                    id="paperWorkType"
                                                    name="paperWorkType"
                                                    value={paperWork.paperWorkTypeId}
                                                    onChange={(e) => setPaperWork({ ...paperWork, paperWorkTypeId: e.target.value })} // Update paperWorkTypeId when the type is selected
                                                >
                                                    <option value="">Select a type</option>
                                                    {paperWorkTypeList.map((paperWorkType, index) => (
                                                        <option key={index} value={paperWorkType.id}>{paperWorkType.name}</option>
                                                    ))}
                                                </select>

                                            </div>

                                            <Dropzone
                                                onDrop={handleFileDrop}
                                                accept="application/pdf" multiple={false}
                                                maxSize={5000000} // Maximum file size (5MB)
                                            >
                                                {({ getRootProps, getInputProps }) => (
                                                    <div {...getRootProps()} className="fallback">
                                                        <input {...getInputProps()} />
                                                        <div className="dz-message needsclick">
                                                            <i className="h1 text-muted dripicons-cloud-upload" />
                                                            <h3>Drop files here or click to upload.</h3>
                                                        </div>
                                                        {pdfPreview && (
                                                            <div>
                                                                {/* PDF Preview */}
                                                                <embed src={pdfPreview} type="application/pdf" width="100%" height="500px" />
                                                            </div>
                                                        )}

                                                    </div>
                                                )}
                                            </Dropzone>
                                            <div className="dropzone-previews mt-3" id="file-previews" />

                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {/* Conditional rendering of buttons based on edit mode */}
                                        <button type="submit" className="btn btn-warning" >Upload</button>
                                        <button type="button" className="btn btn-dark" onClick={closeQualificationModal}>Close</button>
                                    </div>
                                </form>

                            </div>
                        </div>

                    </div>
                </>
            )
            }
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
        </>
    )
}

export default Header