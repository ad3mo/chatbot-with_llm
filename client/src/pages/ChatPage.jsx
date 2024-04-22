import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbox = ({ messages }) => {
  const messagesEndRef = useRef();
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);
  return (
    <div className="pb-44 pt-20 wrapper ">
      {messages.map((message, i) => (
        <Message key={i} message={message} />
      ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

const Message = ({ message }) => {
  return (
    <div
      className={`chat ${
        message.name === "Assistant" ? "chat-start" : "chat-end"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="alter" src="https://i.imgur.com/ogXWXf6.jpeg" />
        </div>
      </div>
      <div className="chat-header">{message.name}</div>
      <div className="chat-bubble">{message.text}</div>
    </div>
  );
};

const SendMessage = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const handleMessageSend = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      onSendMessage(input);
      setInput("");
    }
  };
  return (
    <form onSubmit={handleMessageSend}>
      <div className="fixed bottom-0 w-full px-8 py-2">
        <label className="input input-bordered flex items-center mx-auto gap-2 w-full max-w-4xl">
          <input
            type="text"
            className="grow"
            placeholder="Send message.."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <span className="cursor-pointer">
            <button type="submit" onClick={handleMessageSend}>
              <svg
                className="w-6 h-6 text-black "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                />
              </svg>
            </button>
          </span>
        </label>
      </div>
    </form>
  );
};

const ChatPage = () => {
  // const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello i'm bankeji how can i help you today ?",
      name: "Assistant",
    },
  ]);

  const handleMessageSend = async (message) => {
    const newMessage = {
      text: message,
      name: "User",
    };

    const newMessages = [...messages, newMessage]; //old + new msgs

    //update messages state
    setMessages(newMessages);

    // //gpt is typing
    // setTyping(true);

    await processMessageToAssistant(newMessage.text);
  };

  async function processMessageToAssistant(message) {
    const query = message;

    try {
      const response = await axios.post("/generate", {
        query,
      });

      // get generated response
      const generatedResponse = response.data;
      console.log(generatedResponse);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: generatedResponse.chat_response, name: "Assistant" },
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
      // Handle error for ui
    }
  }
  return (
    <div>
      <Chatbox messages={messages} />
      <SendMessage onSendMessage={handleMessageSend} />
    </div>
  );
};

export default ChatPage;
