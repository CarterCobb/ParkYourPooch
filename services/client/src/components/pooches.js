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
  const [editPooch, setEditPooch] = useState(null);

  useEffect(() => {
    setPooches([]);
    getPooches().then(setPooches);
    async function getPooches() {
      const pchs = [];
      await Promise.all(
        store_user.pooches.map(async (pooch) => {
          const pch = await Pooch.getPoochById(pooch);
          pchs.push(pch);
        })
      );
      return pchs;
    }
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

  const updatePooch = (values) => {
    setLoading(true);
    Pooch.updatePoochById(editPooch._id, values, (user, err) => {
      if (!err) {
        dispatch(setUser(user));
        setLoading(false);
        setEditPooch(null);
        message.success("Saved");
      } else {
        setLoading(false);
        message.error(err.error);
      }
    });
  };

  const deletePooch = (pooch) => {
    setLoading(true);
    Pooch.deletePoochById(pooch, (user, err) => {
      if (!err) {
        dispatch(setUser(user));
        setLoading(false);
        setOpenModal(false);
        message.success("Deleted");
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
              <Button
                type="link"
                key={`${item}-1`}
                onClick={() => setEditPooch({ ...item })}
              >
                Edit
              </Button>,
              <Button
                danger
                type="link"
                key={`${item}-2`}
                onClick={() => deletePooch(item._id)}
              >
                Delete
              </Button>,
            ]}
            className="list-card"
          >
            <Skeleton title={false} loading={loading} active>
              <List.Item.Meta title={item.name} description={item.notes} />
              <span>
                Age: {item.age}
                {item.age === 1 ? " year" : " years"} old
              </span>
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
          <Form.Item
            name="age"
            rules={[
              { required: true, message: "Please input your pooch's age." },
            ]}
            validateTrigger="onSubmit"
          >
            <Input placeholder="Age" />
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
      <Modal
        title="Update Your Pooch"
        visible={editPooch !== null}
        onCancel={() => setEditPooch(null)}
        footer={null}
      >
        <Form onFinish={updatePooch}>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please input your pooch's name." },
            ]}
            validateTrigger="onSubmit"
            initialValue={editPooch && editPooch.name}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="age"
            rules={[
              { required: true, message: "Please input your pooch's age." },
            ]}
            validateTrigger="onSubmit"
            initialValue={editPooch && editPooch.age}
          >
            <Input placeholder="Age" />
          </Form.Item>
          <Form.Item name="notes" initialValue={editPooch && editPooch.notes}>
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
              Save
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
