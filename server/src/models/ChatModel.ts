import mongoose,{model,models,Schema, Types} from 'mongoose'

export interface Ichat{
    chatName:string,
    isGroupChat:boolean,
    users:Types.ObjectId[],
    latestMessage:Types.ObjectId,
    groupAdmin:Types.ObjectId,

}
const chatModel  = new Schema<Ichat>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = models?.Chat || model<Ichat>("Chat",chatModel)
export default Chat