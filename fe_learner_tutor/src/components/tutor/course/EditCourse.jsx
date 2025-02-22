import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseService from '../../../services/course.service';
import moduleService from '../../../services/module.service';
import ReactQuill from 'react-quill';
import certificateService from '../../../services/certificate.service';
import certificateCourseService from '../../../services/certificate-course.service';
import Dropzone from 'react-dropzone';
import lessonMaterialService from '../../../services/material.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const EditCourse = () => {

    const tutorId = sessionStorage.getItem('tutorId');

    const [course, setCourse] = useState({
        name: "",
        description: "",
        code: "",
        imageUrl: "",
        stockPrice: "",
        rating: "",
        categoryId: "",
        tags: "",
        createdDate: "",
        updatedDate: "",
        modules: [],
        classModules: [],
        certificate: []
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }

    const [moduleList, setModuleList] = useState([]);
    const [classModuleList, setClassModuleList] = useState([]);


    const { courseId } = useParams();

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    useEffect(() => {
        if (courseId) {
            courseService
                .getCourseById(courseId)
                .then((res) => {
                    setCourse(res.data);
                    setLoading(false);

                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);

                });
        }
    }, [courseId]);

    useEffect(() => {
        courseService
            .getAllModulesByCourse(courseId)
            .then((res) => {
                // console.log(res.data);
                setModuleList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);

    useEffect(() => {
        courseService
            .getAllClassModulesByCourse(courseId)
            .then((res) => {
                const sortedModules = res.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

                setClassModuleList(sortedModules);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);

    useEffect(() => {
        if (courseId) {
            courseService
                .getCertificateByCourse(courseId)
                .then((res) => {
                    setCertificate(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [courseId]);



    const handleEditModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/tutor/courses/edit-module/${moduleId}`);
    };


    const handleEditClassModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/tutor/courses/edit-class-module/${moduleId}`);
    };

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

    const [certificate, setCertificate] = useState({
        name: "",
        courseId: "",
        description: ""
    });


    const submitCertificate = async (e) => {
        e.preventDefault();

        try {
            // Save course
            let description = certificate.description; // Keep the existing imageUrl if available

            if (file) {
                // Upload image and get the link
                const materialData = new FormData();
                materialData.append('file', file);
                const materialResponse = await lessonMaterialService.uploadMaterial(materialData);

                // Update the imageUrl with the link obtained from the API
                description = materialResponse.data;
            }

            const certificateData = {
                name: `Thanks for your time, this is certificate for course ${course.name}`,
                courseId: courseId,
                description: description
            }; // Create a new object with updated imageUrl

            console.log(JSON.stringify(certificateData))

            if (certificateData.description === null) {
                window.alert("Certificate is empty");
                return;
            }
            const responseCertificate = await certificateService.saveCertificate(certificateData);
            if (responseCertificate.status === 201) {
                window.alert("Create Certificate Successfully!");
                // Optionally, you can navigate to another page or perform any other action upon successful creation
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };


    //EDIT COURSE
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [fileImage, setFileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleFileDropImage = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFileImage(acceptedFiles[0]);

            // Set the image preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setImagePreview(previewUrl);
        }
    };

    const openEditCourseModal = () => {
        setShowEditCourseModal(true);
    };

    const closeEditCourseModal = () => {
        setShowEditCourseModal(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setCourse({ ...course, [e.target.name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (course.name.trim() === '') {
            errors.name = 'Name is required';
            isValid = false;
        }

        if (course.code.trim() === '') {
            errors.code = 'Code is required';
            isValid = false;
        }

        if (course.tags.trim() === '') {
            errors.code = 'Tags is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const submitCourse = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Save account
            let imageUrl = course.imageUrl; // Keep the existing imageUrl if available

            if (fileImage) {
                // Upload image and get the link
                const imageData = new FormData();
                imageData.append("file", fileImage);
                const imageResponse = await courseService.uploadImage(imageData);

                // Update the imageUrl with the link obtained from the API
                let imageUrl = imageResponse.data;

                // Log the imageUrl after updating
                console.log("this is url: " + imageUrl);
                course.imageUrl = imageResponse.data;
            }

            // Update course
            const courseData = { ...course, imageUrl }; // Create a new object with updated imageUrl
            console.log(JSON.stringify(courseData))

            courseService
                .updateCourse(course.id, courseData)
                .then((res) => {
                    window.alert("Update Course Successfully!");
                    window.location.reload();

                })
                .catch((error) => {
                    console.log(error);
                });

        }
    };


    //enrolled learners:
    const [enrollmentList, setEnrollmentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [enrollmentsPerPage] = useState(5);
    useEffect(() => {
        courseService
            .getAllEnrollmentsByCourse(courseId)
            .then((res) => {
                const notRefundEnrollments = res.data.filter(enrollment => enrollment.refundStatus === false);

                // Sort the filtered enrollments by enrolledDate
                const sortedEnrollments = notRefundEnrollments.sort((a, b) => {
                    return new Date(b.enrolledDate) - new Date(a.enrolledDate);
                });

                setEnrollmentList(sortedEnrollments);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [courseId]);

    const filteredEnrollments = enrollmentList
        .filter((enrollment) => {
            return (
                enrollment.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount = Math.ceil(filteredEnrollments.length / enrollmentsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * enrollmentsPerPage;
    const currentEnrollments = filteredEnrollments.slice(offset, offset + enrollmentsPerPage);

    //MODAL NOTE
    const [showNoteModal, setShowNoteModal] = useState(false);
    const openNoteModal = () => {
        setShowNoteModal(true);

    };

    const closeNoteModal = () => {
        setShowNoteModal(false);
    };
    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    {/* Start Content*/}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card-box">
                                    <div className="form-group">
                                        <h4 className="header-title">COURSE INFORMATION &nbsp;<i class="fa-solid fa-pen-to-square" onClick={openEditCourseModal}></i></h4>

                                        {loading && (
                                            <div className="loading-overlay">
                                                <div className="loading-spinner" />
                                            </div>
                                        )}
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-hover table-wrap table-centered m-0">
                                                <tbody>
                                                    <tr>
                                                        <th>Course Name:</th>
                                                        <td>{course.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Code:</th>
                                                        <td>{course.code}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Price:</th>
                                                        <td>${course.stockPrice}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tags:</th>
                                                        <td>
                                                            <span className="badge label-table badge-warning">#{course.tags}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Description:</th>
                                                        <td>
                                                            {course.description}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Note:</th>
                                                        <td onClick={() => openNoteModal()}>
                                                            <i class="fa-solid fa-note-sticky"></i>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Created Date:</th>
                                                        <td>
                                                            {new Date(course.createdDate).toLocaleString('en-US')}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {showNoteModal && (
                                        <>
                                            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
                                            >
                                                <div className="modal-dialog modal-lg modal-dialog-centered" role="document"> {/* Added modal-dialog-centered class */}

                                                    <div className="modal-content" >


                                                        <div className="modal-header">
                                                            <h5 className="modal-title">Note</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeNoteModal}>
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                            <div dangerouslySetInnerHTML={{ __html: course.note }}>
                                                            </div>

                                                            <div className="modal-footer">
                                                                {/* Conditional rendering of buttons based on edit mode */}
                                                                <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: `8px 25px` }} onClick={closeNoteModal}>Close</button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </>
                                    )
                                    }


                                    <div className="form-group">
                                        <h5>Modules:</h5>

                                        <ul className="list-group">
                                            {
                                                moduleList.length > 0 && moduleList.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', borderBottom: '1px solid #dee2e6' }}>

                                                        {module.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditModule(module.id)}
                                                            className="btn btn-link text-dark"
                                                        >
                                                            <i class="far fa-eye"></i>
                                                        </button>
                                                    </li>
                                                ))
                                            }
                                            {
                                                classModuleList.length > 0 && classModuleList.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', borderBottom: '1px solid #dee2e6' }}>
                                                        Class Date: {module.startDate ? new Date(module.startDate).toLocaleDateString('en-US') : "No start date"}
                                                        <button
                                                            type="button"
                                                            // className="btn btn-secondary btn-sm"
                                                            className="btn btn-link text-dark"
                                                            onClick={() => handleEditClassModule(module.id)}
                                                        >
                                                            <i class="far fa-eye"></i>

                                                        </button>
                                                    </li>
                                                ))
                                            }

                                        </ul>
                                    </div>

                                    {(!course.isOnlineClass) && (
                                        <div className="form-group mb-4">
                                            <>
                                                {moduleList.length === 0 && (
                                                    <p>No modules available.</p>
                                                )}
                                                <Link
                                                    type="button"
                                                    className="btn btn-success mr-2"
                                                    to={`/tutor/courses/create/create-video-course/create-module/${course.id}`}
                                                    style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    Create new module
                                                </Link>


                                                {/* <button
                                                    type="submit"
                                                    className="btn btn-danger"
                                                >
                                                    Request to delete
                                                </button> */}

                                                <Link
                                                    type="button"
                                                    className="btn btn-black mr-2"
                                                    to={`/tutor/courses/list-video-course/${tutorId}`}
                                                >
                                                    <i class="fas fa-long-arrow-alt-left"></i> Back to List Course
                                                </Link>
                                            </>


                                        </div>

                                    )}
                                    {(course.isOnlineClass) && (
                                        <div className="form-group mb-2">
                                            <>
                                                {classModuleList.length === 0 && (
                                                    <p>No modules available.</p>
                                                )}
                                                <Link
                                                    type="button"
                                                    className="btn btn-success mr-2"
                                                    to={`/tutor/courses/create/create-class-course/create-class-module/${course.id}`}
                                                    style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    Create new module
                                                </Link>

                                                <Link
                                                    type="button"
                                                    className="btn btn-black mr-2"
                                                    to={`/tutor/courses/list-class-course/${tutorId}`}
                                                >
                                                    <i class="fas fa-long-arrow-alt-left"></i> Back to List Course
                                                </Link>
                                            </>


                                        </div>

                                    )}

                                    {
                                        !course.isOnlineClass && (
                                            <>
                                                <div className="form-group mt-4">
                                                    <h5>Certificate:</h5>

                                                    {
                                                        course.certificate?.description != null && (
                                                            <embed src={course.certificate?.description} type="application/pdf" width="100%" height="500px" />

                                                        )
                                                    }


                                                    {
                                                        course.certificate == null && (
                                                            <>
                                                                <form
                                                                    method="post"
                                                                    data-parsley-validate
                                                                    onSubmit={(e) => submitCertificate(e)}
                                                                >
                                                                    <div className="card">
                                                                        <div className="card-body">

                                                                            <input type='hidden' value={`Thanks for your time, this is certificate for course ${course.name}`} name='name' />
                                                                            <input type='hidden' value={courseId} name='courseId' />
                                                                            <div className="form-group">
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

                                                                            <div className="form-group mb-0">
                                                                                <button
                                                                                    type="submit"
                                                                                    className="btn btn-success"
                                                                                    style={{
                                                                                        marginLeft: "-2px",
                                                                                        marginTop: "50px",
                                                                                        borderRadius: '50px', padding: `8px 25px`
                                                                                    }}
                                                                                >
                                                                                    Create
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </>
                                                        )
                                                    }

                                                </div>
                                            </>
                                        )
                                    }

                                    <div className="form-group mt-4">
                                        <h5>Enrolled Learners:</h5>

                                        <div className="table-responsive text-center">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-toggle="true">Image</th>
                                                        <th data-toggle="true">Full Name</th>
                                                        <th data-toggle="true">Phone</th>
                                                        <th data-hide="phone">Gender</th>
                                                        <th data-hide="phone, tablet">DOB</th>
                                                        <th data-hide="phone, tablet">Enrolled Date</th>
                                                        {/* <th>Action</th> */}
                                                        {/* <th>Courses</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentEnrollments.length > 0 && currentEnrollments.map((enrollment, index) => (
                                                            <tr key={enrollment.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <img src={enrollment.transaction?.learner?.account?.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                                    </img>
                                                                </td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.fullName ? enrollment.transaction?.learner?.account?.fullName : 'Unknown Name'}</td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.phoneNumber ? enrollment.transaction?.learner?.account?.phoneNumber : 'Unknown Phone Number'}</td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.gender !== undefined ? (enrollment.transaction?.learner?.account?.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>
                                                                <td>
                                                                    {enrollment.transaction?.learner?.account?.dateOfBirth && typeof enrollment.transaction.learner.account.dateOfBirth === 'string' ?
                                                                        enrollment.transaction.learner.account.dateOfBirth.substring(0, 10) :
                                                                        'Unknown DOB'}
                                                                </td>
                                                                <td>
                                                                    {new Date(enrollment.enrolledDate).toLocaleString('en-US')}
                                                                </td>
                                                                {/* <td>
                                                                    <Link to={`/edit-learner/${enrollment.transaction?.learner?.account?.id}`} className='text-secondary'>
                                                                        <i className="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td> */}
                                                                {/* <td>
                                                                            <Link to={`/list-course-by-tutor/${tutor.id}`} className='text-dark'>
                                                                                <i class="ti-more-alt"></i>
                                                                            </Link>
                                                                        </td> */}
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                    {
                                        enrollmentList.length === 0 && (
                                            <p className='text-center'>No enrollments yet.</p>
                                        )
                                    }
                                    {/* Pagination */}
                                    <div className='container-fluid'>
                                        {/* Pagination */}
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <ReactPaginate
                                                previousLabel={
                                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                        <AiFillCaretLeft />
                                                    </IconContext.Provider>
                                                }
                                                nextLabel={
                                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                        <AiFillCaretRight />
                                                    </IconContext.Provider>
                                                } breakLabel={'...'}
                                                breakClassName={'page-item'}
                                                breakLinkClassName={'page-link'}
                                                pageCount={pageCount}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={5}
                                                onPageChange={handlePageClick}
                                                containerClassName={'pagination'}
                                                activeClassName={'active'}
                                                previousClassName={'page-item'}
                                                nextClassName={'page-item'}
                                                pageClassName={'page-item'}
                                                previousLinkClassName={'page-link'}
                                                nextLinkClassName={'page-link'}
                                                pageLinkClassName={'page-link'}
                                            />
                                        </div>

                                    </div>

                                    {showEditCourseModal && (
                                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                            <div className="modal-dialog modal-lg" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Edit Course</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeEditCourseModal}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    {/* Conditional rendering based on edit mode */}
                                                    <>
                                                        <form onSubmit={(e) => submitCourse(e)}>
                                                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                                {/* Input fields for editing */}
                                                                <label htmlFor="imageUrl">
                                                                    <img src={course.imageUrl} alt="avatar" style={{ width: '100%', cursor: 'pointer' }} />
                                                                </label>
                                                                <Dropzone
                                                                    onDrop={handleFileDropImage}
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
                                                                                        width: '100%', cursor: 'pointer'
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </div>

                                                                    )}
                                                                </Dropzone>

                                                                <div className="table-responsive">
                                                                    <table className="table table-hover mt-3">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th style={{ width: '30%' }}>Name:</th>
                                                                                <td>
                                                                                    <input type="text" className="form-control" name="name" value={course.name} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                                    {errors.name && <p className="text-danger">{errors.name}</p>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Price:</th>
                                                                                <td>
                                                                                    <input type="number" className="form-control" name="price" value={course.stockPrice} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                                    {errors.stockPrice && <p className="text-danger">{errors.stockPrice}</p>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Code:</th>
                                                                                <td>
                                                                                    <input type="text" className="form-control" name="code" value={course.code} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                                    {errors.code && <p className="text-danger">{errors.code}</p>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Tags:</th>
                                                                                <td>
                                                                                    <input type="text" className="form-control" name="tags" value={course.tags} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                                    {errors.tags && <p className="text-danger">{errors.tags}</p>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Description:</th>
                                                                                <td>
                                                                                    <textarea type="text" className="form-control" name="description" value={course.description} onChange={(e) => handleChange(e)} style={{ borderRadius: '20px', padding: `8px 25px`, height: '150px' }} ></textarea>
                                                                                    {errors.description && <p className="text-danger">{errors.description}</p>}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>
                                                                <button type="button" className="btn btn-dark" onClick={closeEditCourseModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                            </div>
                                                        </form>
                                                    </>


                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </div> {/* end card-box*/}
                            </div> {/* end col*/}
                        </div>
                        {/* end row*/}

                    </div> {/* container */}
                </div>
            </div>
            <style>
                {`
                    body, #wrapper {
                        height: 100%;
                        margin: 0;
                    }

                    #wrapper {
                        display: flex;
                        flex-direction: column;
                    }

                    .content-page {
                        flex: 1;
                        width: 85%;
                        text-align: left;
                    }

                    .grid-container {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        grid-gap: 10px;
                    }
                    
                    .grid-item {
                        margin-bottom: 15px;
                    }
                    
                    /* Adjustments for small screens */
                    @media (max-width: 768px) {
                        .grid-container {
                            grid-template-columns: 1fr;
                        }
                    }
                    .page-item.active .page-link{
                        background-color: #20c997;
                        border-color: #20c997;
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

export default EditCourse;
