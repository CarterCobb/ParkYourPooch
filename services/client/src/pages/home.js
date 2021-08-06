import React, { Component } from "react";
import { Layout } from "antd";
import Login from "../components/login";
import Register from "../components/register";
import Dog from "../videos/dog.mp4";
import "../styles/home.css";
const { Header, Content } = Layout;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout className="layout">
        <Header className="header-bar">
          <div className="logo" />
          <h1>Park Your Pooch</h1>
          <Register size="large" className="header-menu-login" />
          <Login size="large" className="header-menu-login" />
        </Header>
        <Content>
          <div className="home-back" style={{ marginTop: "112px" }}>
            <video className="home-page-video" autoPlay muted loop playsInline>
              <source src={Dog} type="video/mp4" />
            </video>
          </div>
          <div className="home-front">
            <h1 className="main-header">
              <span className="span1">Effortless</span>
              <br />
              <span className="span2">Doggie Daycare</span>
            </h1>
            <div className="container">
              <div className="home-info-bar">
                <div className="info-bar-info">
                  <h1>About</h1>
                  <p>
                    Park Your Pooch was created with the pooch in mind. We
                    strive to provide your furry friend with a peice of paradise
                    whilst you are away. Every pooch finds a place to fit in; we
                    work hard to cater to every need of our guests.
                  </p>
                </div>
                <div className="dogs-img" />
              </div>
              <div className="bar-spacer" />
              <div className="home-info-bar">
                <div className="pool-img" />
                <div className="info-bar-info">
                  <h1>Amenities</h1>
                  <p>
                    We provide each pooch with lods of fun things for them to
                    play with and do. Take a look:
                  </p>
                  <ul>
                    <li>3 acre fenched grass lot</li>
                    <li>
                      Pooch playground; complete with hoops and jumps for the
                      most energetic pups
                    </li>
                    <li>1ft deep pool</li>
                    <li>Mini water park</li>
                    <li>Chillin' lounge - cooled floor area</li>
                    <li>Rooms made to feel like home</li>
                  </ul>
                </div>
              </div>
              <div className="bar-spacer" />
              <div className="home-info-bar">
                <div className="info-bar-info">
                  <h1>Bookings</h1>
                  <p>
                    Bookings are only <span className="price">$25</span> per
                    day. All it takes is to register your pooch and book your
                    dates!
                  </p>
                  <div>
                    <span>
                      <Login size="large" />
                      <span className="login-or-register">OR</span>
                      <Register size="large" />
                    </span>
                  </div>
                </div>
                <div className="room-img" />
              </div>
              <div className="footer">
                <p>© Carter Cobb 2021</p>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}
