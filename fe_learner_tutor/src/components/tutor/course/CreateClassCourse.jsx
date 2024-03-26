import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Link, useNavigate } from "react-router-dom";
import courseService from '../../../services/course.service';
import categoryService from '../../../services/category.service';
import forumService from '../../../services/forum.service';
import Dropzone from 'react-dropzone';

const CreateClassCourse = () => {


    const tutorId = localStorage.getItem('tutorId');
    const navigate = useNavigate();


    const [course, setCourse] = useState({
        name: "",
        description: "",
        code: "",
        imageUrl: "",
        tutorId: tutorId,
        stockPrice: "",
        isOnlineClass: true,
        categoryId: "",
        tags: "",
    });

    const [forum, setForum] = useState({
        courseId: ""
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


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState("");

    //list category
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        categoryService
            .getAllcategory()
            .then((res) => {
                console.log(res.data);
                setCategoryList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleContinue = (storedCourseId) => {

        navigate(`/tutor/courses/create/create-class-course/create-class-module/${storedCourseId}`)

    };

    const handleChange = (e) => {
        const value = e.target.value;
        setCourse({ ...course, [e.target.name]: value });
    }

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (course.name.trim() === '') {
            errors.name = 'Course Name is required';
            isValid = false;
        }

        if (course.description.trim() === '') {
            errors.description = 'Description is required';
            isValid = false;
        }

        if (course.code.trim() === '') {
            errors.code = 'Code is required';
            isValid = false;
        }

        if (course.tags.trim() === '') {
            errors.tags = 'Tags is required';
            isValid = false;
        }

        if (course.stockPrice.trim() === '') {
            errors.stockPrice = 'Price is required';
            isValid = false;
        } else if (isNaN(course.stockPrice) || +course.stockPrice <= 0) {
            errors.price = 'Price should be a positive number';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    const submitCourse = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Save account
                let imageUrl = course.imageUrl; // Keep the existing imageUrl if available

                if (file) {
                    // Upload image and get the link
                    const imageData = new FormData();
                    imageData.append('file', file);
                    const imageResponse = await courseService.uploadImage(imageData);

                    // Update the imageUrl with the link obtained from the API
                    imageUrl = imageResponse.data;

                    // Log the imageUrl after updating
                    console.log("this is url: " + imageUrl);
                }

                // Save course
                const courseData = { ...course, imageUrl }; // Create a new object with updated imageUrl
                const courseResponse = await courseService.savecourse(courseData);

                // console.log(JSON.stringify(courseResponse));
                // console.log(courseResponse.data);
                const courseJson = JSON.stringify(courseResponse.data);

                const courseJsonParse = JSON.parse(courseJson);

                // navigate(`/tutor/course/list-course-by-tutor/${tutorId}`);
                //create forum with courseId
                const forumData = { ...forum, courseId: courseJsonParse.id };
                await forumService.saveForum(forumData)
                handleContinue(courseJsonParse.id);
            } catch (error) {
                console.log(error);
            }
        }
    };




    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
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
                                    <div className="card">
                                        <div className="card-body">
                                        <h4 className="header-title">CREATING A COURSE ...</h4>

                                            {/* Combined Form and Image Upload */}
                                            <form
                                                method="post"
                                                className="mt-3"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                                // onSubmit={handleContinue}
                                                onSubmit={(e) => submitCourse(e)}
                                            >
                                                <label htmlFor="imageUrl">Image * :</label>
                                                <Dropzone
                                                    onDrop={handleFileDrop}
                                                    accept="image/*" multiple={false}
                                                    maxSize={5000000} // Maximum file size (5MB)
                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <div {...getRootProps()} className="fallback">
                                                            <input {...getInputProps()} />
                                                            <div className="dz-message needsclick">
                                                                <i className="h1 text-muted dripicons-cloud-upload" />
                                                                <h3>Drop files here or click to upload.</h3>
                                                            </div>
                                                            {imagePreview && (
                                                                <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }} />
                                                            )}
                                                        </div>
                                                    )}
                                                </Dropzone>

                                                {/* Preview */}
                                                <div className="dropzone-previews mt-3" id="file-previews" />
                                                {/* Your existing form fields */}
                                                <h4 className="header-title mt-4">Information</h4>
                                                <div className="form-group">
                                                    <label htmlFor="name">Course name * :</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="name"
                                                        id="name"
                                                        value={course.name}
                                                        onChange={(e) => handleChange(e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="code">Code * :</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="code"
                                                            id="code"
                                                            value={course.code}
                                                            onChange={(e) => handleChange(e)}
                                                            style={{ width: "100%" }}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="categoryId">Category *:</label>
                                                        <select
                                                            className="form-control"
                                                            id="categoryId"
                                                            name="categoryId"
                                                            value={course.categoryId}
                                                            onChange={handleChange}
                                                            style={{ width: "100%" }}
                                                            required
                                                        >
                                                            <option value="">Select Category</option>
                                                            {categoryList.map((cate) => (
                                                                <option key={cate.id} value={cate.id}>
                                                                    {cate ? cate.name : "Unknown Category"}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="stockPrice">Price * :</label>
                                                        <div className="input-group">
                                                            <input
                                                                type="number"
                                                                id="stockPrice"
                                                                className="form-control"
                                                                name="stockPrice"
                                                                data-parsley-trigger="change"
                                                                value={course.stockPrice}
                                                                onChange={(e) => handleChange(e)}
                                                                style={{ width: "60%" }} // Adjusted width to accommodate "USD"
                                                                required
                                                            />
                                                            <div className="input-group-append">
                                                                <span className="input-group-text">USD</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="tags">Tags * :</label>
                                                        <input
                                                            type="text"
                                                            id="tags"
                                                            className="form-control"
                                                            name="tags"
                                                            data-parsley-trigger="change"
                                                            value={course.tags}
                                                            onChange={(e) => handleChange(e)}
                                                            style={{ width: "100%" }}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="description">Description * :</label>
                                                    <textarea
                                                        id="description"
                                                        className="form-control"
                                                        name="description"
                                                        data-parsley-trigger="keyup"
                                                        data-parsley-minlength={20}
                                                        data-parsley-maxlength={100}
                                                        data-parsley-minlength-message="Come on! You need to enter at least a 20 character comment.."
                                                        data-parsley-validation-threshold={10}
                                                        defaultValue={''}
                                                        value={course.description} onChange={(e) => handleChange(e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group mb-0">
                                                    <button type="submit" className="btn btn-success">
                                                        Continue
                                                    </button>
                                                </div>
                                            </form>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}
            </div>

            <style>
                {`
                body, #wrapper {
                    height: 85%;
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
            `}
            </style>
        </>
    );
};

export default CreateClassCourse;
