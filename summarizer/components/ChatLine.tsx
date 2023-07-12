// ChatLine.tsx
import clsx from 'clsx';
import Balancer from 'react-wrap-balancer';
import styles from '../styles/styles.module.css';

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
const BalancerWrapper = (props: any) => <Balancer {...props} />;

type ChatAgent = 'user' | 'system' | 'assistant';

export interface Message {
  role: ChatAgent;
  content: string;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className={styles['loading-chat-line']}>
    <div className={styles['message-container']}>
      <div className={styles['loader']}></div>
    </div>
  </div>
);

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export function ChatLine({ role = 'assistant', content }: Message) {
  if (!content) {
    return null;
  }
  const formattedMessage = convertNewLines(content);

  return (
    <div className={clsx(styles['chat-line'], role === 'assistant' && styles['assistant'])}>
      <BalancerWrapper>
        <div className={styles['message-container']}>
          <div className={styles['message-content']}>
            <p className={styles['role-label']}>
                {role === 'assistant' ? 'AI' : 'You'}
            </p>
            <p className={styles['message-text']}>{formattedMessage}</p>
          </div>
        </div>
      </BalancerWrapper>
    </div>
  );
}
