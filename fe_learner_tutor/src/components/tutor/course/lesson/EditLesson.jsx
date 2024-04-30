import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import lessonService from '../../../../services/lesson.service';
import Dropzone from "react-dropzone";

const EditLesson = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const { lessonId } = useParams();

  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  if (!storedLoginStatus) {
    navigate(`/login`)
  }


  const [lesson, setLesson] = useState({
    name: "",
    moduleId: "",
    videoUrl: "",
    reading: "",
    isActive: false
  });

  //LOADING
  const [loading, setLoading] = useState(true); // State to track loading

  //LOADING

  useEffect(() => {
    if (lessonId) {
      lessonService
        .getLessonById(lessonId)
        .then((res) => {
          setLesson(res.data);
          setLoading(false);


        })
        .catch((error) => {
          console.log(error);
          setLoading(false);

        });
    }

  }, [lessonId]);

  useEffect(() => {
    if (lesson.moduleId) {
      moduleService
        .getModuleById(lesson.moduleId)
        .then((res) => {
          setModule(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [lesson.moduleId]);

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


  const [module, setModule] = useState({
    name: "",
  });

  const handleReadingChange = (value) => {
    setLesson({ ...lesson, reading: value });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (lesson.reading.trim() === '') {
      errors.reading = 'Reading is required';
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const submitLesson = async (e) => {
    e.preventDefault();

    try {
      // Save account
      let videoUrl = lesson.videoUrl; // Keep the existing imageUrl if available

      if (file) {
        // Upload image and get the link
        const videoData = new FormData();
        videoData.append("file", file);
        const videoResponse = await lessonService.uploadVideo(videoData);

        // Update the imageUrl with the link obtained from the API
        videoUrl = videoResponse.data;

        // Log the imageUrl after updating
        console.log("this is url: " + videoUrl);
      }

      lesson.isActive = true;
      console.log(lesson);
      const lessonData = { ...lesson, videoUrl }; // Create a new object with updated imageUrl

      // Save account
      const lessonResponse = await lessonService.updateLesson(lesson.id, lessonData);

      // console.log(JSON.stringify(courseResponse));
      // console.log(courseResponse.data);
      const lessonJson = JSON.stringify(lessonResponse.data);

      const lessonJsonParse = JSON.parse(lessonJson);

      console.log(lessonJsonParse);
      window.alert("Update Lesson Successfully!")
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };


  const [materialList, setMaterialList] = useState([]);


  useEffect(() => {
    if (lessonId) {
      lessonService
        .getAllMaterialsByLesson(lessonId)
        .then((res) => {
          setMaterialList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [lessonId]);


  //DEACTIVATE
  const handleDeactivate = async () => {
    lesson.isActive = false;
    // Save account
    const lessonResponse = await lessonService.updateLesson(lesson.id, lesson);

    const lessonJson = JSON.stringify(lessonResponse.data);

    const lessonJsonParse = JSON.parse(lessonJson);

    console.log(lessonJsonParse);
    window.alert("Deactivate Lesson Successfully!")
    window.location.reload();
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
                    <div className="card-body">
                      <h4 className="header-title">EDITING LESSON - <span className='text-success'>{lesson?.name}</span>
                        {lesson.isActive ? (
                          <span className="badge label-table badge-success" style={{ float: 'right' }}>Active</span>
                        ) : (
                          <span className="badge label-table badge-danger" style={{ float: 'right' }}>Inactive</span>
                        )}
                      </h4>

                      {loading && (
                        <div className="loading-overlay">
                          <div className="loading-spinner" />
                        </div>
                      )}
                      <form
                        method="post"
                        className="mt-4"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={submitLesson}>

                        <div className="card" style={{ marginTop: '-20px' }}>
                          {/* <div className='card-body'>
                            <label htmlFor="video">Video Url * :</label>
                            <input type="text" className="form-control" name="videoUrl" id="videoUrl" value={lesson.videoUrl} readOnly />
                          </div> */}

                          <div className='card-body'>
                            <label htmlFor="video">Video Preview:</label>
                            {lesson.videoUrl && (
                              <video controls width="100%" height="300">
                                <source src={lesson.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                          <Dropzone
                            onDrop={handleFileDrop}
                            accept="image/*"
                            multiple={false}
                            maxSize={5000000} // Maximum file size (5MB)
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps()} className="fallback ml-3">
                                <input {...getInputProps()} />
                                <div className="dz-message needsclick">
                                  <i className="h1 text-muted dripicons-cloud-upload" />
                                </div>
                                {imagePreview && (
                                  <div>
                                    {/* Video Preview */}
                                    <video controls width="100%" height="200">
                                      <source
                                        src={imagePreview}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video tag.
                                    </video>
                                  </div>
                                )}
                              </div>
                            )}
                          </Dropzone>
                          <div
                            className="dropzone-previews mt-3"
                            id="file-previews"
                          />

                          <div className='card-body'>
                            <label htmlFor="video">Reading * :</label>
                            <ReactQuill
                              name="reading"
                              value={lesson.reading}
                              onChange={handleReadingChange}
                              modules={{
                                toolbar: [
                                  [{ header: [1, 2, false] }],
                                  ['bold', 'italic', 'underline', 'strike'],
                                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                  [{ 'indent': '-1' }, { 'indent': '+1' }],
                                  [{ 'direction': 'rtl' }],
                                  [{ 'align': [] }],
                                  ['link', 'image', 'video'],
                                  ['code-block'],
                                  [{ 'color': [] }, { 'background': [] }],
                                  ['clean']
                                ]
                              }}
                              theme="snow"
                              style={{ height: '300px', marginBottom: '20px' }}
                            />
                          </div>
                          <div className="form-group mb-0  ">
                            <button type="submit" className="btn btn-success " style={{ marginLeft: '23px', marginTop: '10px', borderRadius: '50px', padding: `8px 25px` }} >
                              Update
                            </button>
                            <button
                              type="button" onClick={handleDeactivate}
                              className="btn btn-danger ml-2"
                              style={{ borderRadius: '50px', padding: `8px 25px`, marginTop: '10px' }}
                            >
                              Deactivate
                            </button>
                            <Link
                              to={`/tutor/courses/edit-module/${lesson.moduleId}`}
                              className="btn btn-black mr-2 mt-2"
                            >
                              <i className="fas fa-long-arrow-alt-left"></i> Back to Module Information
                            </Link>
                          </div>
                        </div>


                      </form>

                      <div className='mt-2'>
                        <h5>Materials of lesson:
                          &nbsp;
                          <Link to={`/tutor/courses/create-lesson-material/${lessonId}`} >
                            <i className="fas fa-plus-circle text-success"></i>
                          </Link>
                        </h5>
                      </div>
                      <div className="table-responsive">
                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                          <thead className="thead-light">
                            <tr>
                              <th data-toggle="true">Material Name</th>
                              {/* <th>Url</th> */}
                              <th data-hide="phone">Created Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              materialList.length > 0 && materialList.map((material) => (
                                <tr key={material.id}>
                                  <td><Link to={material.materialUrl} target="_blank" rel="noopener noreferrer" className='text-success'>{material.name}</Link></td>
                                  {/* <td>{material.materialUrl}</td> */}
                                  <td>{new Date(material.createdDate).toLocaleString('en-US')}</td>
                                  <td>
                                    <Link to={`/tutor/courses/edit-class-material/${material.id}`} className='text-danger'>
                                      <i class="fas fa-trash-alt"></i>
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            }

                          </tbody>

                        </table>

                      </div> {/* end .table-responsive*/}
                      {materialList.length === 0 && (
                        <p className='text-center mt-3'>No materials found.</p>
                      )}
                    </div>



                  </div> {/* end card-box */}

                </div>
              </div>
            </div>
          </div>
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
  );
};

export default EditLesson;
