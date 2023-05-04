const {
  orderListModel,
  transactionModel,
  roomModel,
  propertyModel,
  userModel,
  typeModel,
  roomAvailModel,
} = require("../model");
const { Op, Sequelize } = require("sequelize");
const { format, differenceInDays } = require("date-fns");
const schedule = require("node-schedule");
const { transport } = require("../config/nodemailer");

schedule.scheduleJob("0 8 * * *", async () => {
  const today = new Date();
  const data = await orderListModel.findAll({
    include: [
      {
        model: roomModel,
        as: "room",
        required: true,
        include: {
          model: propertyModel,
          as: "property",
          required: true,
        },
      },
      {
        model: transactionModel,
        as: "transaction",
        required: true,
        where: { [Op.and]: [{ status: "Confirmed" }, { emailSent: false }] },
        include: {
          model: userModel,
          as: "user",
          required: true,
        },
      },
    ],
  });
  data.forEach(async (val) => {
    const checkIn = new Date(val.transaction.checkinDate);
    if (differenceInDays(new Date(checkIn), today) === 1) {
      console.log(`ada tanggal checkin besok`);
      const emailContent = `<div>
      <span style="font-family: Arial, Helvetica, sans-serif">
        <div style="display: flex; align-items: center">
          <img width="100px" height="100px" src="cid:logo" />
          <h1>Renthaven</h1>
        </div>
        <br />
        <p>Dear, ${val.transaction.user.name}</p>
        <p>We would like to remind you about your booking:</p>
        <div style="padding: 12px; padding-left: 22px">
            <table>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Date:</td>
                <td style="padding-bottom: 20px; padding-right: 76px">
                ${format(checkIn, "MMM dd, yyyy")}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Place:</td>
                <td style="padding-bottom: 20px; padding-right: 76px">
                ${val.room.property.name}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Address:</td>
                <td style="padding-bottom: 20px; padding-right: 76px">${
                  val.room.property.address
                }</td>
              </tr>
            </table>
          </div>
        <br />
        <p>If you have any questions please don't hesitate to contact us.</p>
        <p>We hope you enjoy your stay!</p>
        <br />
        <p>Best Regards,</p>
        <br />
        <p>Renthaven</p>
      </span>
    </div>`;
      const updateEmail = await transactionModel.update(
        {
          emailSent: true,
        },
        {
          where: { transactionId: val.transaction.transactionId },
        }
      );

      transport.sendMail(
        {
          from: "Renthaven Admin",
          to: val.transaction.user.email,
          subject: "Check-in Reminder",
          html: emailContent,
          attachments: [
            {
              filename: "logo.png",
              path: "./src/public/email/logo.png",
              cid: "logo",
            },
          ],
        },
        (error, info) => {
          if (error) {
            return res.status(500).send(error);
          }
        }
      );
    }
  });
});

