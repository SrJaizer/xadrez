import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

const socket: Socket = io('http://127.0.0.1:5000');

export function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    socket.on('message', (msg: string) => {
      setMessages((prevMessages: string[]) => [...prevMessages, msg]);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('message', inputValue);
    setInputValue('');
  };

  return (
    <div>
      <ul>
        {messages.map((msg: string, index: number) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

