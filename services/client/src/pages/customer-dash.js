import React, { Component } from "react";
import { Layout, Menu, Button } from "antd";
import User from "../api/user";
import { FaDog, FaBook, FaCog } from "react-icons/fa";
import "../styles/dash.css";
import Bookings from "../components/bookings";
import Pooches from "../components/pooches";
import Settings from "../components/cust-settings";
import { connect } from "react-redux";
const { Header, Content, Sider } = Layout;

class CustomerDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: <Bookings user={this.props.user} />,
    };
  }

  render() {
    const logout = () => User.logout(() => (window.location.href = "/"));
    const changeContent = ({ key }) => {
      switch (key) {
        case "1":
          return this.setState({
            content: <Bookings />,
          });
        case "2":
          return this.setState({ content: <Pooches /> });
        case "3":
          return this.setState({ content: <Settings /> });
        default:
          return this.setState({
            content: <Bookings />,
          });
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
                icon={<FaBook size={25} />}
                className="portal-menu-item"
              >
                Bookings
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<FaDog size={25} />}
                className="portal-menu-item"
              >
                Pooches
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

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};
export default connect(mapStateToProps)(CustomerDash);
