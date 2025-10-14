import express from 'express';
import { User } from '../models/user.js';
import { Reservations } from '../models/reservation.js';
import { Rooms } from '../models/rooms.js';
import { verifyToken } from '../services/authMidleware.js';

const router = express.Router();


router.get('/:dni', verifyToken, async (req, res) => {
  try {
    const { dni } = req.params;
    
   
    const tokenData = req.user;
    if (tokenData.dni !== parseInt(dni)) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para acceder a este perfil' 
      });
    }

    const user = await User.findByPk(dni);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    
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

    const tokenData = req.user;
    if (tokenData.dni !== parseInt(dni)) {
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

   
    const existingUser = await User.findOne({
      where: { 
        email: email,
        dni: { [require('sequelize').Op.ne]: dni }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está en uso por otro usuario'
      });
    }

    const [updatedRowsCount] = await User.update(
      { name, surname, email, cellNumber },
      { where: { dni } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

  
    const updatedUser = await User.findByPk(dni);
    const userData = {
      dni: updatedUser.dni,
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      cellNumber: updatedUser.cellNumber,
      class: updatedUser.class
    };

    res.json({
      success: true,
      data: userData,
      message: 'Perfil actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
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

    
    const tokenData = req.user;
    if (tokenData.dni !== parseInt(dni)) {
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

    
    if (user.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    
    await User.update(
      { password: newPassword },
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

    
    const tokenData = req.user;
    if (tokenData.dni !== parseInt(dni)) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para ver estas reservas' 
      });
    }

    const reservations = await Reservations.findAll({
      where: { user_Dni: dni },
      include: [{
        model: Rooms,
        as: 'Room',
        attributes: ['Id', 'Nombre', 'Tipo', 'Tarifa']
      }],
      order: [['Id', 'DESC']]
    });

    res.json({
      success: true,
      data: reservations,
      message: 'Reservas obtenidas exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

export default router;