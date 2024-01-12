import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header id="header" className="fixed-top">
            <div className="container d-flex align-items-center">
                <h1 className="logo">
                    <Link to="/home">MeowLish</Link>
                </h1>
                <div className="search-box ms-auto">
                    <div className="input-group">
                        <input type="text" placeholder="Search for anything" className="form-control" style={{ width: '400px' }} />
                        <button type="button" className="btn btn-primary" style={{ backgroundColor: '#f58d04' }}>
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <nav id="navbar" className="navbar order-last order-lg-0">
                    <ul>
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <li>
                            <a href="about.html">About</a>
                        </li>
                        <li className="dropdown">
                            <a href="#">
                                <span>Course</span> <i className="bi bi-chevron-down" />
                            </a>
                            <ul>
                                <li>
                                    <a href="#">Ielts</a>
                                </li>
                                <li className="dropdown">
                                    <a href="#">
                                        <span>Deep Drop Down</span> <i className="bi bi-chevron-right" />
                                    </a>
                                    <ul>
                                        <li>
                                            <a href="#">Ielts</a>
                                        </li>
                                        <li>
                                            <a href="#">Toffo</a>
                                        </li>
                                        <li>
                                            <a href="#">Toeic</a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a href="#">Toeic</a>
                                </li>
                                <li>
                                    <a href="#">PTE</a>
                                </li>
                                <li>
                                    <Link to="/list-course">List Courses</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="contact.html">Contact</a>
                        </li>
                        <li>
                            <Link to="/login">Log in</Link>
                        </li>
                    </ul>
                    <i className="bi bi-list mobile-nav-toggle" />
                </nav>
                <Link to="/register" className="get-started-btn">
                    Join for Free
                </Link>
            </div>
        </header>
    );
};

export default Header;
