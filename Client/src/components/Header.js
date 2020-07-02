import React from 'react';
import ReactDOM from 'react-dom';


const Header = (props) => {

    return (
         <header className="header">
                <div className="side-menu">
                    <ul>
                        <li><i className="fa fa-cog fa-spin"></i>&ensp;Settings</li>
                    <li><i className="fa fa-cog fa-spin"></i>&ensp;Settings</li>
                    <li><i className="fa fa-cog fa-spin"></i>&ensp;Settings</li>
                    <li><i className="fa fa-cog fa-spin"></i>&emsp;Settings</li>
                    </ul>
                </div>
                <div className="header__inner">
                    <div className="menu-logo-wrapper">
                        <div className="menu-logo-wrapper__logo">
                            <img src="/images/logo.png" alt="logo"/>
                        </div>
                    </div>
                    <div className="add-btn">
                        <button>
                            <span className="fa fa-plus-circle"></span>
                        </button>
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
//setInterval(tick, 1000)

export default Header;
