import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// Utils
import logo from "../../assets/images/logo/wcs-pm.png";

// Styles
import "./Header.scss";

const Header = () => {
    const [iconChange, setIcon] = useState('fa fa-bars');
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleLogout = () => {
        localStorage.removeItem('_token');
        localStorage.removeItem('role_type');
        setTimeout(() => {
            navigate('/'); // Use navigate() to redirect
        }, 100)
    }

    const openNav = () => {
        let navbar = document.getElementById('collapsibleNavbar');
        if (navbar.style.display === 'none') {
            navbar.style.display = 'block';
            navbar.classList.add('mobile_nav');
            setIcon('fa fa-times');
        } else {
            navbar.style.display = 'none';
            navbar.classList.remove('mobile_nav');
            setIcon('fa fa-bars');
        }
    }

    return (
        <div className="user-layout-header" style={{ minHeight: '60px' }}>
            <nav id="nav" className={`navbar-bg-dark react navbar fixed-top scrolled navbar-expand-lg`}>
                <div className="container px-0 navcontainer-customewidth">
                    <a className="navbar-brand position-relative">
                        <RouterLink to="/"><img loading="lazy" className="img-fluid"
                            src={logo} alt="WCS-PM" title="WCS-PM"
                            style={{ "maxWidth": "100px" }} /></RouterLink>
                    </a>
                    <div className="mx-3 d-lg-none d-md-none">
                        <button className="navbar-toggler" onClick={openNav}><i className={iconChange}></i></button>
                    </div>
                    <div className="collapse navbar-collapse text-start justify-content-end" id="collapsibleNavbar">
                        <div className="navbar-collapse-header"></div>
                        <nav role="navigation" className="nav_menu w-nav-menu ml-auto">
                            <div className="nav_menu-content" id="userLayoutNav">
                                <div className="nav_link-list text-left">
                                    {(localStorage.getItem('role_type') === "admin") ?
                                        <>
                                            <RouterLink to={'/admin/dashboard'} className={"nav_link w-nav-link text-decoration-none"} >Dashboard</RouterLink>
                                            {/* <RouterLink to={'/admin/moneytracker'} className="nav_link w-nav-link text-decoration-none" >Money Tracker</RouterLink> */}
                                            <RouterLink to={'/materials'} className="nav_link w-nav-link text-decoration-none" >Materials</RouterLink>
                                            <RouterLink to={'/admin/project-manager-list'} className="nav_link w-nav-link text-decoration-none user-type" >
                                                Users
                                                <ul>
                                                    <RouterLink to={'/admin/project-manager-list'}><li>Project Manager</li></RouterLink>
                                                    {/* <RouterLink to={'/admin/user-list'}><li>User</li></RouterLink> */}
                                                    {/* <RouterLink to={'/admin/lenders-list'}><li>Lender</li></RouterLink> */}
                                                </ul>
                                            </RouterLink>
                                            <RouterLink to={'/'} className="nav_link w-nav-link text-decoration-none" >Landing Page CMS</RouterLink>
                                            <RouterLink to={'/profile'} className="nav_link w-nav-link text-decoration-none" >Profile</RouterLink>
                                            <RouterLink to={'#'} className="nav_link w-nav-link text-decoration-none" onClick={handleLogout}>Logout</RouterLink>
                                        </>
                                        :
                                        <>
                                            <RouterLink to={'/projectManager/dashboard'} className="nav_link w-nav-link text-decoration-none" >Dashboard</RouterLink>
                                            <RouterLink to={'/project-list'} className="nav_link w-nav-link text-decoration-none" >Projects</RouterLink>
                                            {/* <RouterLink to={'/my-loans'} className="nav_link w-nav-link text-decoration-none" >My Loans</RouterLink> */}
                                            {/* <RouterLink to={'/property-opportunities'} className="nav_link w-nav-link text-decoration-none" >Investment Opportunities</RouterLink> */}
                                            <RouterLink to={'/profile'} className="nav_link w-nav-link text-decoration-none" >Profile</RouterLink>
                                            <RouterLink to={'#'} className="nav_link w-nav-link text-decoration-none" onClick={handleLogout}>Logout</RouterLink>
                                        </>
                                    }
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header;
