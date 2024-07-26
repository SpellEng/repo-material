import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { isAuthenticated, logout } from "../Auth/auth";
import { normalLinksArray, studentLinksArray, tutorLinksArray } from "../../RoleLinks";
import { TiMessages } from "react-icons/ti";
import { IoIosLogOut } from "react-icons/io";
import { MenuIcon } from "lucide-react";

const Navbar = () => {
  const handleLinkClick = () => {
    const navbarCollapse = document.getElementById("navbarSupportedContent");
    if (navbarCollapse.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
        toggle: true
      });
      bsCollapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg mainNavbar container">
      <div className="container-fluid px-0">
        <div className="logo navbar-brand">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="collapse navbar-collapse navLinks" id="navbarSupportedContent">
          <ul className="navbar-nav justify-content-center gap-4">
            {
              isAuthenticated()?.role === 0 ?
                studentLinksArray?.map((item, index) => {
                  return (
                    <li key={index} className="nav-item">
                      <Link to={item?.link} onClick={handleLinkClick}>
                        {item?.title}
                      </Link>
                    </li>
                  )
                })
                :
                isAuthenticated()?.role === 1 ?
                  tutorLinksArray?.map((item, index) => {
                    return (
                      <li key={index} className="nav-item">
                        <Link to={item?.link} onClick={handleLinkClick}>
                          {item?.title}
                        </Link>
                      </li>
                    )
                  })
                  :
                  normalLinksArray?.map((item, index) => {
                    return (
                      <li key={index} className="nav-item">
                        <Link to={item?.link} onClick={handleLinkClick}>
                          {item?.title}
                        </Link>
                      </li>
                    )
                  })
            }
          </ul>
        </div>
        <div className="rightSide">
          {
            !isAuthenticated() ?
              <>
                <div className="mobileRightNav">
                  <li className="nav-item">
                    <Link to="/login" className="btnSign btn-sm" onClick={handleLinkClick}>
                      <i className="fa-solid fa-circle-user"></i><span className="signInText">Sign In</span>
                    </Link>
                  </li>
                </div>
                <div className="desktopRightNav">
                  <div className="signUp">
                    <li className="nav-item">
                      <Link to="/login" className="btnSign btn-sm" onClick={handleLinkClick}>
                        <i className="fa-solid fa-circle-user"></i><span className="signInText">Sign in</span>
                      </Link>
                    </li>
                  </div>
                  <div className="signIn">
                    <li className="nav-item">
                      <Link to="/signup" className="btnBuy btn-sm" onClick={handleLinkClick}>Book a trial</Link>
                    </li>
                  </div>
                </div>
              </>
              :
              <>
                <div className="">
                  <li className="nav-item">
                    <Link to="/chats" className="" onClick={handleLinkClick}>
                      <TiMessages className="fs-3" />
                    </Link>
                  </li>
                </div>
                <div>
                  <li className="nav-item">
                    <a href="/login" onClick={(e) => { handleLinkClick(); logout(e); }} className="">
                      <IoIosLogOut className="fs-2" />
                    </a>
                  </li>
                </div>
              </>
          }
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <MenuIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
