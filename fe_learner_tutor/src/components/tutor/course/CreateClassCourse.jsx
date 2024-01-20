import React from 'react'
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { useNavigate, useParams } from 'react-router-dom';

const CreateClassCourse = () => {
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

                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <h1>Create a Class Course</h1>
                                        
                                    </div> {/* end card-box */}
                                </div> {/* end col */}
                            </div>
                            {/* end row */}
                        </div> {/* container */}
                    </div> {/* content */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}
                <Footer />
            </div>


        </>
    )
}

export default CreateClassCourse