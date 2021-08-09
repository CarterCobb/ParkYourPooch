import React, { Component } from "react";
import { Layout, Menu, Button } from "antd";
import User from "../api/user";
import { FaHome, FaBox, FaCog } from "react-icons/fa";
import Rooms from "../components/rooms";
import Orders from "../components/order";
import "../styles/dash.css";
const { Header, Content, Sider } = Layout;

export default class EmployeeDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: <Orders />,
    };
  }

  render() {
    const logout = () => User.logout(() => (window.location.href = "/"));
    const changeContent = ({ key }) => {
      switch (key) {
        case "1":
          return this.setState({ content: <Orders /> });
        case "2":
          return this.setState({ content: <Rooms /> });
        case "3":
          return this.setState({ content: <div>Settings</div> });
        default:
          return this.setState({ content: <Orders /> });
      }
    };
    return (
      <Layout className="layout">
        <Header className="header-bar">
          <div className="logo" />
          <h1>Park Your Pooch</h1>
          <Button
            shape="round"
            size="large"
            type="primary"
            onClick={logout}
            className="header-menu-login"
          >
            Logout
          </Button>
        </Header>
        <Layout>
          <Sider width={220} className="portal-sider">
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ height: "100%", borderRight: 0 }}
              onSelect={changeContent}
            >
              <Menu.Item
                key="1"
                icon={<FaBox size={25} />}
                className="portal-menu-item"
              >
                Orders
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<FaHome size={25} />}
                className="portal-menu-item"
              >
                Rooms
              </Menu.Item>
              <Menu.Item
                key="3"
                icon={<FaCog size={25} />}
                className="portal-menu-item"
              >
                Settings
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content className="portal-main-content">
              {this.state.content}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
