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
import Order from "../api/order";

import { connect } from "react-redux";
import { setUser } from "../redux/userActions";
import moment from "moment";
import User from "../api/user";
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
  const [roomOptions, setRoomOptions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      Room.getAll((rms, err) => {
        if (err) message.error(err.error);
        else {
          setPooches([]);
          if (typeof user === "object") getPooches().then(setPooches);
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
          if (rms.constructor === Array) {
            setRooms(rms);
            setCustomerBookings([]);
            for (var room of rms)
              for (var booking of room.bookings)
                for (var pooch of user.pooches)
                  if (booking.pooch === pooch)
                    setCustomerBookings((s) => [...s, booking]);
          }
        }
        setLoading(false);
      });
    }
    return () => (mounted = false);
  }, [user]);

  const toggleModal = () => setOpenModal(!openModal);

  const placeOrderForBooking = (values) => {
    setLoading(true);
    Order.createOrder(
      {
        name: user.name,
        card_number: values.card_number,
        cvv: values.cvv,
        expires: values.expires,
        total: bookingDays * 25 * 100,
        booking_qty: bookingDays,
      },
      (err) => {
        if (err) message.error(err.error.replace("_", " "));
        else
          Room.addBooking(
            values.room,
            {
              pooch: values.pooch,
              time: [
                values.time[0].toDate().toISOString(),
                values.time[1].toDate().toISOString(),
              ],
            },
            (err2) => {
              if (err2) message.error(err2.error);
              else
                User.getUser((user, err3) => {
                  if (err3) message.error(err3.error);
                  else {
                    dispatch(setUser(user));
                    toggleModal();
                    message.success("Booked");
                    form.resetFields();
                  }
                });
            }
          );
        setLoading(false);
      }
    );
  };
  
  const isValidDateForRoom = (startdate, enddate, startD, endD) => {
    return !(endD >= startdate && startD <= enddate);
  };

  const onDateChange = (dates) => {
    setBookingDays(dates[1].diff(dates[0], "days"));
    form.resetFields(["room"]);
    const options = [];
    for (var room of rooms)
      if (room.bookings.length > 0) {
        for (var booking of room.bookings)
          if (
            isValidDateForRoom(
              new Date(booking.time[0]),
              new Date(booking.time[1]),
              dates[0].toDate(),
              dates[1].toDate()
            )
          )
            !options.map((x) => x._id).includes(room._id) && options.push(room);
      } else
        !options.map((x) => x._id).includes(room._id) && options.push(room);
    setRoomOptions(options);
  };

  const onUnbook = (room, pooch) => {
    setLoading(true);
    Room.removeBooking(room, pooch, (err) => {
      if (err) message.error(err.error);
      else
        User.getUser((user, err2) => {
          if (err2) message.error(err2.error);
          else {
            dispatch(setUser(user));
            message.success("Un-Booked");
          }
        });
      setLoading(false);
    });
  };

  let poochOptions = [];
  pooches.forEach((pooch, i) =>
    poochOptions.push(
      <Select.Option key={i} value={pooch._id}>
        {pooch.name}
      </Select.Option>
    )
  );

  // rooms.forEach((room, i) =>
  //   roomOptions.push(
  // <Select.Option key={i} value={room._id}>
  //   {room.number}
  // </Select.Option>
  //   )
  // );

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
        renderItem={(item) => {
          const pooch = pooches.find((x) => x._id === item.pooch) || {};
          const room =
            rooms.find((x) =>
              x.bookings.map((y) => y.pooch).includes(item.pooch)
            ) || {};
          return (
            <List.Item
              key={item._id}
              actions={[
                <Button
                  danger
                  type="link"
                  key="1"
                  onClick={() => onUnbook(room._id, item.pooch)}
                >
                  Un-Book
                </Button>,
              ]}
              className="list-card"
            >
              <Skeleton title={false} loading={loading} active>
                <List.Item.Meta
                  title={pooch.name}
                  description={
                    <span>
                      <strong> From: </strong>
                      {new Date(item.time[0]).toDateString()}
                      <strong> To: </strong>
                      {new Date(item.time[1]).toDateString()}
                    </span>
                  }
                />
                <span>
                  Days:{" "}
                  {moment(item.time[1]).diff(moment(item.time[0]), "days")}
                  {" | "}
                  Total:{" "}
                  {formatter.format(
                    moment(item.time[1]).diff(moment(item.time[0]), "days") * 25
                  )}
                  {" | "}Room:{room.number}
                </span>
              </Skeleton>
            </List.Item>
          );
        }}
      />
      <Modal
        title="New Booking"
        visible={openModal}
        onCancel={toggleModal}
        footer={null}
      >
        <Form onFinish={placeOrderForBooking} form={form}>
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
            <Select placeholder="Choose Room">
              {roomOptions.map((room, i) => (
                <Select.Option key={i} value={room._id}>
                  {room.number}
                </Select.Option>
              ))}
            </Select>
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
