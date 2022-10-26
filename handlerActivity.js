import { DataTypes } from 'sequelize';
import { db } from './mysql.config.js';
import { BadRequestResponse, CreatedResponse, NotFoundResponse, OkResponse } from './respons.js';

const Activity = db.define('activities', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING
    },
},
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        deletedAt: 'deleted_at',
    });

const getActivity = async (request, response) => {
    try {
        const result = await Activity.findAll({ raw: true, limit: 10 });
        return OkResponse(response, result);
    } catch (error) {
    }
};

const getOneActivity = async (request, response) => {
    const { id } = request.path_parameters;
    const result = await Activity.findOne({ where: { id } });
    if (result === null) {
        return NotFoundResponse(response, `Activity with ID ${id} Not Found`);
    }
    return OkResponse(response, { id: result.id, title: result.title, email: result.email });
};

const createActivity = async (request, response) => {
    try {
        const { title = null, email = null } = await request.json();
        if (!email) {
            return BadRequestResponse(response, 'email cannot be null');
        }
        if (!title) {
            return BadRequestResponse(response, 'title cannot be null');
        }
        const result = await Activity.create({ email, title });
        return CreatedResponse(response, { id: result.id, email: result.email, title: result.title });
    } catch (error) {
    }
};

const updateActivity = async (request, response) => {
    const { id } = request.path_parameters;
    const data = await request.json();

    const result = await Activity.findOne({ where: { id } });
    if (result === null) {
        return NotFoundResponse(response, `Activity with ID ${id} Not Found`);
    }
    await result.update({ ...data });
    return OkResponse(response, { id: result.id, title: result.title, email: result.email });
};

const deleteActivity = async (request, response) => {
    const { id } = request.path_parameters;
    const result = await Activity.destroy({ where: { id } });
    if (result === 0) {
        return NotFoundResponse(response, `Activity with ID ${id} Not Found`);
    }
    return OkResponse(response, {});
};

export { db as dbactivity, getActivity, getOneActivity, createActivity, updateActivity, deleteActivity };