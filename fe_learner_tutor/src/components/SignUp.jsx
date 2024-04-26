import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import accountService from '../services/account.service';
import learnerService from '../services/learner.service';
import tutorService from '../services/tutor.service';
import paperWorkService from '../services/paper-work.service';
import paperWorkTypeService from '../services/paper-work-type.service';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router-dom';

const SignUp = () => {


  const [tutor, setTutor] = useState({
    id: "",
    accountId: "",
    isFreelancer: true,
  });

  const [learner, setLearner] = useState({
    accountId: "",
  });


  const [account, setAccount] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    roleId: "",
  });


  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);



  const handleChange = (e) => {
    const value = e.target.value;
    setAccount({ ...account, [e.target.name]: value });
  }

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (account.fullName.trim() === '') {
      errors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (account.phoneNumber.trim() === '') {
      errors.phoneNumber = 'Phone Number is required';
      isValid = false;
    }

    if (account.password.trim() === '') {
      errors.password = 'Password is required';
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };



  const submitAccount = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Determine user type based on radio button selection
      let roleId = "";
      if (document.getElementById("learner").checked) {
        roleId = "f3db0ef2-7f03-4728-a868-aacbe76891a8";
        account.isActive = true;
      } else if (document.getElementById("tutor").checked) {
        roleId = "1dc7ed61-a13d-4cfc-9e3e-2159f61bad3b";
        account.isActive = false;
      }

      try {
        account.roleId = roleId;
        console.log("this is a cccc: " + JSON.stringify(account))
        // Check if email already exists
        const accountList = await accountService.getAllAccount();
        const emailExists = accountList.data.some(acc => acc.email === account.email);
        if (emailExists) {
          window.alert("Email is already taken, please try another email!");
          console.log("EMAIL is taken")
          return; // Stop further execution
        }
        const res = await accountService.saveAccount(account);
        console.log("Account created:", res.data);

        if (document.getElementById("learner").checked) {
          learner.accountId = res.data.id;
          await learnerService.saveLearner(learner);

          setMsg("Thanks for joining us. Sign In!");
          setShowNotification(true);

          // Reset form fields
          setAccount({
            email: "",
            password: "",
            fullName: "",
            phoneNumber: "",
            roleId: "",
            isActive: ""
          });
          setErrors({}); // Clear any previous errors

          setTimeout(() => {
            setShowNotification(false);
          }, 5000);

        } else if (document.getElementById("tutor").checked) {
          tutor.accountId = res.data.id;
          const tutorRes = await tutorService.saveTutor(tutor);
          setPaperWork(prevState => ({ ...prevState, tutorId: tutorRes.data.id })); // Update tutorId in paperWork
          setTutor(tutorRes.data);

          setShowQualificationModal(true);
        }



      } catch (error) {
        console.error("Error creating account:", error);
        setMsg("Error: Unable to create account.");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    }
  };

  //qualification 
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const openQualificationModal = () => {
    setShowQualificationModal(true);

  };

  const closeQualificationModal = () => {
    setShowQualificationModal(false);
    setMsg("Thanks for joining us. MeowLish will contact you soon!");
    setShowNotification(true);

    // Reset form fields
    setAccount({
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      roleId: "",
      isActive: ""
    });
    setErrors({}); // Clear any previous errors

    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const [paperWork, setPaperWork] = useState({
    paperWorkUrl: "",
    paperWorkTypeId: "",
    tutorId: "",
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


      // Save account
      const paperWorklResponse = await paperWorkService.savePaperWork(paperWorkData);

      // Fetch the updated list of paperwork
      tutorService.getAllPaperWorksByTutor(tutor.id)
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
    tutorService.getAllPaperWorksByTutor(tutor.id)
      .then((res) => {
        setPaperWorkList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }



  const [showTermModal, setShowTermModal] = useState(false);
  const openTermModal = () => {
    setShowTermModal(true);
  };

  const closeWTermModal = () => {
    setShowTermModal(false);
  };



  return (
    <>
      <Header />

      <div className="container my-5">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5">
              <div className="card-body p-4">
                <h5 className="card-title mb-4 fw-bold fs-5">Sign up</h5>
                <form onSubmit={(e) => submitAccount(e)}>
                  <div className="form-floating mb-3">
                    <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''
                      }`}
                      id="fullName" placeholder="Xin chao" value={account.fullName}
                      onChange={(e) => handleChange(e)} name='fullName'
                      style={{ borderRadius: '50px', padding: `8px 25px`, paddingTop: `20px` }} required />
                    <label htmlFor="floatingInput">Full name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="number" className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''
                      }`} id="phoneNumber" placeholder="024545" value={account.phoneNumber}
                      onChange={(e) => handleChange(e)} name='phoneNumber'
                      style={{ borderRadius: '50px', padding: `8px 25px`, paddingTop: `20px` }} required />
                    <label htmlFor="floatingInput">Phone number</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="email" placeholder="name@example.com"
                      value={account.email} onChange={(e) => handleChange(e)} name='email'
                      style={{ borderRadius: '50px', padding: `8px 25px`, paddingTop: `20px` }} required />
                    <label htmlFor="floatingInput">Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''
                      }`} id="password" placeholder="Password" value={account.password}
                      onChange={(e) => handleChange(e)} name='password'
                      style={{ borderRadius: '50px', padding: `8px 25px`, paddingTop: `20px` }} required />
                    <label htmlFor="floatingPassword">Password</label>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="userType" className="form-label">You are:</label>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="userType" id="learner" value="learner" />
                      <label className="form-check-label" htmlFor="learner">
                        <div className="circle"></div> Learner
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="userType" id="tutor" value="tutor" />
                      <label className="form-check-label" htmlFor="tutor">
                        <div className="circle"></div> Tutor
                      </label>
                    </div>
                    <div className="form-check mt-4 form-check-inline">
                      <label className=" ">
                        <input type="checkbox" name="checkbox" />
                        <span className="checkmark" />
                        <div style={{ display: 'inline-block', marginLeft: '5px' }}>
                          <p>
                            I agree to the <a onClick={openTermModal} className="text" style={{ color: '#f58d04', textDecoration: 'underline' }}>Terms and Conditions</a>
                          </p>
                        </div>


                      </label>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit" style={{ backgroundColor: '#f58d04', border: '5px solid #f58d04', borderRadius: '20px', }}>
                      Sign up
                    </button>
                  </div>
                </form>
                {
                  showTermModal && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                      <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Terms and Conditions</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeWTermModal}>
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            {/* Conditional rendering based on edit mode */}

                            <p>Welcome to MeowLish!</p>

                            <p>These terms and conditions outline the rules and regulations for the use of MeowLish's Website, located at meowlish.com.</p>

                            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use MeowLish if you do not agree to take all of the terms and conditions stated on this page.</p>

                            <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

                            <p>You have 7 days from the date of purchase to submit a refund request. Please note, for orders close to the last day of the month, the number of days in which a refund request can be submitted will be calculated from the time of purchase to the last day of the month.</p>


                          </div>
                          <div className="modal-footer">
                            {/* Conditional rendering of buttons based on edit mode */}
                            <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: `8px 25px` }} onClick={closeWTermModal}>Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                {/* Notification */}
                {showNotification && (
                  <div className="notification">
                    <p>{msg}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
                    <h5 className="modal-title">Please upload your qualifications...</h5>
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
                              <td>{paperWork.paperWorkType?.name}</td>
                              <td className='text-truncate' style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Link to={paperWork.paperWorkUrl}>{paperWork.paperWorkUrl}</Link></td>
                              <th scope="row" onClick={() => deletePaperWork(paperWork.id)} ><i class="fas fa-trash text-danger"></i></th>
                            </tr>
                          ))}
                          {
                            paperWorkList.length === 0 && (
                              <p className='text-center'>No qualifications yet.</p>
                            )
                          }

                        </tbody>
                      </table>
                      {/* Input fields for editing */}
                      <div className="form-group">
                        <select
                          className="form-control"
                          id="paperWorkType"
                          name="paperWorkType"
                          value={paperWork.paperWorkTypeId}
                          onChange={(e) => setPaperWork({ ...paperWork, paperWorkTypeId: e.target.value })} // Update paperWorkTypeId when the type is selected
                          style={{ borderRadius: '50px', padding: `8px 25px` }}
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
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: `8px 25px`, backgroundColor: `#f58d04` }} >Upload</button>
                    <button type="button" className="btn btn-dark" onClick={closeQualificationModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </>
      )
      }

      <Footer />
      <style>
        {`
                .notification {
                  background-color: #4caf50; /* Green background color */
                  color: white;
                  text-align: center;
                  padding: 15px;
                  position: fixed;
                  top: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  z-index: 1000;
                  border-radius: 5px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  animation: fadeInOut 2s ease-in-out; /* Add a fade-in/fade-out animation */
                
                  /* Optional: Add hover styles */
                  cursor: pointer;
                  transition: background-color 0.3s;
                }
                
                /* Optional: Add hover styles */
                .notification:hover {
                  background-color: #45a049; /* Darker green on hover */
                }
                
                /* Animation keyframes for fade-in/fade-out */
                @keyframes fadeInOut {
                  0% {
                    opacity: 0;
                  }
                  10% {
                    opacity: 1;
                  }
                  90% {
                    opacity: 1;
                  }
                  100% {
                    opacity: 0;
                  }
                }
            `}
      </style>
    </>
  );
};

export default SignUp;
