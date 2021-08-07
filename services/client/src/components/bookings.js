import React, { useEffect, useState, Fragment } from "react";
import { message, PageHeader, List, Skeleton, Button, Modal } from "antd";
import Room from "../api/rooms";
import { connect } from "react-redux";

const Bookings = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      Room.getAll((rooms, err) => {
        if (err) message.error(err.error);
        else setRooms(rooms);
        setLoading(false);
      });
    }
    return () => (mounted = false);
  }, []);

  const toggleModal = () => setOpenModal(!openModal);

  return (
    <Fragment>
      <PageHeader
        className="site-page-header"
        backIcon={null}
        title="Bookings"
        extra={[
          <Button
            key="1"
            shape="round"
            onClick={() => {
              if (user.pooches.length > 0) toggleModal();
              else
                message.warning(
                  "Please create a pooch before you book a room."
                );
            }}
          >
            + New Booking
          </Button>,
        ]}
      />
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={
          user.role === "CUSTOMER"
            ? customerBookings
            : rooms.filter((x) => x.bookings.length > 0)
        }
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
          >
            <Skeleton title={false} loading={loading} active>
              <List.Item.Meta title={JSON.stringify(item)} description="" />
              <div>content</div>
            </Skeleton>
          </List.Item>
        )}
      />
      <Modal
        title="New Booking"
        visible={openModal}
        onCancel={toggleModal}
      ></Modal>
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};
export default connect(mapStateToProps)(Bookings);
