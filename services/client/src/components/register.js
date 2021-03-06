import React, { useState, Fragment } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Customer from "../api/customer";
import User from "../api/user";

const Register = ({ size, className }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = () => setOpen(!open);

  const register = (values) => {
    setLoading(true);
    Customer.register(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        role: "CUSTOMER",
        pooches: [],
      },
      (err) => {
        if (err) {
          setLoading(false);
          message.error(err.error);
        } else
          User.login(
            { email: values.email, password: values.password },
            (err) => {
              if (err) {
                setLoading(false);
                message(err.error);
              } else window.location.href = "/customer/dash";
            }
          );
      }
    );
  };

  return (
    <Fragment>
      <Button shape="round" size={size} className={className} onClick={toggle}>
        Register
      </Button>
      <Modal
        title="Register"
        visible={open}
        onCancel={toggle}
        width={400}
        footer={null}
      >
        <Form onFinish={register}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name." }]}
            validateTrigger="onSubmit"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              type="name"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email." }]}
            validateTrigger="onSubmit"
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              type="email"
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
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            validateTrigger="onSubmit"
            rules={[
              { required: true, message: "Re-type your password." },
              ({ getFieldValue }) => ({
                validator(rule, value) {
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
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Register;
