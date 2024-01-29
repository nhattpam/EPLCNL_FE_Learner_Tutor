import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import lessonService from '../../../../services/lesson.service';
import ReactQuill from 'react-quill';
import Dropzone from 'react-dropzone';

const CreateLesson = () => {
    const tutorId = localStorage.getItem('tutorId');

    const navigate = useNavigate();

    const [module, setModule] = useState({
        name: "",
    });

    const { storedModuleId } = useParams();

    useEffect(() => {
        if (storedModuleId) {
            moduleService
                .getModuleById(storedModuleId)
                .then((res) => {
                    setModule(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedModuleId]);


    //tao lesson
    const [lesson, setLesson] = useState({
        name: "",
        moduleId: storedModuleId,
        videoUrl: "",
        reading: ""
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


    const handleChange = (e) => {
        const value = e.target.value;
        setLesson({ ...lesson, [e.target.name]: value });
    }

    const handleReadingChange = (value) => {
        setLesson({ ...lesson, reading: value });
    };

    const submitLesson = async (e) => {
        e.preventDefault();

        try {
            // Save account
            let videoUrl = lesson.videoUrl; // Keep the existing imageUrl if available

            if (file) {
                // Upload image and get the link
                const videoData = new FormData();
                videoData.append('file', file);
                const videoResponse = await lessonService.uploadVideo(videoData);

                // Update the imageUrl with the link obtained from the API
                videoUrl = videoResponse.data;

                // Log the imageUrl after updating
                console.log("this is url: " + videoUrl);
            }

            console.log(lesson)
            const lessonData = { ...lesson, videoUrl }; // Create a new object with updated imageUrl

            // Save account
            const lessonResponse = await lessonService.savelesson(lessonData);

            // console.log(JSON.stringify(courseResponse));
            // console.log(courseResponse.data);
            const lessonJson = JSON.stringify(lessonResponse.data);

            const lessonJsonParse = JSON.parse(lessonJson);

            console.log(lessonJsonParse)

            navigate(`/tutor/course/list-course-by-tutor/${tutorId}`)


        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    <div className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className='card-body'>
                                            <h4 className="header-title">Create a Video course: {module.course ? module.course.name : 'N/A'} | Module {module.name} </h4>
                                            <form
                                                method="post"
                                                className="dropzone"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                                onSubmit={(e) => submitLesson(e)}
                                            >
                                                <label htmlFor="video">Video * :</label>
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
                                                                <div>
                                                                    {/* Video Preview */}
                                                                    <video controls width="100%" height="200">
                                                                        <source src={imagePreview} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Dropzone>
                                                <div className="dropzone-previews mt-3" id="file-previews" />

                                                <h4 className="header-title mt-4">Information</h4>
                                                <div className="form-group">
                                                    <label htmlFor="name">Lesson name * :</label>
                                                    <input type="text" className="form-control" name="name" id="name" value={lesson.name} onChange={(e) => handleChange(e)} />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="material">Materials * :</label>
                                                    <input type="text" className="form-control" name="material" id="material" />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="reading">Reading * :</label>
                                                    <ReactQuill
                                                        value={lesson.reading}
                                                        onChange={handleReadingChange}
                                                        style={{ height: '300px' }}
                                                    />
                                                </div>


                                                <div className="card">
                                                    <div className='card-body'>
                                                        <div className="form-group mb-0">
                                                            <button type="submit" className="btn btn-primary">
                                                                Continue
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
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
                    width:85%;
                    text-align: left;
                }

                .form-group {
                    margin-bottom: 10px;
                }
            `}
            </style>
        </>
    );
};

export default CreateLesson;
