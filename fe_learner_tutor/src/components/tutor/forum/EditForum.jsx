import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import accountForumService from '../../../services/account-forum.service';
import forumService from '../../../services/forum.service';

const EditForum = () => {
    const { forumId } = useParams();
    const [accountForumList, setAccountForumList] = useState([]);
    const [forum, setForum] = useState([]);
    const tutorId = localStorage.getItem('tutorId');
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        forumService
            .getAllClassForumsByForum(forumId)
            .then((res) => {
                setAccountForumList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [forumId]);

    useEffect(() => {
        if (forumId) {
            forumService
                .getForumById(forumId)
                .then((res) => {
                    setForum(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [forumId]);

    //tao account forum
    const [accountForum, setAccountForum] = useState({
        tutorId: tutorId,
        forumId: forumId, // set a default value for minutes
        message: "",
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setAccountForum({ ...accountForum, [e.target.name]: value });
    }

    const submitAccountForum = async (e) => {
        e.preventDefault();

        // Save account forum
        console.log(JSON.stringify(accountForum))
        const accountForumResponse = await accountForumService.saveAccountForum(accountForum);
        console.log(accountForumResponse.data);

        setMsg('AccountForum Added Successfully');

        // Fetch updated list of messages after sending a message
        forumService
            .getAllClassForumsByForum(forumId)
            .then((res) => {
                setAccountForumList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

        // Clear the message input
        setAccountForum({ ...accountForum, message: '' });
    }


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
                                    <div className="page-title-box">
                                        <div className="page-title-right">
                                            <ol className="breadcrumb m-0">
                                            </ol>
                                        </div>
                                        <h4 className="page-title">FORUM OF COURSE - <span className='text-success'>{forum.course?.name}</span></h4>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <div className="chat-container">
                                            {
                                                accountForumList.length > 0 && accountForumList
                                                    .slice()
                                                    .sort((a, b) => new Date(a.messagedDate) - new Date(b.messagedDate))
                                                    .map((accountForum) => (
                                                        <div
                                                            className={`chat-message ${accountForum.tutor ? 'right' : 'left'}`}
                                                            key={accountForum.id}
                                                        >
                                                            <div className="message-sender">
                                                                <img src={accountForum.tutor?.account?.imageUrl ?? accountForum.learner?.account?.imageUrl}
                                                                    style={{
                                                                        width: '30px',
                                                                        height: '30px',
                                                                        borderRadius: '50%', // Make the image circular
                                                                        objectFit: 'cover' // Ensure the image covers the entire space
                                                                    }}
                                                                    alt="User Avatar"
                                                                />&nbsp;
                                                                {accountForum.tutor?.account?.fullName ?? accountForum.learner?.account?.fullName}
                                                            </div>
                                                            <div className="message-content">{accountForum.message}</div>
                                                            <div className="message-date">{accountForum.messagedDate}</div>
                                                        </div>
                                                    ))
                                            }
                                            {
                                                accountForumList.length === 0 && (
                                                    <p>No messages yet.</p>
                                                )
                                            }

                                            <form class="msger-inputarea" onSubmit={submitAccountForum} style={{backgroundColor: '#fff'}}>
                                                <input
                                                    type="text"
                                                    class="msger-input"
                                                    placeholder="Enter your message..."
                                                    name="message"
                                                    id="message"
                                                    value={accountForum.message}
                                                    onChange={(e) => handleChange(e)} style={{borderRadius: '50px', padding: `8px 25px` }}
                                                />
                                                <button type="submit" class="msger-send-btn" style={{borderRadius: '50px', padding: `8px 25px` }}>
                                                    Send
                                                </button>
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
                    /* Add these styles to your existing CSS file or create a new one */

                    .chat-container {
                      display: flex;
                      flex-direction: column;
                      height: 100%; /* Ensure the chat container takes the full height of its parent */

                    }
                    
                    .chat-message {
                      margin-bottom: 10px;
                      padding: 10px;
                      border-radius: 8px;
                    }

                    .msger-inputarea {
                        display: flex;
                        padding: 10px;
                        border-top: var(--border);
                        background: #eee;
                        position: fixed;
                        bottom: 0;
                        width: 80%;
                        z-index: 1;
                      }
                      
                      .msger-inputarea * {
                        padding: 10px;
                        border: none;
                        border-radius: 3px;
                        font-size: 1em;
                      }
                      
                      .msger-input {
                        flex: 1;
                        background: #ddd;
                      }
                    
                    .left {
                        align-self: flex-start;
                        background-color: #e0e0e0;
                        color: #333;
                      }
                      .right {
                        align-self: flex-end;
                        background-color: #4caf50;
                        color: #fff;
                      }

                      .message-sender {
                        font-weight: bold;
                        margin-bottom: 5px;
                      }
                      
                      .message-content {
                        font-size: 16px;
                        word-break: break-all;
                      }
                      
                      .message-date {
                        font-size: 12px;
                        color: #777;
                        bottom: 5px;
                        right: 5px;
                      }

                      
                      .msger-send-btn {
                        margin-left: 10px;
                        background: rgb(0, 196, 65);
                        color: #fff;
                        font-weight: bold;
                        cursor: pointer;
                        transition: background 0.23s;
                      }
                      .msger-send-btn:hover {
                        background: rgb(0, 180, 50);
                      }
                    
                    /* Adjust the styling according to your design preferences */
                    
                `}
            </style>
        </>
    );
};

export default EditForum;
