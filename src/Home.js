import React, { useState } from 'react';
import { Mistral } from '@mistralai/mistralai';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.MISTRAL_API_KEY || '2w4hNjRRFLFqP5WdvTWARN5WFPHAGnil';
  const client = new Mistral({ apiKey });

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);

    try {
      const response = await client.chat.complete({
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: userMessage }],
      });

      const chatResponse = response.choices[0].message.content;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { question: userMessage, answer: chatResponse },
      ]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { question: userMessage, answer: 'An error occurred. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      setUserMessage(''); // Clear input after sending
    }
  };

  return (
    <Container className="mt-4 p-4 border rounded bg-light shadow">
      <Row>
        <Col>
          <h2 className="text-center mb-4">Ultra IA ChatBot</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Chat History */}
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              marginBottom: '20px',
            }}
          >
            {chatHistory.length > 0 ? (
              chatHistory.map((entry, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <Card.Title className="text-primary">User:</Card.Title>
                    <Card.Text>{entry.question}</Card.Text>
                    <hr />
                    <Card.Title className="text-success">AI:</Card.Title>
                    <Card.Text>{entry.answer}</Card.Text>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="text-muted text-center">No conversation history yet.</p>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Input Form */}
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Type your message here..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={loading}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={loading}
              className="w-100"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
