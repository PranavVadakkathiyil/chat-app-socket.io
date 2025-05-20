import mongoose,{Schema,Types,model,models} from "mongoose";
export interface IMsg{
    sender:Types.ObjectId,
    content:string,
    chat:Types.ObjectId,
    readBy:Types.ObjectId[]
}
const messageSchema = new Schema<IMsg>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = models?.Message ||  model<IMsg>("Message", messageSchema);
export default Message