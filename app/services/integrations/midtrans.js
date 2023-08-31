import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import midtransClient from "midtrans-client";
import moment from "moment-timezone";

const timestamp = new Date();
timestamp.setHours(timestamp.getHours() + 7);
const today = moment.utc(timestamp).tz("Asia/Jakarta");

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });

        const createOrder = await order.save()
        const idProduct = createOrder.orderItems[0].product
        const qty = createOrder.orderItems[0].qty
        const updateProduct = await Product.findById(idProduct)
        console.log((updateProduct.countInStock - qty), '<< stocknya')
        if (updateProduct) {
            if ((updateProduct.countInStock - qty) < 0) {
              updateProduct.countInStock = 0
            } else {
              updateProduct.countInStock = (updateProduct.countInStock - qty)
            }

        }

        const updatedProduct = await updateProduct.save()
        console.log(updatedProduct, 'update stocknya')

        res.status(201).json(createOrder);
    }
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    // Check if the request was from an admin or if the order user ID was equal to the request user ID
    if (order && (req.user.isAdmin || order.user._id.equals(req.user._id))) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    // Check if the request was from an admin or if the order user ID was equal to the request user ID
    if (order && (req.user.isAdmin || order.user._id.equals(req.user._id))) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    // Check if the request was from an admin
    if (order && req.user.isAdmin) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        console.log(updatedOrder)
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const payWithMidtrans = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const pay = false

    console.log(order.user, '<< yang punya')

    if (!order) {
        res.status(404);
        throw new Error("Order not found!");
    }
    const user = await User.findById(order.user);

    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    let snap = new midtransClient.Snap({
      isProduction : false,
      serverKey : 'SB-Mid-server-3DqVOJVYyMDx9CA475EGPxbr',
      clientKey : 'SB-Mid-client-JwF2T7mkPw2sF5rN'
    })


    let parameter = {
      transaction_details: {
        order_id: order._id,
        gross_amount: order.totalPrice,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.name,
        last_name: "-",
        email: user.email,
        phone: "-",
      },
    };


    snap.createTransaction(parameter)
        .then((transaction) => {
            let transactionToken = transaction.token;
            console.log("transactionToken:", transactionToken);

            let transactionRedirectUrl = transaction.redirect_url;
            console.log("transactionRedirectUrl:", transactionRedirectUrl);

            res.json({
                redirect_url: transactionRedirectUrl,
                token: transactionToken,
            });
        })
        .catch((e) => {
            console.log("Error occured:", e.message);
        });

})

const payWithMidtransCoreAPI = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    console.log(order.user, '<< yang punya')

    if (!order) {
        res.status(404);
        throw new Error("Order not found!");
    }
    const user = await User.findById(order.user);

    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    var coreApi = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'SB-Mid-server-3DqVOJVYyMDx9CA475EGPxbr',
        clientKey : 'SB-Mid-client-JwF2T7mkPw2sF5rN'
    })

    console.log(coreApi)

    let parameter = {
      transaction_details: {
        order_id: order._id,
        gross_amount: order.totalPrice,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.name,
        last_name: "-",
        email: user.email,
        phone: "-",
      },
    };

    coreApi.charge(parameter)
        .then((chargeResponse) => {
            console.log('chargeResponse:',JSON.stringify(chargeResponse));
        })
})

const updatePayWithMidtrans = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    let apiClient = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'SB-Mid-server-3DqVOJVYyMDx9CA475EGPxbr',
        clientKey : 'SB-Mid-client-JwF2T7mkPw2sF5rN'
    });
    let hasil = await apiClient.transaction.status(order._id)
    if (hasil.transaction_status === 'settlement') {
        console.log('ini udah sattle')
        order.isPaid = true;
        order.paidAt = today;
        console.log(order.isPaid)
        console.log(order.paidAt)
        order.paymentResult = {
          status_message: req.body.status_message,
          transaction_id: req.body.transaction_id,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        console.log('belum settle')
        res.send('ini belum settle');
    }
    if (!order) {
      res.status(404);
      throw new Error("Order not found!");
    }


  });


export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    payWithMidtrans,payWithMidtransCoreAPI,
    updatePayWithMidtrans
};