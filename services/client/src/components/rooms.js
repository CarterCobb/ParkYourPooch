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
  Table,
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
  const [editRoom, setEditRoom] = useState(null);
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      Room.getAll((rms, err) => {
        if (err) message.error(err.error);
        else {
          setRooms(rms);
          var pooch_ids = [];
          rms.forEach(
            (room) =>
              (pooch_ids = [...pooch_ids, ...room.bookings.map((x) => x.pooch)])
          );
          Pooch.getAllPooches((pchs, err) => {
            if (!err) setPooches(pchs);
            else message.error(err.error);
          });
        }
        setLoading(false);
      });
    }
    return () => (mounted = false);
  }, [user]);

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

  const updateRoom = (values) => {
    setLoading(true);
    Room.updateRoomById(editRoom._id, values, (user, err) => {
      if (!err) {
        dispatch(setUser(user));
        setLoading(false);
        setEditRoom(null);
        message.success("Saved");
      } else {
        setLoading(false);
        message.error(err.error);
      }
    });
  };

  const deleteRoom = (room) => {
    setLoading(true);
    Room.deleteRoomById(room, (user, err) => {
      if (!err) {
        dispatch(setUser(user));
        setLoading(false);
        message.success("Deleted");
      } else {
        setLoading(false);
        message.error(err.error);
      }
    });
  };

  const columns = [
    {
      title: "Pooch",
      dataIndex: "pooch",
      key: "pooch",
      render: (text) => <span style={{ color: "#1890ff" }}>{text}</span>,
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
    },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
    },
  ];

  const data =
    bookings &&
    bookings.books.map((booking) => {
      const pooch = pooches.find((x) => x._id === booking.pooch) || {};
      return {
        key: bookings.number,
        pooch: pooch.name || "Pooch",
        from: new Date(booking.time[0]).toDateString(),
        to: new Date(booking.time[1]).toDateString(),
        days: Math.round(
          Math.abs(
            (new Date(booking.time[0]) - new Date(booking.time[1])) / 86400000
          )
        ),
      };
    });

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
              <Button
                type="link"
                key="1"
                onClick={() =>
                  item.bookings.length > 0
                    ? setBookings({
                        number: item.number,
                        books: item.bookings,
                      })
                    : message.warning("Room has no bookings")
                }
              >
                Bookings
              </Button>,
              <Button
                type="link"
                key="2"
                onClick={() => setEditRoom({ ...item })}
              >
                Edit
              </Button>,
              <Button
                danger
                type="link"
                key="3"
                onClick={() => deleteRoom(item._id)}
              >
                Delete
              </Button>,
            ]}
            className="list-card"
          >
            <Skeleton title={false} loading={loading} active>
              <List.Item.Meta
                title={`Number - ${item.number}`}
                description={`${item.bookings.length} Booking${
                  item.bookings.length === 1 ? "" : "s"
                }`}
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
      <Modal
        title="Update Room"
        visible={editRoom !== null}
        onCancel={() => setEditRoom(null)}
        footer={null}
      >
        <Form onFinish={updateRoom}>
          <Form.Item
            name="number"
            rules={[{ required: true, message: "Please set a room number" }]}
            initialValue={editRoom && editRoom.number}
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
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={bookings && `Room ${bookings.number} Bookings`}
        visible={bookings !== null}
        onCancel={() => setBookings(null)}
        footer={null}
        style={{ minWidth: "70%" }}
      >
        <Table columns={columns} dataSource={data} />
      </Modal>
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};
export default connect(mapStateToProps)(Bookings);
