import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import Footer from '../../Footer';
import moduleService from '../../../../services/module.service';
import lessonService from '../../../../services/lesson.service';
import ReactQuill from 'react-quill';
import Dropzone from 'react-dropzone';
import lessonMaterialService from '../../../../services/material.service';

const CreateClassMaterial = () => {

  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');

  const navigate = useNavigate();
  if (!storedLoginStatus) {
      navigate(`/login`)
  }


  const [lesson, setLesson] = useState({
    name: "",
  });


  const { storedLessonId } = useParams();


  useEffect(() => {
    if (storedLessonId) {
      lessonService
        .getLessonById(storedLessonId)
        .then((res) => {
          setLesson(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedLessonId]);
  //tao material
  const [material, setMaterial] = useState({
    name: '',
    materialUrl: '',
    lessonId: storedLessonId
  });

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



  const handleChange = (e) => {
    const value = e.target.value;
    setMaterial({ ...material, [e.target.name]: value });
  }


  const submitMaterial = async (e) => {
    e.preventDefault();

    try {
      // Save account
      let materialUrl = material.materialUrl; // Keep the existing imageUrl if available

      if (file) {
        // Upload image and get the link
        const materialData = new FormData();
        materialData.append('file', file);
        const materialResponse = await lessonMaterialService.uploadMaterial(materialData);

        // Update the imageUrl with the link obtained from the API
        materialUrl = materialResponse.data;

        // Log the imageUrl after updating
        // console.log("this is url: " + materialUrl);
      }

      const materialData = { ...material, materialUrl }; // Create a new object with updated imageUrl
      // console.log(materialData)

      // Save account
      const materialResponse = await lessonMaterialService.savelessonMaterial(materialData);

      // console.log(JSON.stringify(courseResponse));
      // console.log(courseResponse.data);
      const materialJson = JSON.stringify(materialResponse.data);

      const materialJsonParse = JSON.parse(materialJson);

      // console.log(materialJsonParse)

      // navigate(`/tutor/courses/list-material-by-lesson/${storedLessonId}`);
      navigate(`/tutor/courses/edit-lesson/${storedLessonId}`);


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
                      <h4 className="header-title">ADD MATERIAL FOR LESSON - <span className='text-success'>{lesson.name}</span></h4>
                      <form
                        method="post"
                        className="mt-3"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={(e) => submitMaterial(e)}
                      >
                        <h4 className="header-title">Information</h4>
                        <div className="form-group">
                          <label htmlFor="name">Name * :</label>
                          <input type="text" className="form-control" name="name"
                            id="name" value={material.name} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}
                            required
                          />
                        </div>

                        <label htmlFor="video">File * :</label>
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




                        <div className="card">
                          <div className='card-body'>
                            <div className="form-group mb-0" style={{ marginLeft: '-20px' }}>
                              <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                Create

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

export default CreateClassMaterial;
