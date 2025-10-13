import { Services } from "../models/services.js";

// Obtener todos los servicios activos
export const getAllServices = async () => {
	try {
		const services = await Services.findAll({
			where: { isActive: true },
			order: [['createdAt', 'ASC']]
		});
		return services;
	} catch (error) {
		throw new Error(`Error al obtener servicios: ${error.message}`);
	}
};

// Obtener todos los servicios (incluyendo inactivos) - para administración
export const getAllServicesAdmin = async () => {
	try {
		const services = await Services.findAll({
			order: [['createdAt', 'ASC']]
		});
		return services;
	} catch (error) {
		throw new Error(`Error al obtener servicios para administración: ${error.message}`);
	}
};

// Obtener un servicio por ID
export const getServiceById = async (id) => {
	try {
		const service = await Services.findByPk(id);
		if (!service) {
			throw new Error('Servicio no encontrado');
		}
		return service;
	} catch (error) {
		throw new Error(`Error al obtener servicio: ${error.message}`);
	}
};

// Crear un nuevo servicio
export const createService = async (serviceData) => {
	try {
		const newService = await Services.create(serviceData);
		return newService;
	} catch (error) {
		throw new Error(`Error al crear servicio: ${error.message}`);
	}
};

// Actualizar un servicio
export const updateService = async (id, serviceData) => {
	try {
		const [updatedRowsCount] = await Services.update(serviceData, {
			where: { Id: id }
		});
		
		if (updatedRowsCount === 0) {
			throw new Error('Servicio no encontrado');
		}
		
		const updatedService = await Services.findByPk(id);
		return updatedService;
	} catch (error) {
		throw new Error(`Error al actualizar servicio: ${error.message}`);
	}
};

// Eliminar un servicio (soft delete)
export const deleteService = async (id) => {
	try {
		const [updatedRowsCount] = await Services.update(
			{ isActive: false },
			{ where: { Id: id } }
		);
		
		if (updatedRowsCount === 0) {
			throw new Error('Servicio no encontrado');
		}
		
		return { message: 'Servicio eliminado exitosamente' };
	} catch (error) {
		throw new Error(`Error al eliminar servicio: ${error.message}`);
	}
};

// Restaurar un servicio eliminado
export const restoreService = async (id) => {
	try {
		const [updatedRowsCount] = await Services.update(
			{ isActive: true },
			{ where: { Id: id } }
		);
		
		if (updatedRowsCount === 0) {
			throw new Error('Servicio no encontrado');
		}
		
		return { message: 'Servicio restaurado exitosamente' };
	} catch (error) {
		throw new Error(`Error al restaurar servicio: ${error.message}`);
	}
};

// Eliminar permanentemente un servicio
export const deleteServicePermanently = async (id) => {
	try {
		const deletedRowsCount = await Services.destroy({
			where: { Id: id }
		});
		
		if (deletedRowsCount === 0) {
			throw new Error('Servicio no encontrado');
		}
		
		return { message: 'Servicio eliminado permanentemente' };
	} catch (error) {
		throw new Error(`Error al eliminar servicio permanentemente: ${error.message}`);
	}
};