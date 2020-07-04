import React from 'react';
import ReactDOM from 'react-dom';
import {Link, NavLink} from 'react-router-dom';

const Header = (props) => {

    return (
         <header className="header">
                <div className="side-menu">
                    <ul>
                    <li><NavLink to={'/'} className="navlink" activeClassName="navlink-active" ><i className="fa fa-home"></i>&ensp;Home</NavLink></li>
                    <li><NavLink to={'/how-it-works'} className="navlink" activeClassName="navlink-active"><i className="fa fa-th-list"></i>&ensp;How-It-Works</NavLink></li>
                    <li><NavLink to={'/about'} className="navlink" activeClassName="navlink-active"><i className="fa fa-info-circle"></i>&ensp;About</NavLink></li>
                    <li><NavLink to={'/addEdit'} className="navlink" activeClassName="navlink-active"><i className="fa fa-plus"></i>&ensp;Add New Event</NavLink></li>
                    <li><NavLink to={'/settings'} className="navlink" activeClassName="navlink-active"><i className="fa fa-cog fa-spin"></i>&ensp;Settings</NavLink>
                    </li>
                    </ul>
                </div>
                <div className="header__inner">
                    <div className="menu-logo-wrapper">
                        <div className="menu-logo-wrapper__logo">
                            <img src="/images/logo.png" alt="logo"/>
                        </div>
                    </div>
                    <div className="add-btn">
                        <Link to="/addEdit">
                        <button>
                            <span className="fa fa-plus-circle"></span>
                        </button>
                        </Link>
                    </div>
                </div>
                <div className="date-plate"> Hey! Welcome!</div>
            </header>
        )
        /* #001c40 */
    }

//Tick Time
function tick(){
    ReactDOM.render(<span><span className="fa fa-calendar-alt"></span> {new Date().toDateString()}&emsp;<span className="fa fa-clock"></span> {new Date().toLocaleTimeString()}</span>, document.querySelector('.date-plate'))
}
setInterval(tick, 1000)

export default Header;
