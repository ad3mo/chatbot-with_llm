import { useState, useRef, useEffect } from "react";
import axios from "axios";
const API_KEY = "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";

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
  const handleMessageSend = () => {
    if (input.trim() !== "") {
      onSendMessage(input);
      setInput("");
    }
  };
  return (
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
          <button onClick={handleMessageSend}>
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
              />
            </svg>
          </button>
        </span>
      </label>
    </div>
  );
};

const ChatPage = () => {
  const [typing, setTyping] = useState(false);
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

    //gpt is typing
    setTyping(true);

    await processMessageToChatGPT(newMessage);
  };

  async function processMessageToChatGPT(chatMessages) {
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.name === "Assistant") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.text };
    });

    // "Explain things like you would to a 10 year old learning how to code."
    const systemMessage = {
      //  Explain things like you're talking to a software professional with 5 years of experience.
      role: "system",
      content:
        "Explain things like you're talking to a software professional with 2 years of experience.",
    };
    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo-0613",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            text: data.choices[0].message.content,
            name: "Assistant",
          },
        ]);
        setTyping(false);
      });
  }

  // async function processMessageToChaTGPT(message) {
  //   const query = message; // Assuming the message contains the query

  //   try {
  //     const response = await axios.post("http://localhost:5001/generate", {
  //       query,
  //     });

  //     // Assuming response.data contains the generated response from the server
  //     const generatedResponse = response.data;
  //     console.log(generatedResponse);
  //     setMessages([...messages], {
  //       text: generatedResponse.text,
  //       name: "Assistant",
  //     });

  //     // Do something with the generated response, such as updating the UI
  //   } catch (error) {
  //     console.error("Error generating response:", error);
  //     // Handle error
  //   }
  // }
  return (
    <div>
      <Chatbox messages={messages} />
      <SendMessage onSendMessage={handleMessageSend} />
    </div>
  );
};

export default ChatPage;
