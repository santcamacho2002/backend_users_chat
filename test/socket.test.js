const Usuario = require('../models/usuario');
const { usuarioConectado } = require('../controllers/socket');

// Mock the Usuario.findById method
Usuario.findById = jest.fn();

describe('usuarioConectado', () => {
  test('should connect a user and set online status to true', async () => {
    // Mock the Usuario.findById method to return a user
    const mockUser = {
      _id: 'user123',
      nombre: 'John Doe',
      online: false
    };
    Usuario.findById.mockResolvedValueOnce(mockUser);

    const connectedUser = await usuarioConectado('user123');

    expect(connectedUser.online).toBe(true);
    expect(Usuario.findById).toHaveBeenCalledWith('user123');
    expect(connectedUser).toEqual(mockUser);
  });

  test('should throw an error if user is not found', async () => {
    // Mock the Usuario.findById method to return null
    Usuario.findById.mockResolvedValueOnce(null);

    await expect(usuarioConectado('user123')).rejects.toThrow('Usuario no encontrado');
    expect(Usuario.findById).toHaveBeenCalledWith('user123');
  });

  test('should throw an error if an error occurs while connecting user', async () => {
    // Mock the Usuario.findById method to throw an error
    Usuario.findById.mockRejectedValueOnce(new Error('Database error'));

    await expect(usuarioConectado('user123')).rejects.toThrow('Error al conectar usuario');
    expect(Usuario.findById).toHaveBeenCalledWith('user123');
  });
});test('should disconnect a user and set online status to false', async () => {
  // Mock the Usuario.findById method to return a user
  const mockUser = {
    _id: 'user123',
    nombre: 'John Doe',
    online: true
  };
  Usuario.findById.mockResolvedValueOnce(mockUser);

  const disconnectedUser = await usuarioDesconectado('user123');

  expect(disconnectedUser.online).toBe(false);
  expect(Usuario.findById).toHaveBeenCalledWith('user123');
  expect(disconnectedUser).toEqual(mockUser);
});

test('should throw an error if user is not found', async () => {
  // Mock the Usuario.findById method to return null
  Usuario.findById.mockResolvedValueOnce(null);

  await expect(usuarioDesconectado('user123')).rejects.toThrow('Usuario no encontrado');
  expect(Usuario.findById).toHaveBeenCalledWith('user123');
});

test('should throw an error if an error occurs while disconnecting user', async () => {
  // Mock the Usuario.findById method to throw an error
  Usuario.findById.mockRejectedValueOnce(new Error('Database error'));

  await expect(usuarioDesconectado('user123')).rejects.toThrow('Error al desconectar usuario');
  expect(Usuario.findById).toHaveBeenCalledWith('user123');
});test('should save a message', async () => {
  // Mock the Mensaje.save method to return true
  const mockPayload = {
    content: 'Hello, world!',
    sender: 'user123',
    receiver: 'user456'
  };
  const mockSave = jest.fn().mockResolvedValueOnce(true);
  const mockMensaje = {
    save: mockSave
  };
  jest.spyOn(Mensaje, 'constructor').mockReturnValueOnce(mockMensaje);

  const result = await grabarMensaje(mockPayload);

  expect(result).toBe(true);
  expect(mockSave).toHaveBeenCalled();
  expect(Mensaje.constructor).toHaveBeenCalledWith(mockPayload);
});

test('should return false if an error occurs while saving a message', async () => {
  // Mock the Mensaje.save method to throw an error
  const mockPayload = {
    content: 'Hello, world!',
    sender: 'user123',
    receiver: 'user456'
  };
  const mockSave = jest.fn().mockRejectedValueOnce(new Error('Database error'));
  const mockMensaje = {
    save: mockSave
  };
  jest.spyOn(Mensaje, 'constructor').mockReturnValueOnce(mockMensaje);

  const result = await grabarMensaje(mockPayload);

  expect(result).toBe(false);
  expect(mockSave).toHaveBeenCalled();
  expect(Mensaje.constructor).toHaveBeenCalledWith(mockPayload);
});test('should save a message', async () => {
  // Mock the Mensaje.save method to return true
  const mockPayload = {
    content: 'Hello, world!',
    sender: 'user123',
    receiver: 'user456'
  };
  const mockSave = jest.fn().mockResolvedValueOnce(true);
  const mockMensaje = {
    save: mockSave
  };
  jest.spyOn(Mensaje, 'constructor').mockReturnValueOnce(mockMensaje);

  const result = await grabarMensaje(mockPayload);

  expect(result).toBe(true);
  expect(mockSave).toHaveBeenCalled();
  expect(Mensaje.constructor).toHaveBeenCalledWith(mockPayload);
});

test('should return false if an error occurs while saving a message', async () => {
  // Mock the Mensaje.save method to throw an error
  const mockPayload = {
    content: 'Hello, world!',
    sender: 'user123',
    receiver: 'user456'
  };
  const mockSave = jest.fn().mockRejectedValueOnce(new Error('Database error'));
  const mockMensaje = {
    save: mockSave
  };
  jest.spyOn(Mensaje, 'constructor').mockReturnValueOnce(mockMensaje);

  const result = await grabarMensaje(mockPayload);

  expect(result).toBe(false);
  expect(mockSave).toHaveBeenCalled();
  expect(Mensaje.constructor).toHaveBeenCalledWith(mockPayload);
});