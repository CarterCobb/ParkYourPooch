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
  Select,
} from "antd";
import Room from "../api/rooms";
import Pooch from "../api/pooch";
import { connect } from "react-redux";
import { setUser } from "../redux/userActions";

const Bookings = ({ user, dispatch }) => {
  const [rooms, setRooms] = useState([]);
  const [pooches, setPooches] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      Room.getAll((rms, err) => {
        if (err) message.error(err.error);
        else {
          setRooms(rms);
          setPooches([]);
          var pooch_ids = [];
          rms.forEach(
            (room) =>
              (pooch_ids = [...pooch_ids, ...room.bookings.map((x) => x.pooch)])
          );

          setPooches([]);
          if (typeof rms === "array") getPooches().then(setPooches);
          async function getPooches() {
            const pchs = [];
            await Promise.all(
              user.pooches.map(async (pooch) => {
                const pch = await Pooch.getPoochById(pooch);
                pchs.push(pch);
              })
            );
            return pchs;
          }
        }
        setLoading(false);
      });
    }
    return () => (mounted = false);
  }, [user]);

  console.log(pooches, rooms);

  const toggleModal = () => setOpenModal(!openModal);

  const createRoom = (values) => {
    setLoading(true);
    Room.createRoom({ number: values.number, bookings: [] }, (err) => {
      if (!err) {
        Room.getAll((rms, err2) => {
          if (!err2) {
            setRooms(rms);
            setOpenModal(false);
          } else message.error(err2.error);
        });
      } else message.error(err.error);
      setLoading(false);
    });
  };

  return (
    <Fragment>
      <PageHeader
        className="site-page-header"
        backIcon={null}
        title="Rooms"
        extra={[
          <Button key="1" shape="round" onClick={toggleModal}>
            + New Room
          </Button>,
        ]}
      />
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={rooms}
        renderItem={(item) => (
          <List.Item
            key={item._id}
            actions={[
              <Button type="link" key="1">
                Bookings
              </Button>,
              <Button type="link" key="2">
                Edit
              </Button>,
              <Button danger type="link" key="3">
                Delete
              </Button>,
            ]}
            className="list-card"
          >
            <Skeleton title={false} loading={loading} active>
              <List.Item.Meta
                title={`Number - ${item.number}`}
                description={`${item.bookings.length} Bookings`}
              />
            </Skeleton>
          </List.Item>
        )}
      />
      <Modal
        title="New Room"
        visible={openModal}
        onCancel={toggleModal}
        footer={null}
      >
        <Form onFinish={createRoom}>
          <Form.Item
            name="number"
            rules={[{ required: true, message: "Please set a room number" }]}
          >
            <Input placeholder="Room Number" />
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
              Create
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
export default connect(mapStateToProps)(Bookings);
