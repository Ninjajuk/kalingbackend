
const { sendMail, invoiceTemplate,NewOrderReceivedEmail } = require('../services/common');


exports.FetchOrders = async (req, res) => {
   try {
      const order = { id: '123', totalItems: 5, totalAmount: 100 };
      // Call the function to send email
      const info = await sendMail({
         to: 'biosamsuddin@gmail.com',
         subject: 'Order details',
         text: 'Hi Samsu, Please find the order details below.',
         html: invoiceTemplate(order),
      });

   // Send email to the admin
const adminEmail = 'samsuddinansari360@gmail.com';
const adminEmailResult = await sendMail({
   to: adminEmail,
   html: NewOrderReceivedEmail(order),
   subject: 'New Order Received'
});
console.log('Admin Email sent: ', adminEmailResult);


   
   console.log('User Email sent: ', info);
      res.json(info);
   } catch (error) {
      console.log('Server Error');
      res.status(500).json({ error: 'Internal Server Error' });
   }
};

  exports.CreateOrders=async(req,res)=>{
    try {
      res.json({message:'Samsuddin ansari'})
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }





  exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    
    // Fetch the admin's email
    const admin = await Admin.findOne(); // You need to adjust this based on your actual data model
    const adminEmail = admin.email;
  
    // Update stocks
    for (let item of order.items) {
      let product = await Product.findOne({ _id: item.product.id });
      product.stock -= item.quantity;
      await product.save();
    }
  
    try {
      const doc = await order.save();
      const user = await User.findById(order.user);
  
      // Send email to the user
      await sendMail({ to: user.email, html: invoiceTemplate(order), subject: 'Order Received' });
  
      // Send email to the admin
      await sendMail({ to: adminEmail, html: invoiceTemplate(order), subject: 'New Order Received' });
  
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  

  // exports.createOrder = async (req, res) => {
  //   const order = new Order(req.body);
    
  //   // Fetch the admin's email
  //   const admin = await Admin.findOne(); // You need to adjust this based on your actual data model
  //   const adminEmail = 'yingkiongstore@gmail.com';
  
  //   // Update stocks
  //   for (let item of order.items) {
  //     let product = await Product.findOne({ _id: item.product.id });
  //     product.stock -= item.quantity;
  //     await product.save();
  //   }
  
  //   try {
  //     const doc = await order.save();
  //     const user = await User.findById(order.user);
  
  //     // Send email to the user
  //     await sendMail({ to: user.email, html: invoiceTemplate(order), subject: 'Order Received' });
  
  //     // Send email to the admin
  //     await sendMail({ to: adminEmail, html: invoiceTemplate(order), subject: 'New Order Received' });
  
  //     res.status(201).json(doc);
  //   } catch (err) {
  //     res.status(400).json(err);
  //   }
  // };
  