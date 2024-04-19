import { useState } from "react";
import Message from "./Message";
const Chatbox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello i'm bankeji how can i help you today ?",
      name: "Assistant",
    },
  ]);

  return (
    <div className="pb-44 pt-20 wrapper ">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Chatbox;
