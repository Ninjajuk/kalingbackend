



const orderHelper={

    sendEmailsAsync:async (order, userEmail) => {
        try {
          await Promise.all([
            transporter.sendMail({
              to: userEmail,
              subject: 'Order Placed Successfully',
              html: userOrderInvoiceMail(order)
            }),
            transporter.sendMail({
              to: 'yingkiongstore@gmail.com',
              subject: 'New Order Received',
              html: AdminOrderEmail(order)
            })
          ]);
          console.log('Emails sent successfully');
        } catch (error) {
          console.error('Failed to send emails:', error);
          // Consider logging this error to a monitoring service
        }
      }
}