module.exports = {
  getData: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const offset = limit * page;
      const status = req.query.status ? { status: req.query.status } : null;
      const filterProperty = [{ tenantId: req.query.tenant }];
      if (req.query.property) {
        filterProperty.push({ name: { [Op.like]: "%" + req.query.property + "%" } });
      }
      const filterOrderId = req.query.orderId ? { orderId: req.query.orderId } : null;
      const data = await orderListModel.findAndCountAll({
        include: [
          {
            model: transactionModel,
            as: "transaction",
            required: true,
            include: {
              model: userModel,
              as: "user",
              required: true,
            },
            where: status,
          },
          {
            model: roomModel,
            as: "room",
            required: true,
            include: [
              {
                model: propertyModel,
                as: "property",
                required: true,
                where: { [Op.and]: filterProperty },
              },
              {
                model: typeModel,
                as: "type",
                required: true,
              },
            ],
          },
        ],
        where: filterOrderId,
        order: [["transaction", "status", "DESC"]],
        offset: offset,
        limit: limit,
      });
      const totalPage = Math.ceil(data.count / limit);
      if (data.count > 0) {
        return res.status(200).send({
          data: data.rows,
          page,
          limit,
          totalRows: data.count,
          totalPage,
        });
      } else {
        return res.status(404).send({
          message: `Data Not Found`,
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  update: async (req, res) => {
    try {
      const { status, transactionId, roomId } = req.body;
      if (status === "Confirmed") {
        const data = await orderListModel.findAll({
          include: [
            {
              model: transactionModel,
              as: "transaction",
              required: true,
              include: {
                model: userModel,
                as: "user",
                required: true,
              },
            },
            {
              model: roomModel,
              as: "room",
              required: true,
              include: [
                {
                  model: propertyModel,
                  as: "property",
                  required: true,
                },
                {
                  model: typeModel,
                  as: "type",
                  required: true,
                },
              ],
            },
          ],
          where: { transactionId },
        });
        const today = new Date();
        const { transaction, room } = data[0];
        const { user } = transaction;
        const { property, type } = room;
        const checkIn = new Date(transaction.checkinDate);
        const checkOut = new Date(transaction.checkoutDate);
        const numGuest = transaction.totalGuest;
        const userEmail = user.email;
        const userName = user.name;
        const price = data[0].price;
        const propertyName = property.name;
        const address = property.address;
        const roomName = type.name;

        const emailContent = `<div>
        <span style="font-family: Arial, Helvetica, sans-serif">
          <div style="display: flex; align-items: center">
            <img width="100px" height="100px" src="cid:logo" />
            <h1>Renthaven</h1>
          </div>
          <br />
          <p>Dear, ${userName}</p>
          <p>Thank you for booking your stay with Renthaven. We are looking forward to your visit.</p>
          <p>Your booking details are as follows:</p>
          <div style="padding: 12px; padding-left: 22px">
            <table>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Property</td>
                <td style="padding-bottom: 20px; padding-right: 76px">
                  ${propertyName}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Address</td>
                <td style="padding-bottom: 20px; padding-right: 76px">
                  ${address}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Check In</td>
                <td style="padding-bottom: 20px; padding-right: 76px; font-weight: bold">${format(
                  checkIn,
                  "MMM dd, yyyy"
                )}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Check Out</td>
                <td style="padding-bottom: 20px; padding-right: 76px; font-weight: bold">
                  ${format(checkOut, "MMM dd, yyyy")}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Room</td>
                <td style="padding-bottom: 20px; padding-right: 76px">${roomName}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px"># of Guest</td>
                <td style="padding-bottom: 20px; padding-right: 76px">${numGuest}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Booked by</td>
                <td style="padding-bottom: 20px; padding-right: 76px">${userName}</td>
              </tr>
              <tr>
                <td style="padding-right: 76px">Total</td>
                <td style="padding-right: 76px; font-weight: bold">Rp. ${parseInt(
                  price
                ).toLocaleString("id")}</td>
              </tr>
            </table>
          </div>
          <br />
          <p>If you have any questions please don't hesitate to contact us.</p>
          <p>We hope you enjoy your stay!</p>
          <br />
          <p>Best Regards,</p>
          <br />
          <p>Renthaven</p>
        </span>
      </div>`;

        const update = await transactionModel.update(
          {
            status,
          },
          {
            where: { transactionId },
          }
        );
        if (update) {
          transport.sendMail(
            {
              from: "Renthaven Admin",
              to: userEmail,
              subject: "Booking Confirmed",
              html: emailContent,
              attachments: [
                {
                  filename: "logo.png",
                  path: "./src/public/email/logo.png",
                  cid: "logo",
                },
              ],
            },
            (error, info) => {
              if (error) {
                return res.status(500).send(error);
              }
            }
          );

          if (differenceInDays(new Date(checkIn), today) === 1) {
            const emailh1 = `
            <div>
              <span style="font-family: Arial, Helvetica, sans-serif">
                <div style="display: flex; align-items: center">
                  <img width="100px" height="100px" src="cid:logo" />
                  <h1>Renthaven</h1>
                </div>
                <br />
                <p>Dear, ${userName}</p>
                <p>We would like to remind you about your booking:</p>
                <div style="padding: 12px; padding-left: 22px">
                    <table>
                      <tr>
                        <td style="padding-bottom: 20px; padding-right: 76px">Date:</td>
                        <td style="padding-bottom: 20px; padding-right: 76px">
                        ${format(checkIn, "MMM dd, yyyy")}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px; padding-right: 76px">Place:</td>
                        <td style="padding-bottom: 20px; padding-right: 76px">
                        ${propertyName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px; padding-right: 76px">Address:</td>
                        <td style="padding-bottom: 20px; padding-right: 76px">${address}</td>
                      </tr>
                    </table>
                  </div>
                <br />
                <p>If you have any questions please don't hesitate to contact us.</p>
                <p>We hope you enjoy your stay!</p>
                <br />
                <p>Best Regards,</p>
                <br />
                <p>Renthaven</p>
              </span>
            </div>`;
            const updateEmail = await transactionModel.update(
              {
                emailSent: true,
              },
              {
                where: { transactionId },
              }
            );
            transport.sendMail(
              {
                from: "Renthaven Admin",
                to: userEmail,
                subject: "Check-in Reminder",
                html: emailh1,
                attachments: [
                  {
                    filename: "logo.png",
                    path: "./src/public/email/logo.png",
                    cid: "logo",
                  },
                ],
              },
              (error, info) => {
                if (error) {
                  return res.status(500).send(error);
                }
              }
            );
          }

          return res.status(200).send({
            success: true,
            message: `Order has been updated`,
          });
        }
      } else if (status === "Waiting for payment") {
        const expired = new Date();
        expired.setHours(expired.getHours() + 2);
        const roomAvailData = await roomAvailModel.findAll({
          where: { roomId },
        });
        const updateRoom = await roomAvailModel.update(
          {
            endDate: roomAvailData[0].startDate,
          },
          {
            where: { roomId },
          }
        );
        const update = await transactionModel.update(
          {
            status,
            transactionExpired: expired,
          },
          {
            where: { transactionId },
          }
        );
        if (update) {
          return res.status(200).send({
            success: true,
            message: `Order has been updated`,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  cancelTenant: async (req, res) => {
    try {
      const cancel = await transactionModel.update(
        {
          status: "Cancelled",
        },
        {
          where: {
            [Op.and]: [{ transactionId: req.body.transactionId, status: "Waiting for payment" }],
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "The transaction has been cancelled",
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Database error",
      });
    }
  },
  cancelOrder: async(req, res) =>{
    try {
        const user = await userModel.findAll({
            where: {
                email: req.decrypt.email
            }
        })
        if(user.length > 0){
            const cancel = await transactionModel.update({
                status: "Cancelled"
            }, {
                where: {
                    transactionId: req.body.transactionId
                }
            })
            return res.status(200).send({
                success: true,
                message: "Book cancelled!"
            })
        }
        return res.status(401).send({
            success: false,
            message: "Unauthorized Action"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Database error"
        })
    }
},
};
