import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
 import Header from './Header';
import Footer from './Footer';
import authenticationService from '../services/authentication.service';
import accountService from '../services/account.service';
import tutorService from '../services/tutor.service';
import accountForumService from '../services/account-forum.service';
import assignmentAttemptService from '../services/assignment-attempt.service';
import assignmentService from '../services/assignment.service';
import categoryService from '../services/category.service';


const SignIn = ({ setIsLoggedIn }) => {

    //login and set jwt token
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setBearerToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);



    //get tutorId by accountId
    const tutorsResponse = tutorService.getAllTutor();


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const showErrorMessage = (message) => {
        setError(message);
        setShowNotification(true);

        // Hide the notification after 5 seconds
        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };

    // Use useEffect to update the state after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(false);
        }, 5000);

        // Clear the timer on component unmount or when the notification is closed manually
        return () => clearTimeout(timer);
    }, [showNotification]);

 
const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await authenticationService.loginUser(email, password);
        if (response.data.success) {
            const decodedToken = JSON.parse(atob(response.data.data.split('.')[1])); // Decoding the JWT token

            console.log('this is role: ' + decodedToken.role);
            if (decodedToken.role.toString() === "f3db0ef2-7f03-4728-a868-aacbe76891a8") {
                console.log("learner")
                // setIsLoggedIn(true);

                // Store the JWT token in localStorage
                localStorage.setItem('token', response.data.data);
                // Pass the token to the module
                console.log('this is token: ' + response.data.data);

                localStorage.setItem('accountId', decodedToken.Id);

                //get learner by accountId
                const respnse = await accountService.getLearnerByAccountId(decodedToken.Id);

                localStorage.setItem('learnerId', respnse.data.id);

                const storedLearnerId = localStorage.getItem('learnerId')
                console.log("This is learnerId from localStorage:", storedLearnerId);

                sessionStorage.setItem('isLearner', true);
                sessionStorage.setItem('isTutor', false);

                setIsLoggedIn(true);


                // Navigate to the home page
                navigate('/home');
            }  // Store other necessary information
            if (decodedToken.role === "1dc7ed61-a13d-4cfc-9e3e-2159f61bad3b") {
                console.log("tutor")

                console.log("This is accountId: " + decodedToken.Id.toString())

                console.log((await tutorsResponse).data);

                // Find the center with matching accountId
                const matchedTutor = (await tutorsResponse).data.find(tutor => tutor.account.id === decodedToken.Id);

                if (matchedTutor) {
                    console.log("This is tutorId:", matchedTutor.id);

                    setIsLoggedIn(true);

                    sessionStorage.setItem('isTutor', true);
                    sessionStorage.setItem('isLearner', false);


                    // Access centerId from localStorage
                    localStorage.setItem('tutorId', matchedTutor.id);
                    //luu accountId
                    localStorage.setItem('accountId', decodedToken.Id);
                    const storedTutorId = localStorage.getItem('tutorId');
                    const storedAccountId = localStorage.getItem('accountId');
                    console.log("This is tutorId from localStorage:", storedTutorId);
                    console.log("This is accountId from localStorage:", storedAccountId);
                } else {
                    console.log("No matching center found for the given accountId");
                }


                const storedTutorId = localStorage.getItem('tutorId');
                navigate(`/tutor-dashboard/${storedTutorId}`);

                // setAccount(accountData);
                // Access centerId from localStorage
                // localStorage.setItem('centerId', accountData.center.id);
                // const storedCenterId = localStorage.getItem('centerId');
                // console.log("This is centerId from localStorage:", storedCenterId);
                showErrorMessage('Login failed. Please try again.');

            }
            else{
                setIsLoggedIn(false);

                // setIsLoggedIn(false);
                setError('You are not authorized to access this page.');
                showErrorMessage('You are not authorized to access this page.');
            }
        } else {
            setIsLoggedIn(false);

            // setIsLoggedIn(false);
            setError('Login failed. Please try again.');
            showErrorMessage('Login failed. Please try again.');

        }
    } catch (error) {
        setIsLoggedIn(false);

        console.log('Login failed:', error);
        // setIsLoggedIn(false);
        setError('Login failed. Please try again.');
        showErrorMessage('Login failed. Please try again.');

    }
};

return (
    <>
        <Header />
        <div className="container my-5">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card border-0 shadow rounded-3 my-5">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4 fw-bold fs-5">Log in to your MeowLish account</h5>
                            {showNotification && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email}
                                        onChange={handleEmailChange} />
                                    <label htmlFor="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password}
                                        onChange={handlePasswordChange} required/>
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>

                                <div className="d-grid">
                                    <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit" style={{ backgroundColor: '#f58d04', border: '5px solid #f58d04', borderRadius: '20px', }}>
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Footer />
    </>
);
};

export default SignIn;
