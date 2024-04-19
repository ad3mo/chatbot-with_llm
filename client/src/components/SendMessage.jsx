import { useState } from "react";

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
  };
  return (
    <form className="">
      <div className="fixed bottom-0 w-full px-8 py-2">
        <label className="input input-bordered flex items-center mx-auto gap-2 w-full max-w-4xl">
          <input
            type="text"
            className="grow"
            placeholder="Send message.."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <span className="cursor-pointer">
            <button type="submit" onClick={handleSubmit}>
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
    </form>
  );
};

export default SendMessage;
