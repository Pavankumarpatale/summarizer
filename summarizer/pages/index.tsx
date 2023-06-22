import { Text, Page } from '@vercel/examples-ui'
import { Chat } from '../components/Chat'
import { Layout } from '../components/layout'

function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">AI Text Summarizer and Chatbot</Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2"></Text>
        <div className="lg:w-2/3">
          <Chat />
        </div>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home