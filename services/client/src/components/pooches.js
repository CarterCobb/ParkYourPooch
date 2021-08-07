import React, { useEffect, useState, Fragment } from "react";
import {
  message,
  PageHeader,
  List,
  Skeleton,
  Button,
  Modal,
  Form,
  Input,
} from "antd";
import Pooch from "../api/pooch";
import { connect } from "react-redux";
import { setUser } from "../redux/userActions";

const Pooches = ({ user: store_user, dispatch }) => {
  const [pooches, setPooches] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPooches([]);
    for (var pooch of store_user.pooches)
      Pooch.getPoochById(pooch).then(
        (pooch) => pooch && setPooches((s) => [...s, pooch])
      );
  }, [store_user]);

  const toggleModal = () => setOpenModal(!openModal);

  const createPooch = (values) => {
    setLoading(true);
    Pooch.createPooch(values, (user, _pooch, err) => {
      if (!err) {
        dispatch(setUser(user));
        setLoading(false);
        setOpenModal(false);
        message.success("Created");
      } else {
        setLoading(false);
        message.error(err.error);
      }
    });
  };

  return (
    <Fragment>
      <PageHeader
        className="site-page-header"
        backIcon={null}
        title="Pooches"
        extra={[
          <Button shape="round" key="1" onClick={toggleModal}>
            + New Pooch
          </Button>,
        ]}
      />
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={pooches}
        renderItem={(item) => (
          <List.Item
            key={item._id}
            actions={[
              <Button type="link" key="1">
                Edit
              </Button>,
              <Button danger type="link" key="2">
                Delete
              </Button>,
            ]}
            className="pooch-card"
          >
            <Skeleton title={false} loading={loading} active>
              <List.Item.Meta title={item.name} description={item.notes} />
            </Skeleton>
          </List.Item>
        )}
      />
      <Modal
        title="Add Your Pooch"
        visible={openModal}
        onCancel={toggleModal}
        footer={null}
      >
        <Form onFinish={createPooch}>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please input your pooch's name." },
            ]}
            validateTrigger="onSubmit"
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="notes">
            <Input placeholder="Notes" />
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
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};
export default connect(mapStateToProps)(Pooches);
