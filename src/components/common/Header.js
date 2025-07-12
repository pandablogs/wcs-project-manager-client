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
        const navbar = document.getElementById('collapsibleNavbar');
        const isOpen = navbar.classList.contains('show');

        if (isOpen) {
            navbar.classList.remove('show');
            setIcon('fa fa-bars');
        } else {
            navbar.classList.add('show');
            setIcon('fa fa-times');
        }
    };
    // const openNav = () => {
    //     const navbar = document.getElementById('collapsibleNavbar');
    //     navbar.classList.remove('show');
    //     setIcon('fa fa-bars');
    // }

    return (
        <div className="user-layout-header" style={{ minHeight: '60px' }}>
            <nav id="nav" className={`navbar-bg-dark react navbar fixed-top scrolled navbar-expand-lg`}>
                <div className="container px-0 navcontainer-customewidth">
                    <a className="navbar-brand position-relative">
                        <RouterLink to="/"><img loading="lazy" className="img-fluid"
                            src={logo} alt="WCS-PM" title="WCS-PM"
                            style={{ "maxWidth": "100px" }} /></RouterLink>
                    </a>
                    <div className="mx-3 d-lg-none toogle-btn">
                        <button className="navbar-toggler" onClick={openNav}><i className={iconChange}></i></button>
                    </div>
                    <div className="collapse navbar-collapse text-start justify-content-end" id="collapsibleNavbar">
                        <div className="navbar-collapse-header"></div>
                        <nav role="navigation" className="nav_menu w-nav-menu ml-auto">
                            <div className="nav_menu-content" id="userLayoutNav">
                                <div className="nav_link-list text-left">
                                    {(localStorage.getItem('role_type') === "admin") ?
                                        <>
                                            <RouterLink to={'/admin/dashboard'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Dashboard</RouterLink>
                                            <RouterLink to={'/project-estimater'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Project Cost Estimate</RouterLink>
                                            <RouterLink to={'/project-list'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Project List</RouterLink>
                                            {/* <RouterLink to={'/materials'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Materials</RouterLink> */}
                                            <RouterLink to={'/category'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Category</RouterLink>
                                            <RouterLink to={'/admin/project-manager-list'} className="nav_link w-nav-link text-decoration-none user-type" >
                                                Users
                                                <ul>
                                                    <RouterLink to={'/admin/project-manager-list'}><li>Project Manager</li></RouterLink>
                                                    {/* <RouterLink to={'/admin/user-list'}><li>User</li></RouterLink> */}
                                                    {/* <RouterLink to={'/admin/lenders-list'}><li>Lender</li></RouterLink> */}
                                                </ul>
                                            </RouterLink>
                                            {/* <RouterLink to={'/'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Landing Page CMS</RouterLink> */}
                                            <RouterLink to={'/profile'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Profile</RouterLink>
                                            <RouterLink to={'#'} className="nav_link w-nav-link text-decoration-none" onClick={handleLogout}>Logout</RouterLink>
                                        </>
                                        :
                                        <>
                                            <RouterLink to={'/projectManager/dashboard'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Dashboard</RouterLink>
                                            <RouterLink to={'/project-list'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Projects List</RouterLink>
                                            {/* <RouterLink to={'/my-loans'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >My Loans</RouterLink> */}
                                            {/* <RouterLink to={'/property-opportunities'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Investment Opportunities</RouterLink> */}
                                            <RouterLink to={'/profile'} className="nav_link w-nav-link text-decoration-none" onClick={openNav} >Profile</RouterLink>
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
