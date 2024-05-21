const { login } = require('../controllers/auth');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

// Mock the request and response objects
const req = {
  body: {
    correo: 'test@example.com',
    contrasena: 'password123'
  }
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

// Mock the Usuario.findOne method
Usuario.findOne = jest.fn();

describe('login', () => {
  test('should return 404 if user is not found', async () => {
    // Mock the Usuario.findOne method to return null
    Usuario.findOne.mockResolvedValueOnce(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      msg: 'Credenciales invalidas'
    });
  });

  test('should return 404 if password is invalid', async () => {
    // Mock the Usuario.findOne method to return a user
    Usuario.findOne.mockResolvedValueOnce({
      correo: 'test@example.com',
      contrasena: bcrypt.hashSync('password456', bcrypt.genSaltSync())
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      msg: 'Credenciales invalidas'
    });
  });

  test('should return a valid token if login is successful', async () => {
    // Mock the Usuario.findOne method to return a user
    Usuario.findOne.mockResolvedValueOnce({
      correo: 'test@example.com',
      contrasena: bcrypt.hashSync('password123', bcrypt.genSaltSync()),
      id: 'user123'
    });

    // Mock the generarJWT method
    const mockToken = 'mockToken';
    const generarJWT = jest.fn().mockResolvedValueOnce(mockToken);

    // Replace the original generarJWT function with the mock
    const originalGenerarJWT = require('../helpers/jwt').generarJWT;
    require('../helpers/jwt').generarJWT = generarJWT;

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      usuario: {
        correo: 'test@example.com',
        contrasena: expect.any(String),
        id: 'user123'
      },
      token: mockToken
    });

    // Restore the original generarJWT function
    require('../helpers/jwt').generarJWT = originalGenerarJWT;
  });

  test('should return 500 if an error occurs', async () => {
    // Mock the Usuario.findOne method to throw an error
    Usuario.findOne.mockRejectedValueOnce(new Error('Database error'));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      msg: 'Hable con el admin'
    });
  });
});test('should return 400 if email already exists', async () => {
  // Mock the Usuario.findOne method to return a user
  Usuario.findOne.mockResolvedValueOnce({
    correo: 'test@example.com',
    contrasena: 'password123'
  });

  await crearUsuario(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    ok: false,
    msg: 'Credenciales no validas'
  });
});

test('should save the user and return a valid token', async () => {
  // Mock the Usuario.findOne method to return null
  Usuario.findOne.mockResolvedValueOnce(null);

  // Mock the usuario.save method
  const mockUser = {
    correo: 'test@example.com',
    contrasena: 'password123'
  };
  const save = jest.fn().mockResolvedValueOnce(mockUser);
  const usuario = jest.fn().mockReturnValueOnce({ save });

  // Replace the original Usuario constructor with the mock
  const originalUsuario = require('../models/usuario');
  require('../models/usuario') = usuario;

  // Mock the generarJWT method
  const mockToken = 'mockToken';
  const generarJWT = jest.fn().mockResolvedValueOnce(mockToken);

  // Replace the original generarJWT function with the mock
  const originalGenerarJWT = require('../helpers/jwt').generarJWT;
  require('../helpers/jwt').generarJWT = generarJWT;

  await crearUsuario(req, res);

  expect(save).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith({
    ok: true,
    usuario: mockUser,
    token: mockToken
  });

  // Restore the original Usuario constructor
  require('../models/usuario') = originalUsuario;

  // Restore the original generarJWT function
  require('../helpers/jwt').generarJWT = originalGenerarJWT;
});

test('should return 500 if an error occurs', async () => {
  // Mock the Usuario.findOne method to throw an error
  Usuario.findOne.mockRejectedValueOnce(new Error('Database error'));

  await crearUsuario(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    ok: false,
    msg: 'Hable con el admin'
  });
});test('should return 404 if user is not found', async () => {
  // Mock the Usuario.findById method to return null
  Usuario.findById.mockResolvedValueOnce(null);

  // Mock the req object
  const req = {
    uid: 'user123'
  };

  await renewToken(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    ok: false,
    msg: 'Usuario no encontrado'
  });
});

test('should return a valid token if user is found', async () => {
  // Mock the Usuario.findById method to return a user
  /**
   * Mock user object for testing purposes.
   * @typedef {Object} MockUser
   * @property {string} _id - The unique identifier of the user.
   * @property {string} correo - The email address of the user.
   * @property {string} contrasena - The password of the user.
   */
  /**
   * Mock user object for testing purposes.
   * @typedef {Object} MockUser
   * @property {string} _id - The unique identifier of the user.
   * @property {string} correo - The email address of the user.
   * @property {string} contrasena - The password of the user.
   */
  const mockUser = {
    _id: 'user123',
    correo: 'test@example.com',
    contrasena: 'password123'
  };
  Usuario.findById.mockResolvedValueOnce(mockUser);

  // Mock the generarJWT method
  const mockToken = 'mockToken';
  const generarJWT = jest.fn().mockResolvedValueOnce(mockToken);

  // Replace the original generarJWT function with the mock
  const originalGenerarJWT = require('../helpers/jwt').generarJWT;
  require('../helpers/jwt').generarJWT = generarJWT;

  // Mock the req object
  const req = {
    uid: 'user123'
  };

  await renewToken(req, res);

  expect(res.json).toHaveBeenCalledWith({
    ok: true,
    usuario: mockUser,
    token: mockToken
  });

  // Restore the original generarJWT function
  require('../helpers/jwt').generarJWT = originalGenerarJWT;
});

test('should return 500 if an error occurs', async () => {
  // Mock the Usuario.findById method to throw an error
  Usuario.findById.mockRejectedValueOnce(new Error('Database error'));

  // Mock the req object
  const req = {
    uid: 'user123'
  };

  await renewToken(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    ok: false,
    msg: 'Hable con el admin'
  });
});