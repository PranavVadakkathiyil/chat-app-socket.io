import { Request,Response } from "express"
import Chat from "../models/ChatModel";
import User from "../models/UserModel";
interface AuhtRequest extends Request {
  verifyuser?: any; 
}
const accessChat = async(req:AuhtRequest,res:Response):Promise<void>=>{
        const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
     res.sendStatus(400);
     return
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.verifyuser._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.verifyuser._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      console.log(error);
      
    }
  }




















}
const fetchChats = async(req:AuhtRequest,res:Response):Promise<void>=>{
try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.verifyuser._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Error fetching chats" });
  }
}
const createGroupChat = async(req:AuhtRequest,res:Response):Promise<void>=>{
    const { Users, name } = req.body;

  if (!Users || !name) {
     res.status(400).json({ message: "Please fill all the fields." });
     return
  }

  let users;
  try {
    users = JSON.parse(Users);
  } catch (err) {
     res.status(400).json({ message: "Invalid users format." });
     return
  }

  if (users.length < 2) {
     res
      .status(400)
      .json({ message: "At least 3 members are required to form a group chat (including you)." });
      return
  }

  users.push(req.verifyuser);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: req.verifyuser,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error("Group chat creation failed:", error);
    res.status(500).json({ message: "Failed to create group chat." });
  }
}
const renameGroup = async(req:Request,res:Response)=>{
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
}
const removeFromGroup = async(req:Request,res:Response)=>{
  const { chatId, userId } = req.body;


  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
}
const addToGroup = async(req:Request,res:Response)=>{
   const { chatId, userId } = req.body;


  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
}

export {accessChat,fetchChats,createGroupChat,removeFromGroup,renameGroup,addToGroup}