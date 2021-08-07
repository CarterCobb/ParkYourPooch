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
  Divider,
  DatePicker,
} from "antd";
import Room from "../api/rooms";
import Pooch from "../api/pooch";
import { connect } from "react-redux";
import { setUser } from "../redux/userActions";
import moment from "moment";
const { RangePicker } = DatePicker;

/**
 * Formats a number to a currency string.
 * @return {String} formatted string
 */
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Bookings = ({ user, dispatch }) => {
  const [rooms, setRooms] = useState([]);
  const [bookingDays, setBookingDays] = useState(0);
  const [pooches, setPooches] = useState([]);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      Room.getAll((rms, err) => {
        if (err) message.error(err.error);
        else {
          setRooms(typeof rms === "array" ? rms : []);
          setCustomerBookings(
            (typeof rms === "array" ? rms : []).filter((x) =>
              x.bookings
                .map((y) => y.pooch)
                .forEach((z) => {
                  return user.pooches.includes(z);
                })
            )
          );
          setPooches([]);
          if (typeof user === "object")
            for (var pooch of user.pooches)
              Pooch.getPoochById(pooch).then(
                (pooch) => pooch && setPooches((s) => [...s, pooch])
              );
        }
        setLoading(false);
      });
    }
    return () => (mounted = false);
  }, [user]);

  console.log(customerBookings, pooches);

  const toggleModal = () => setOpenModal(!openModal);

  const placeOrderForBooking = (values) => {
    console.log(values);
  };

  const onDateChange = (dates) =>
    setBookingDays(dates[1].diff(dates[0], "days"));

  let poochOptions = [];
  pooches.forEach((pooch, i) =>
    poochOptions.push(
      <Select.Option key={i} value={pooch._id}>
        {pooch.name}
      </Select.Option>
    )
  );

  let roomOptions = [];
  rooms.forEach((room, i) =>
    roomOptions.push(
      <Select.Option key={i} value={room._id}>
        {room.number}
      </Select.Option>
    )
  );

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
        footer={null}
      >
        <Form onFinish={placeOrderForBooking}>
          <p style={{ textAlign: "center" }}>
            <strong>Bookings are $25 per day.</strong>
          </p>
          <Divider>Time</Divider>
          <Form.Item
            name="time"
            rules={[
              { required: true, message: "Please select a booking time" },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format="MM/DD/YYYY"
              onChange={onDateChange}
            />
          </Form.Item>
          <Divider>Room</Divider>
          <Form.Item
            name="room"
            dependencies={["time"]}
            rules={[
              { required: true, message: "Please select an open room" },
              ({ getFieldValue }) => ({
                validator(_rule, _value) {
                  if (getFieldValue("time") && bookingDays > 0)
                    return Promise.resolve();
                  return Promise.reject("Booking time must be selected");
                },
              }),
            ]}
          >
            <Select placeholder="Choose Room">{roomOptions}</Select>
          </Form.Item>
          <Divider>Pooch</Divider>
          <Form.Item
            name="pooch"
            rules={[{ required: true, message: "Please select a pooch" }]}
          >
            <Select placeholder="Choose Pooch">{poochOptions}</Select>
          </Form.Item>
          <Divider>Payment</Divider>
          <Form.Item
            name="card_number"
            rules={[
              { required: true, message: "Please input your card number" },
            ]}
          >
            <Input placeholder="Card Number" maxLength={16} minLength={16} />
          </Form.Item>
          <Form.Item
            name="cvv"
            rules={[
              {
                required: true,
                message: "Please input your card secuirty code",
              },
              { len: 3, message: "Must be three characters" },
            ]}
          >
            <Input placeholder="Cvv" maxLength={3} minLength={3} />
          </Form.Item>
          <Form.Item
            name="expires"
            rules={[
              {
                required: true,
                message: "Please input your card expire date",
              },
              { len: 5, message: "Must be five characters" },
            ]}
          >
            <Input placeholder="expires MM/YY" maxLength={5} minLength={5} />
          </Form.Item>
          <Divider>Total</Divider>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              shape="round"
              size="large"
              loading={loading}
            >
              Book {bookingDays} Days - {formatter.format(25 * bookingDays)}
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
