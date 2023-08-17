const { Server } = require("socket.io");
const config = require("config");
const { OnlineUserHandler } = require("../handlers");

class Socket {
  constructor() {
    this.io;
  }

  static initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: config.frontendUrl,
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
      },
      allowEIO3: true,
    });

    this.io.use((socket, next) => {
      if (socket.handshake.query.socketId) socket.id = socket.handshake.query.socketId;
      next();
    });
    

    this.io.on("connection", (socket) => {
      console.log("socket.io is connected", socket.id);

      socket.on("newUser", (userId) => {
        addNewUser(userId, socket.id);
      });

      socket.on("joinGroupRoom", (conversationId) => {
        const currentRooms = Array.from(socket.rooms); // Convert Set to an array
        console.log(socket.rooms, currentRooms)
        currentRooms.forEach((room) => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        socket.join(conversationId);
      });

      socket.on("message", async (data) => {
        const receiver = await getUser(data.userId);

        if (receiver) {
          this.io.to(receiver.socket_id).emit("send-notification", data);
        }
      });

      socket.on("disconnect", async () => {
        await removeUser(socket.id);
      });
    });
  }
}

const addNewUser = async (userId, socketId) => {
  
  try {
    const userExist = await OnlineUserHandler.getUserSocketId(userId);

    if (userExist) return;

    await OnlineUserHandler.addUser(userId, socketId);
  } catch (error) {
    console.log("Error while adding online users", error);
  }
};

const removeUser = async (socketId) => {
  try {
    await OnlineUserHandler.removeUser(socketId);
  } catch (error) {
    console.log("Error while adding online users", error);
  }
};

const getUser = async (userId) => {
  console.log("removing socketocmin sjk", socketId)
  try {
    const resposne = await OnlineUserHandler.getUserSocketId(userId);
    console.log(resposne);
    return resposne;
  } catch (error) {
    console.log("Error while adding online users", error);
    return null;
  }
};

module.exports = Socket;
