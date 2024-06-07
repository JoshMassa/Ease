import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSocket } from '../context/SocketContext';
import '../styles/Messages.css';
import { CurrentUserContext } from '../context/CurrentUserContext';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg) => {
        // console.log('Received message from server:', msg);
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some((message) => message.messageId === msg.messageId || message._id === msg.messageId);
          if (!isDuplicate) {
            return [...prevMessages, msg];
          }
          return prevMessages;
        });
      });

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      return () => {
        socket.off('chat message');
        socket.off('connect');
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (socket && input && currentUser) {
      const message = {
        content: input,
        client_offset: new Date().toISOString(),
        user: { _id: currentUser._id, username: currentUser.username },
      };

      socket.emit('chat message', message);
      setInput(''); // Clear the input field
    }
  };

  return (
    <div id='messagesContainer'>
      <ul id="messages">
        {messages.map((message) => (
          <li key={message.messageId || message._id}>
            <strong>{message.user ? message.user.username : 'User'}:</strong> {message.content}
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      <form id="form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <input
          id="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messages;
