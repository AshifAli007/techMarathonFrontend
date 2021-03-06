import React , {Component} from 'react'
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';
import {connect} from 'react-redux';
import { Avatar, Tooltip } from 'antd';

class Navbar extends Component{
        
  animation = ()=>{
    var tabsNewAnim = $('#navbarSupportedContent');
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
      "top":itemPosNewAnimTop.top + "px", 
      "left":itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    });
    $("#navbarSupportedContent").on("click","li",function(e){
     
      $('#navbarSupportedContent ul li').removeClass("active");
      $(this).addClass('active');
      var activeWidthNewAnimHeight = $(this).innerHeight();
      var activeWidthNewAnimWidth = $(this).innerWidth();
      var itemPosNewAnimTop = $(this).position();
      var itemPosNewAnimLeft = $(this).position();
      $(".hori-selector").css({
        "top":itemPosNewAnimTop.top + "px", 
        "left":itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
      });
    });
  }
    componentDidMount(){  
      // this.animation();
      // $(window).on('resize',()=>{
      //   setTimeout(()=>{ this.animation(); }, 500);
      // });

      $(".navbar-toggler").click(()=>{
        $(".navbar-collapse").slideToggle(300);
        
      });
    }
    
  render(){
      const user = JSON.parse(localStorage.getItem('userId'));
     
      let navItem = this.props.isAuthenticated ?
      
        <ul className="navbar-nav ml-auto">
                
                
        
        <li className="nav-item">
          <NavLink className="nav-link" id="home" to="/events" exact>
          <i class="fa fa-home"></i>Home
          </NavLink>
        </li>
        {user && (user['privileges']==='admin~') &&
        <>
        <li className="nav-item">
          <NavLink className="nav-link" id='add' to="/addEvent" exact>
          <i class="fa fa-calendar"></i>Add Event
          </NavLink> 
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" id='response' to="/responses" exact>
            <i 
            className="fa fa-reply-all">
            </i>Responses
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" id='response' to="/bamboozled/admin" exact>
            <i 
            className="fa fa-reply-all">
            </i>Bamboozled
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" id='request' to="/requests" exact>
          <i class="fa fa-users"></i>Requests
          </NavLink>
        </li>
        </>
        }
        <li className="nav-item">
          <NavLink className="nav-link" id='result' to="/results" exact>
          <i class="fa fa-trophy"></i>Results
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" id='login' to="/logout" exact>
            <i 
            className="fa fa-sign-out">
            </i>Logout
          </NavLink>
        </li>
        <li style={{display: 'flex', alignItems: 'center'}}>
        <Tooltip placement="left" title={user.name}>
          <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor:'pointer' }}> {user.name[0]}</Avatar>
        </Tooltip>
        
        </li>
        
    </ul>
      :
      
        <ul className="navbar-nav ml-auto">

        
        <li className="nav-item">
          <NavLink className="nav-link" id='home' to="/events" exact>
          <i class="fa fa-home"></i>Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" id='login' to="/authentication" exact>
            <i 
            className="fa fa-sign-in">
            </i>Login
          </NavLink>
        </li>
    </ul>
      
      return (
      <nav className="navbar navbar-expand-custom navbar-mainbg">
        
          <NavLink className="navbar-brand navbar-logo logo" id='logo' to="/events" exact>
            Techmarathon
          </NavLink>
        
        
          <button 
            className="navbar-toggler"
            
            type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <i className="fa fa-bars text-white"></i>
          </button>
    
          <div 
            className="collapse navbar-collapse" id="navbarSupportedContent">
            {navItem}
          </div>
      </nav>
      )

      }
}

const mapStateToProps = (state) =>{
  return {
      isAuthenticated: state.auth.token !== null
  }
}

export default connect(mapStateToProps)(Navbar);