import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import moment from 'moment'
import Loading from "react-fullscreen-loading";
import './Dashboard.scss'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const hrs = new Date().getHours();
    const [greet, setGreet] = useState('Hello')
    const [isLoading, setIsLoading] = useState(false)
    const [dashboardAnalytics, setDashboardAnalytics] = useState()

    useEffect(() => {
        if (hrs < 12) {
            setGreet('Good Morning')
        } else if (hrs >= 12 && hrs < 17) {
            setGreet('Good Afternoon')
        } else if (hrs >= 17 && hrs <= 24) {
            setGreet('Good Evening')
        }
    }, [])

    const chartOptions = {
        chart: {
            type: 'column'
        },
        title: {
            text: ' Chart'
        },
        xAxis: {
            categories: ['Loans', 'Investments', 'Properties']
        },
        yAxis: {
            title: {
                text: 'Count'
            }
        },
        series: [
            {
                name: 'This Week',
                data: [777, 888, 555]
            },
            {
                name: 'Last Week',
                data: [999, 786, 666]
            }
        ]
    };

    return (
        <>
            <div className='dashboard-mainappication'>
                <div className="px-custome pt-2 pb-4" style={{ "height": "100vh" }}>
                    <div className="row pt-4" >
                        <div className="col-12">
                            <h3 className="gm-john-title">{greet} !</h3>
                        </div>
                    </div>

                    <div className='row '>
                        <div className="col-md-6 pr-lg-1">
                            {/* <div className="card-left-dark">
                                <h3 className="loan-review-title">Loans Overview</h3>
                                <div className="my-2">
                                    <p className="overview-paragraph">
                                        This is the new Digitally Enhanced Accelerated Lending Platform for WCS.
                                    </p>
                                </div>
                                <div>
                                    <hr className="border-bottom-hr" />
                                </div>
                                <div>
                                    <div className="left-side-boxes">
                                        <div className="left-side-boxiteam my-1 mr-0 mr-sm-2">
                                            <div className="my-1">
                                                <h6 className="all-loans-title">Total Loans</h6>
                                            </div>
                                            <div className="my-1">
                                                <span>
                                                    <span className="chart-text-digit">111</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="left-side-boxiteam my-1">
                                            <div className="my-1">
                                                <h6 className="all-loans-title">Funded Property</h6>
                                            </div>
                                            <div className="my-1">
                                                <span>
                                                    <span className="chart-text-digit">222</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="left-side-boxes">
                                        <div className="left-side-boxiteam my-1 mr-0 mr-sm-2">
                                            <div className="my-1">
                                                <h6 className="all-loans-title">Available Property</h6>
                                            </div>
                                            <div className="my-1">
                                                <span>
                                                    <span className="chart-text-digit">333</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="left-side-boxiteam my-1">
                                            <div className="my-1">
                                                <h6 className="all-loans-title">Total Property</h6>
                                            </div>
                                            <div className="my-1">
                                                <span>
                                                    <span className="chart-text-digit">444</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="left-side-boxes">
                                        <div className="left-side-boxiteam my-1 mr-0 mr-sm-2">
                                            <div className="my-1">
                                                <h6 className="all-loans-title">Completed Loans</h6>
                                            </div>
                                            <div className="my-1">
                                                <span>
                                                    <span className="chart-text-digit">555</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="left-side-boxiteam my-1">
                                            <div className="my-1">
                                                <h6 className="all-loans-title">Interest Earned</h6>
                                            </div>
                                            <div className="my-1">
                                                <span>
                                                    <span className="chart-text-digit">666</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="card-right-oneintwowrap align-items-center pt-2">
                                <div className="card-right-one">
                                    <div>
                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <h3 className="proerties-title">This Week 15/7/25 to 22/7/25</h3>
                                        </div>
                                        <div>
                                            <hr className="bashboard-rightbbottom" />
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6 text-start border-right-one">
                                                <div className="boxnumber-contentiteam">
                                                    <div>
                                                        <h3 className="number-box-title">777</h3>
                                                        <p className="boxes-body-text">Total Loans</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 text-start">
                                                <div className="boxnumber-contentiteam">
                                                    <div>
                                                        <h3 className="number-box-title">888</h3>
                                                        <p className="boxes-body-text"> Amount to Invested
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-right-one">
                                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 pl-lg-1">
                            <div className="card-right-oneintwowrap align-items-center pt-2">
                                <div className="card-right-one">
                                    <div>
                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <h3 className="proerties-title">This Week 15/7/25 to 22/7/25</h3>
                                        </div>
                                        <div>
                                            <hr className="bashboard-rightbbottom" />
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6 text-start border-right-one">
                                                <div className="boxnumber-contentiteam">
                                                    <div>
                                                        <h3 className="number-box-title">777</h3>
                                                        <p className="boxes-body-text">Total Loans</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 text-start">
                                                <div className="boxnumber-contentiteam">
                                                    <div>
                                                        <h3 className="number-box-title">888</h3>
                                                        <p className="boxes-body-text"> Amount to Invested
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-right-one">
                                    <div>
                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <h3 className="proerties-title">Last Week 7/7/25 to 14/7/25</h3>
                                        </div>
                                        <div>
                                            <hr className="bashboard-rightbbottom" />
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6 text-start border-right-one">
                                                <div className="boxnumber-contentiteam">
                                                    <div>
                                                        <h3 className="number-box-title">999</h3>
                                                        <p className="boxes-body-text">Total Loans </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 text-start">
                                                <div className="boxnumber-contentiteam">
                                                    <div>
                                                        <h3 className="number-box-title">000</h3>
                                                        <p className="boxes-body-text"> Amount to Invested
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-right-one">
                                    <div>
                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <h3 className="proerties-title">All</h3>
                                        </div>
                                        <div>
                                            <hr className="bashboard-rightbbottom" />
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6 text-start border-right-one">
                                                <div className="boxnumber-contentiteam">
                                                    <div>
                                                        <h3 className="number-box-title">101</h3>
                                                        <p className="boxes-body-text"> Total loans </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 text-start">
                                                <div className="boxnumber-contentiteam">
                                                    <div>
                                                        <h3 className="number-box-title">407</h3>
                                                        <p className="boxes-body-text"> Total Invested
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Loading loading={true} loaderColor="#000" />}
        </>
    )
}

export default AdminDashboard