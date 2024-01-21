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
                        <input type="text" placeholder="Search for anything" className="form-control" style={{ width: '200px' }} />
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
                                    <a href="#">A1 - BEGINNER</a>
                                </li>
                                  <li>
                                    <a href="#">A2 - ELEMENTARY</a>
                                </li>
                                <li>
                                    <a href="#">B1 - INTERMEDIATE</a>
                                </li>
                                <li>
                                    <a href="#">B2 - UPPER INTERMEDIATE</a>
                                </li>
                                <li>
                                    <a href="#">C1 - ADVANCED</a>
                                </li>
                                <li>
                                    <a href="#">C2 - PROFICIENT</a>
                                </li>
                                <li>
                                    <Link to="/list-course">LIST COURSE</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to="/business-register">MeowLish Business</Link>
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
