const { Notification } = require("../models")

exports.getNotifications = async (req, res) => {

  try {

    const notifications = await Notification.findAll({
      order: [["id", "DESC"]]
    })

    res.json(notifications)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Notification error"
    })

  }
}