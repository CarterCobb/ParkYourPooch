import React, { Component } from "react";
import { Layout } from "antd";
import Login from "../components/login";
import "../styles/home.css";
const { Header, Content, Footer } = Layout;

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
          <Login size="large" className="header-menu-login" />
        </Header>
        <Content>Home</Content>
        <Footer style={{ textAlign: "center" }}>Carter Cobb ©2021</Footer>
      </Layout>
    );
  }
}
