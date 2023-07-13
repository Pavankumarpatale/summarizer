import React, { useEffect, useState } from 'react';
import { Button } from '@vercel/examples-ui';
import { ChatLine, LoadingChatLine } from './ChatLine';
import styles from '../styles/styles.module.css';

type ChatAgent = 'user' | 'system' | 'assistant';

export interface Message {
  role: ChatAgent;
  content: string;
}

export const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: 'Hi! I am a friendly AI assistant. Ask me anything! I can summarize your text and answer questions. Type a message to start the conversation',
  },
];

const InputMessage: React.FC<{ input: string; setInput: React.Dispatch<React.SetStateAction<string>>; sendMessage: (message: string) => void; }> = ({ input, setInput, sendMessage }) => {
  return (
    <div className={`${styles['chat-container']} chat ${styles['input-container']}`}>
      <div className={styles['input-button']}>
        <input
          type="text"
          aria-label="chat input"
          required
          className={styles['input-field']}
          value={input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage(input);
              setInput('');
            }
          }}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <Button
          type="submit"
          className={styles['say-button']}
          onClick={() => {
            sendMessage(input);
            setInput('');
          }}
        >
          Say
        </Button>
      </div>
    </div>
  );
};


export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Retrieve last 100 messages from localStorage
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);
  const sendMessage = async (message: string) => {
    if (!loading) {
      setLoading(true);
      const newMessages: Message[] = [
        ...messages,
        { role: 'user', content: message },
      ];
      setMessages(newMessages);
      const last100messages = newMessages.slice(-100); // remember last 100 messages

      try {
        const response = await fetch('http://localhost:8080/summarize/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: message,
            config: {
              length_penalty: 1.2,
              num_beams: 8,
              max_length: 512,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();

        setMessages([
          ...newMessages,
          { role: 'assistant', content: data.summary },
        ]);
        localStorage.setItem('chatMessages', JSON.stringify(last100messages));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
  }
  return (
    <div className={styles['chat-container']}>
      <div className={styles['chat']}>
        {messages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}
      </div>

      {loading && <LoadingChatLine />}

      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </div>
  );
};
