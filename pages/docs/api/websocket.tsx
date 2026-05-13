import { motion } from 'framer-motion';
import Layout from '../../../components/Layout';

export default function ApiWebsocketPage() {
  return (
    <Layout>
      <div className=" pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-6">WebSocket Connections</h1>
            <p className="text-xl text-gray-300">Use streaming channels for real-time updates and event-driven workflows.</p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            <h2>Connection flow</h2>
            <p>Open a WebSocket session to subscribe to events, stream results, and receive system updates in real time.</p>

            <h2>Authentication</h2>
            <p>Send your API key as part of the connection handshake or in an initial authorization message.</p>

            <h2>Message format</h2>
            <p>Messages are JSON objects with an action, payload, and optional correlation ID to map responses back to requests.</p>

            <h2>Reconnect strategy</h2>
            <p>Implement exponential backoff when reconnecting, and preserve session metadata to continue processing after transient disconnects.</p>

            <h2>Example event</h2>
            <pre><code>{`{
  "action": "response",
  "requestId": "abc123",
  "payload": {
    "status": "completed",
    "result": { ... }
  }
}`}</code></pre>
          </div>
        </div>
      </div>
    </Layout>
  );
}
