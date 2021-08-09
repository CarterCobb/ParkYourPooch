import React, { useState, Fragment } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import User from "../api/user";

const Login = ({ size, className }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = () => setOpen(!open);

  const login = (values) => {
    setLoading(true);
    const emailVal = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    User.login(
      {
        [emailVal.test(values.email) ? "email" : "name"]: values.email,
        password: values.password,
      },
      (err) => {
        if (err) {
          console.log(err)
          message.error(err.error);
          setLoading(false);
        } else
          emailVal.test(values.email)
            ? (window.location.href = "/customer/dash")
            : (window.location.href = "/employee/dash");
      }
    );
  };

  return (
    <Fragment>
      <Button
        type="primary"
        shape="round"
        size={size}
        className={className}
        onClick={toggle}
      >
        Login
      </Button>
      <Modal
        title="Login"
        visible={open}
        onCancel={toggle}
        width={400}
        footer={null}
      >
        <Form onFinish={login}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email." }]}
            validateTrigger="onSubmit"
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
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
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Login;
