import React, { useState } from "react";
import Employee from "../api/employee";
import { Form, Input, Button, Card, message } from "antd";
import { setUser } from "../redux/userActions";
import { connect } from "react-redux";
import { LockOutlined } from "@ant-design/icons";
import "../styles/settings.css";

const EmpSettings = ({ user, dispatch }) => {
  const [loading, setLoading] = useState(false);

  const update = (values) => {
    delete values.confirm_pass;
    Employee.updateEmployee(values, (user, err) => {
      if (!err) {
        dispatch(setUser(user));
        message.success("Updated");
      } else message.error(err.error);
      setLoading(false);
    });
  };

  return (
    <div className="settings-card-container ">
      <Card
        title="Name"
        style={{ margin: "20px", minHeight: "300px", minWidth: "350px" }}
      >
        <Form onFinish={update}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name" }]}
            validateTrigger="onSubmit"
            initialValue={user && user.name}
          >
            <Input placeholder="Name" size="large" autoComplete="name" />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              shape="round"
              size="large"
              loading={loading}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        title="Password"
        style={{ margin: "20px", minHeight: "300px", minWidth: "350px" }}
      >
        <Form onFinish={update}>
          <Form.Item
            name="password"
            validateTrigger="onSubmit"
            rules={[{ required: true, message: "Please input your password." }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            name="confirm_pass"
            dependencies={["password"]}
            validateTrigger="onSubmit"
            rules={[
              { required: true, message: "Re-type your password." },
              ({ getFieldValue }) => ({
                validator(_rule, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject("Passwords do not match.");
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Re-enter Password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              shape="round"
              size="large"
              loading={loading}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};
export default connect(mapStateToProps)(EmpSettings);
