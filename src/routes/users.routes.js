import express from 'express';
import { User } from '../models/user.js';
import { Reservations } from '../models/reservation.js';
import { Rooms } from '../models/rooms.js';
import { verifyToken } from '../services/authMidleware.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
const router = express.Router();


router.get('/:dni', verifyToken, async (req, res) => {
  try {
    const { dni } = req.params;
    
    console.log('[UsersRoutes][PROFILE][REQUEST]', { 
      requestedDni: dni, 
      tokenDni: req.user.dni,
      tokenEmail: req.user.email 
    });
    
  
    if (req.user.dni !== parseInt(dni)) {
      console.log('[UsersRoutes][PROFILE][PERMISSION_DENIED]', 'DNI no coincide');
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para acceder a este perfil' 
      });
    }

    const user = await User.findByPk(dni);
    if (!user) {
      console.log('[UsersRoutes][PROFILE][USER_NOT_FOUND]', { dni });
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    console.log('[UsersRoutes][PROFILE][USER_FOUND]', { 
      dni: user.dni, 
      name: user.name, 
      email: user.email 
    });

    
    const userData = {
      dni: user.dni,
      name: user.name,
      surname: user.surname,
      email: user.email,
      cellNumber: user.cellNumber,
      class: user.class
    };

    res.json({
      success: true,
      data: userData,
      message: 'Perfil obtenido exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

router.put('/:dni', verifyToken, async (req, res) => {
  try {
    const { dni } = req.params;
    const { name, surname, email, cellNumber } = req.body;

    console.log('[UsersRoutes][UPDATE][REQUEST]', { 
      requestedDni: dni, 
      tokenDni: req.user.dni,
      tokenEmail: req.user.email,
      body: { name, surname, email, cellNumber }
    });
    
    
    if (req.user.dni !== parseInt(dni)) {
      console.log('[UsersRoutes][UPDATE][PERMISSION_DENIED]', 'DNI no coincide');
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para actualizar este perfil' 
      });
    }

   
    if (!name || !surname || !email || !cellNumber) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(cellNumber.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Formato de número de celular inválido'
      });
    }

   console.log('[UsersRoutes][UPDATE][CHECKING_EMAIL_DUPLICATE]', { email, dni });
    const existingUser = await User.findOne({
      where: { 
        email: email,
        dni: { [Op.ne]: dni }
      }
    });
   console.log('[UsersRoutes][UPDATE][EMAIL_CHECK_RESULT]', { 
      existingUser: existingUser ? { dni: existingUser.dni, email: existingUser.email } : null 
    });
    if (existingUser) {
      console.log('[UsersRoutes][UPDATE][EMAIL_DUPLICATE_FOUND]', 'Email ya existe');
      return res.status(400).json({
        success: false,
        message: 'Este email ya está en uso por otro usuario'
      });
    }

    console.log('[UsersRoutes][UPDATE][BEFORE_UPDATE]', { dni, name, surname, email, cellNumber });
    
    const [updatedRowsCount] = await User.update(
      { name, surname, email, cellNumber },
      { where: { dni } }
    );

    console.log('[UsersRoutes][UPDATE][ROWS_UPDATED]', updatedRowsCount);

    if (updatedRowsCount === 0) {
      console.log('[UsersRoutes][UPDATE][USER_NOT_FOUND]', { dni });
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    console.log('[UsersRoutes][UPDATE][FETCHING_UPDATED_USER]', { dni });
    const updatedUser = await User.findByPk(dni);
    
    if (!updatedUser) {
      console.log('[UsersRoutes][UPDATE][ERROR_FETCHING_USER]', { dni });
      return res.status(500).json({
        success: false,
        message: 'Error al obtener usuario actualizado'
      });
    }
    
    const userData = {
      dni: updatedUser.dni,
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      cellNumber: updatedUser.cellNumber,
      class: updatedUser.class
    };

    console.log('[UsersRoutes][UPDATE][SUCCESS]', userData);
    res.json({
      success: true,
      data: userData,
      message: 'Perfil actualizado exitosamente'
    });

  } catch (error) {
    console.error('[UsersRoutes][UPDATE][ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});


router.put('/:dni/password', verifyToken, async (req, res) => {
  try {
    const { dni } = req.params;
    const { currentPassword, newPassword } = req.body;

    console.log('[UsersRoutes][PASSWORD][REQUEST]', { 
      requestedDni: dni, 
      tokenDni: req.user.dni,
      tokenEmail: req.user.email 
    });
    
    
    if (req.user.dni !== parseInt(dni)) {
      console.log('[UsersRoutes][PASSWORD][PERMISSION_DENIED]', 'DNI no coincide');
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para cambiar esta contraseña' 
      });
    }

    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña son obligatorias'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    
    const user = await User.findByPk(dni);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe ser diferente a la actual'
      });
    }

    
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    await User.update(
      { password: hashedNewPassword },
      { where: { dni } }
    );

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});


router.get('/:dni/reservations', verifyToken, async (req, res) => {
  try {
    const { dni } = req.params;

    console.log('[UsersRoutes][RESERVATIONS][REQUEST]', { 
      requestedDni: dni, 
      tokenDni: req.user.dni,
      tokenEmail: req.user.email 
    });
    
 
    if (req.user.dni !== parseInt(dni)) {
      console.log('[UsersRoutes][RESERVATIONS][PERMISSION_DENIED]', 'DNI no coincide');
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para ver estas reservas' 
      });
    }
    
    console.log('[UsersRoutes][RESERVATIONS][FETCH]', { dni });
    const reservations = await Reservations.findAll({
      where: { user_Dni: dni },
      include: [{
        model: Rooms,
    
        attributes: ['Id', 'Nombre', 'Tipo', 'Tarifa']
      }],
      order: [['Id', 'DESC']]
    });
     console.log('[UsersRoutes][RESERVATIONS][RESULT_COUNT]', reservations?.length);
    res.json({
      success: true,
      data: reservations,
      message: 'Reservas obtenidas exitosamente'
    });

  } catch (error) {
    console.error('[UsersRoutes][RESERVATIONS][ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

export default router;