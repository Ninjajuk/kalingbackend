




const {Order} = require('../model/OrderSchema');
const nodemailer = require('nodemailer');
const User = require('../model/UserSchema');
const { generateOrderId } = require('../services/helper');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const {  userOrderInvoiceMail, AdminOrderEmail } = require('../services/emailTemplate');
const transporter = require('../services/common');
// const {sendMail}=require('../services/common')

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // upgrade later with STARTTLS
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSKEY_EMAIL,
//     },
// });

// const sendMail = async function ({ to, subject, text, html }) {
//     try {
//         console.log('Sending email to:', to);
//         let info = await transporter.sendMail({
//             from: '"Yingkiong Store" <codewizardsam@gmail.com>', // sender address
//             to,
//             subject,
//             text,
//             html
//         });

//         console.log('Email sent successfully:', info);
//         return info;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error; 
//     }
// };






  exports.createOrder = async (req, res) => {
    const order=req.body
    // console.log(order)
    const orderId=await generateOrderId()
    order.orderId=orderId
    const formattedDate = moment().format('MMM D, YYYY');
    order.date = formattedDate;  // Add the formatted date to the order object

    try {
      const newOrder= new Order(order)
      // console.log('newOrder',newOrder)
   

     //Send Mail to user
     const user = await User.findById(order.user)
     const userEmail=user.email
     console.log('userEmail',userEmail,orderId,formattedDate)

  //    const userInfo = await sendMail({
  //     to: userEmail,
  //     subject: 'Order details',
  //     text: 'Hi, Please find the order details below.\n\n' +
  //           `Order ID: ${order.orderId}\n` +
  //           `Total Items: ${order.totalItems}\n` +
  //           `Total Amount: $${order.totalAmount}\n`,
  //     html: `<p>Hi Samsu, Please find the order details below.</p>
  //            <p>Order ID: ${order.orderId}</p>
  //            <p>Total Items: ${order.totalItems}</p>
  //            <p>Total Amount: $${order.totalAmount}</p>`

  // });

    //Send Mail to Customer
    let mailPayload = {
      to: userEmail,
      html:userOrderInvoiceMail(order) ,
      subject: 'Order Placed Successfully',
      // text: 'Hi, Please find the order details below.\n\n'
    }
    await transporter.sendMail(mailPayload);
    console.log('Email sent to Customer');

    // Send Mail to Admin
    await transporter.sendMail({
      to: 'yingkiongstore@gmail.com',
      subject: 'New Order Received',
      html:AdminOrderEmail(order) ,
      //  text: 'A new order has been received. Details below:\n\n',
    });
    const doc = await newOrder.save()

      res.status(201).json({ order: doc, message: 'Order Added Successfully and mail sent' });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(400).json({ message: 'Error occurred, failed to send email' });
  };
}
  
  exports.FetchAllOrders = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sortBy = req.query.sortBy || 'orderId';
      const order = req.query.order === 'desc' ? -1 : 1;

      

      // Build the query object for sorting orders based in the delivery status
      // const status = req.query.status;
      // const query = {};
      // if (status) {
      //   query.status = status;
      // }
  
      const totalOrders = await Order.countDocuments();
      const totalPages = Math.ceil(totalOrders / limit);
  
      const orders = await Order.find({})
        .sort({ [sortBy]: order })
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.status(200).json({
        orders,
        totalPages,
        totalOrders
      });
    } catch (error) {
      console.error("Server Error", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.fetchOrdersByUser= async (req,res)=>{
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader) {
        console.log('No authorization header');
        return res.status(401).json({ error: "Unauthorized: No authorization header" });
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: "Unauthorized: No token provided" });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      } catch (err) {
        console.log('Token verification failed:', err);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
  
      const userId = decoded.userId;
      if (!userId) {
        console.log('Invalid token payload');
        return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
      }
  
      const orders = await Order.find({ user: userId }).populate('items');
      // console.log('Orders found for user:', userId);
  
      res.status(200).json({ orders, message: 'Successfully fetched user orders' });
    } catch (error) {
      console.log('Error fetching orders:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  }

  exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    // console.log(id)
    // console.log(req.body)
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  

  exports.sendMEailOrder = async (req, res) => {
    try {
      const email = 'biosamsuddin@gmail.com';
      const order = {
        id: 123,
        totalItems: 2,
        totalAmount: 500
      };
  
      console.log('before sending email', email)
const selectedAddress={
  
}
  //Send Mail to Customer
      let mailPayload = {
        to: email,
        html:userOrderInvoiceMail(order,selectedAddress) ,
        subject: 'Order Placed Successfully',
        // text: 'A new order has been received. Details below:\n\n',
      }
      await transporter.sendMail(mailPayload);
      console.log('Email sent to Customer');

      //Send Mail to Admin
      // await sendMail({
      //   to: 'yingkiongstore@gmail.com',
      //   subject: 'New Order Received',
      //   html:AdminOrderEmail(order,selectedAddress) ,
      // });
      console.log('Email sent to Admin');
  
      res.status(201).json({ order, message: 'Email sent to both user and admin' });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(400).json({ message: 'Error occurred, failed to send email' });
    }
  };
  