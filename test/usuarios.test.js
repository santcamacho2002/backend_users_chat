const { getUsuarios } = require('../controllers/usuarios');
const Usuario = require('../models/usuario');

// Mock the Usuario.find method
Usuario.find = jest.fn();

describe('getUsuarios', () => {
  test('should return a list of users', async () => {
    // Mock the Usuario.find method to return a list of users
    const mockUsers = [
      { _id: 'user123', nombre: 'John Doe', online: true },
      { _id: 'user456', nombre: 'Jane Smith', online: false }
    ];
    Usuario.find.mockResolvedValueOnce(mockUsers);

    const req = { query: { desde: 0 }, uid: 'user789' };
    const res = { json: jest.fn() };

    await getUsuarios(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      usuarios: mockUsers
    });
    expect(Usuario.find).toHaveBeenCalledWith({ _id: { $ne: 'user789' } });
  });

  test('should return an empty list if no users found', async () => {
    // Mock the Usuario.find method to return an empty list
    Usuario.find.mockResolvedValueOnce([]);

    const req = { query: { desde: 0 }, uid: 'user789' };
    const res = { json: jest.fn() };

    await getUsuarios(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: true,
      usuarios: []
    });
    expect(Usuario.find).toHaveBeenCalledWith({ _id: { $ne: 'user789' } });
  });

  test('should return an error if an error occurs while fetching users', async () => {
    // Mock the Usuario.find method to throw an error
    Usuario.find.mockRejectedValueOnce(new Error('Database error'));

    const req = { query: { desde: 0 }, uid: 'user789' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getUsuarios(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    expect(Usuario.find).toHaveBeenCalledWith({ _id: { $ne: 'user789' } });
  });
});test('should update a user', async () => {
/**
 * Request object for testing purposes.
 * @typedef {Object} Request
 * @property {Object} params - The parameters object.
 * @property {string} params.uid - The user ID.
 * @property {Object} body - The body object.
 * @property {string} body.nombre - The user's first name.
 * @property {string} body.apellido - The user's last name.
 * @property {number} body.semestre - The user's semester.
 * @property {number} body.fisicaMecanica - The user's score in the physics mechanics course.
 * @property {number} body.calculoDiferencial - The user's score in the differential calculus course.
 * @property {number} body.pensamientoAlgoritmico - The user's score in the algorithmic thinking course.
 */
  const req = {
    params: { uid: 'user123' },
    body: {
      nombre: 'John',
      apellido: 'Doe',
      semestre: 3,
      fisicaMecanica: 90,
      calculoDiferencial: 85,
      pensamientoAlgoritmico: 95
    }
  };
  const res = {
    json: jest.fn()
  };

  const usuarioActualizado = {
    _id: 'user123',
    nombre: 'John',
    apellido: 'Doe',
    semestre: 3,
    fisicaMecanica: 90,
    calculoDiferencial: 85,
    pensamientoAlgoritmico: 95
  };

  Usuario.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(usuarioActualizado);

  await updateUser(req, res);

  expect(res.json).toHaveBeenCalledWith({
    ok: true,
    msg: 'Usuario actualizado',
    usuario: usuarioActualizado
  });
  expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith(
    'user123',
    {
      nombre: 'John',
      apellido: 'Doe',
      semestre: 3,
      fisicaMecanica: 90,
      calculoDiferencial: 85,
      pensamientoAlgoritmico: 95
    },
    { new: true }
  );
});

test('should return an error if user is not found', async () => {
  const req = {
    params: { uid: 'user123' },
    body: {
      nombre: 'John',
      apellido: 'Doe',
      semestre: 3,
      fisicaMecanica: 90,
      calculoDiferencial: 85,
      pensamientoAlgoritmico: 95
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  Usuario.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(null);

  await updateUser(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    ok: false,
    msg: 'Usuario no encontrado'
  });
});

test('should return an error if an error occurs while updating user', async () => {
  const req = {
    params: { uid: 'user123' },
    body: {
      nombre: 'John',
      apellido: 'Doe',
      semestre: 3,
      fisicaMecanica: 90,
      calculoDiferencial: 85,
      pensamientoAlgoritmico: 95
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  Usuario.findByIdAndUpdate = jest.fn().mockRejectedValueOnce(new Error('Database error'));

  await updateUser(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
});test('should get a user by ID', async () => {
  const req = {
    params: { uid: 'user123' },
  };
  const res = {
    json: jest.fn(),
  };

  const mockUser = {
    _id: 'user123',
    nombre: 'John Doe',
    apellido: 'Smith',
    semestre: 3,
    fisicaMecanica: 90,
    calculoDiferencial: 85,
    pensamientoAlgoritmico: 95,
  };

  Usuario.findById = jest.fn().mockResolvedValueOnce(mockUser);

  await getUserByID(req, res);

  expect(res.json).toHaveBeenCalledWith({
    ok: true,
    usuario: mockUser,
  });
  expect(Usuario.findById).toHaveBeenCalledWith('user123');
});

test('should return an error if user is not found', async () => {
  const req = {
    params: { uid: 'user123' },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  Usuario.findById = jest.fn().mockResolvedValueOnce(null);

  await getUserByID(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    ok: false,
    msg: 'Usuario no encontrado',
  });
});

test('should return an error if an error occurs while fetching user', async () => {
  const req = {
    params: { uid: 'user123' },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  Usuario.findById = jest.fn().mockRejectedValueOnce(new Error('Database error'));

  await getUserByID(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
});