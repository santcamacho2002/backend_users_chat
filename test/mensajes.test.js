const Mensaje = require('../models/mensaje');
const { obtenerChat } = require('../controllers/mensajes');

// Mock the request and response objects
const req = {
  uid: 'user123',
  params: {
    de: 'user456'
  }
};

const res = {
  json: jest.fn()
};

// Mock the Mensaje.find method
Mensaje.find = jest.fn();

describe('obtenerChat', () => {
  test('should return the last 30 messages between two users', async () => {
    // Mock the Mensaje.find method to return the last 30 messages
    const mockMessages = [
      { de: 'user123', para: 'user456', contenido: 'Hello' },
      { de: 'user456', para: 'user123', contenido: 'Hi' },
      // ... 28 more messages
    ];
    Mensaje.find.mockResolvedValueOnce(mockMessages);

    await obtenerChat(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      mensajes: mockMessages
    });
  });

  test('should sort the messages by createdAt in descending order', async () => {
    // Mock the Mensaje.find method to return the messages in a different order
    /**
     * Array of mock messages.
     *
     * @type {Array<Object>}
     */
    const mockMessages = [
      { de: 'user123', para: 'user456', contenido: 'Hello', createdAt: '2022-01-01T00:00:00.000Z' },
      { de: 'user456', para: 'user123', contenido: 'Hi', createdAt: '2022-01-02T00:00:00.000Z' },
      // ... 28 more messages
    ];
    Mensaje.find.mockResolvedValueOnce(mockMessages);

    await obtenerChat(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      mensajes: mockMessages
    });
  });

  test('should limit the messages to 30', async () => {
    // Mock the Mensaje.find method to return more than 30 messages
    const mockMessages = [
      // ... 35 messages
    ];
    Mensaje.find.mockResolvedValueOnce(mockMessages);

    await obtenerChat(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      mensajes: mockMessages.slice(0, 30)
    });
  });
});