import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {

    const tutorId = localStorage.getItem('tutorId');


    return (
        <>
            {/* ========== Left Sidebar Start ========== */}
            <div className="left-side-menu">
                <div className="h-100" data-simplebar>
                    {/* User box */}
                    <div className="user-box text-center">
                        <img src="../assets/images/users/user-1.jpg" alt="user-img" title="Mat Helme" className="rounded-circle avatar-md" />
                        <div className="dropdown">
                            <a href="javascript: void(0);" className="text-dark dropdown-toggle h5 mt-2 mb-1 d-block" data-toggle="dropdown">Geneva Kennedy</a>
                            <div className="dropdown-menu user-pro-dropdown">
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-user mr-1" />
                                    <span>My Account</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-settings mr-1" />
                                    <span>Settings</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-lock mr-1" />
                                    <span>Lock Screen</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-log-out mr-1" />
                                    <span>Logout</span>
                                </a>
                            </div>
                        </div>
                        <p className="text-muted">Admin Head</p>
                    </div>
                    {/*- Sidemenu */}
                    <div id="sidebar-menu">
                        <ul id="side-menu">
                            <li>
                                <Link to={"/tutor-dashboard"} data-toggle="collapse">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>
                                    <span> Dashboards </span>
                                </Link>

                            </li>

                            <li>
                                <a href="#sidebarEcommercess" data-toggle="collapse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-folder-plus"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                                    <span> Courses </span>
                                    <span className="menu-arrow" />
                                </a>
                                <div className="collapse" id="sidebarEcommercess">
                                    <ul className="nav-second-level">
                                        <li>
                                            <Link to={`/tutor/courses/list-video-course/${tutorId}`}>Video course</Link>
                                        </li>
                                        <li>
                                            <Link to={`/tutor/courses/list-class-course/${tutorId}`}>Class course</Link>
                                        </li>
                                        <li>
                                            <Link to={`/tutor/course/list-course-by-tutor/${tutorId}`}>All courses</Link>
                                        </li>

                                    </ul>
                                </div>
                            </li>
                            <li>
                                <Link to={`/list-forum/${tutorId}`} data-toggle="collapse">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    <span> Communication </span>
                                    <span className="menu-arrow" />
                                </Link>
                                
                            </li>
                            <li>
                                <a href="#sidebarEcommerce" data-toggle="collapse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                    <span> Performance </span>
                                    <span className="menu-arrow" />
                                </a>
                                <div className="collapse" id="sidebarEcommerce">
                                    <ul className="nav-second-level">
                                        <li>
                                            <Link to={`/list-assignment-attempt/${tutorId}`}>Assignment</Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <Link to={`/my-timetable/${tutorId}`} data-toggle="collapse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    <span> Timetable </span>
                                    <span className="menu-arrow" />
                                </Link>
                                
                            </li>

                        </ul>
                    </div>
                    {/* End Sidebar */}
                    <div className="clearfix" />
                </div>
                {/* Sidebar -left */}
            </div>
            {/* Left Sidebar End */}
            <style>
                {`
                    .left-side-menu {
                        flex: 0;
                        width: 100%;
                        text-align: left;
                    }
                `}
            </style>
        </>
    )
}

export default Sidebar