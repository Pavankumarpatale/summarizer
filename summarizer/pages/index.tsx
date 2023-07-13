import { Text, Page } from '@vercel/examples-ui';
import { Chat } from '../components/Chat';
import styles from '../styles/styles.module.css';
import RootLayout from './layout'
function Home() {
  return (
    <Page className={`${styles['home-page']} flex flex-col justify-center items-center m-0 overflow-hidden`} style={{margin:0}}>
      <div className={`${styles['container']} m-0 overflow-hidden`}>
        <div className={`${styles['nav-header']} mb-2 overflow-hidden`}>
          <Text variant="h1">AI Text Summarizer</Text>
        </div>

        <div className={`${styles['chat-container']}  overflow-y-auto w-2/3 m-0`}>
          <Chat />
        </div>
      </div>
    </Page>
  );
}
Home.layout = RootLayout

export default Home;