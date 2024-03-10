import React from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'

const MyTimeable = () => {
    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <div className="page-title-right">
                                            <ol className="breadcrumb m-0">
                                                <li className="breadcrumb-item"><a href="javascript: void(0);">UBold</a></li>
                                                <li className="breadcrumb-item"><a href="javascript: void(0);">Apps</a></li>
                                                <li className="breadcrumb-item active">Calendar</li>
                                            </ol>
                                        </div>
                                        <h4 className="page-title">Calendar</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <button className="btn btn-lg font-16 btn-primary btn-block" id="btn-new-event"><i className="mdi mdi-plus-circle-outline" /> Create New Event</button>
                                                    <div id="external-events" className="m-t-20">
                                                        <br />
                                                        <p className="text-muted">Drag and drop your event or click in the calendar</p>
                                                        <div className="external-event bg-success" data-class="bg-success">
                                                            <i className="mdi mdi-checkbox-blank-circle mr-2 vertical-middle" />New Theme Release
                                                        </div>
                                                        <div className="external-event bg-info" data-class="bg-info">
                                                            <i className="mdi mdi-checkbox-blank-circle mr-2 vertical-middle" />My Event
                                                        </div>
                                                        <div className="external-event bg-warning" data-class="bg-warning">
                                                            <i className="mdi mdi-checkbox-blank-circle mr-2 vertical-middle" />Meet manager
                                                        </div>
                                                        <div className="external-event bg-danger" data-class="bg-danger">
                                                            <i className="mdi mdi-checkbox-blank-circle mr-2 vertical-middle" />Create New theme
                                                        </div>
                                                    </div>
                                                    <div className="mt-5 d-none d-xl-block">
                                                        <h5 className="text-center">How It Works ?</h5>
                                                        <ul className="pl-3">
                                                            <li className="text-muted mb-3">
                                                                It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                                            </li>
                                                            <li className="text-muted mb-3">
                                                                Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.
                                                            </li>
                                                            <li className="text-muted mb-3">
                                                                It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div> {/* end col*/}
                                                <div className="col-lg-9">
                                                    <div id="calendar" />
                                                </div> {/* end col */}
                                            </div>  {/* end row */}
                                        </div> {/* end card body*/}
                                    </div> {/* end card */}
                                    {/* Add New Event MODAL */}
                                    <div className="modal fade" id="event-modal" tabIndex={-1}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header py-3 px-4 border-bottom-0 d-block">
                                                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                                    <h5 className="modal-title" id="modal-title">Event</h5>
                                                </div>
                                                <div className="modal-body p-4">
                                                    <form className="needs-validation" name="event-form" id="form-event" noValidate>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label className="control-label">Event Name</label>
                                                                    <input className="form-control" placeholder="Insert Event Name" type="text" name="title" id="event-title" required />
                                                                    <div className="invalid-feedback">Please provide a valid event name</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label className="control-label">Category</label>
                                                                    <select className="form-control custom-select" name="category" id="event-category" required>
                                                                        <option value="bg-danger" selected>Danger</option>
                                                                        <option value="bg-success">Success</option>
                                                                        <option value="bg-primary">Primary</option>
                                                                        <option value="bg-info">Info</option>
                                                                        <option value="bg-dark">Dark</option>
                                                                        <option value="bg-warning">Warning</option>
                                                                    </select>
                                                                    <div className="invalid-feedback">Please select a valid event category</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            <div className="col-6">
                                                                <button type="button" className="btn btn-danger" id="btn-delete-event">Delete</button>
                                                            </div>
                                                            <div className="col-6 text-right">
                                                                <button type="button" className="btn btn-light mr-1" data-dismiss="modal">Close</button>
                                                                <button type="submit" className="btn btn-success" id="btn-save-event">Save</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div> {/* end modal-content*/}
                                        </div> {/* end modal dialog*/}
                                    </div>
                                    {/* end modal*/}
                                </div>
                                {/* end col-12 */}
                            </div> {/* end row */}
                        </div> {/* container */}
                    </div> {/* content */}
                </div>

            </div>
        </>
    )
}

export default MyTimeable