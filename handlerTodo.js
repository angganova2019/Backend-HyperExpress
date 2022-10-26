import { DataTypes } from 'sequelize';
import { db } from './mysql.config.js';
import { BadRequestResponse, CreatedResponse, NotFoundResponse, OkResponse } from './respons.js';

const Todo = db.define('todos', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    activity_group_id: {
        type: DataTypes.INTEGER
    },
    title: {
        type: DataTypes.STRING
    },
    is_active: {
        type: DataTypes.STRING
    },
    priority: {
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

const getTodo = async (request, response) => {
    const { activity_group_id = '' } = request.query_parameters;
    if (activity_group_id) {
        try {
            const result = await Todo.findAll({ where: { activity_group_id }, raw: true, limit: 10 });
            return OkResponse(response, result);
        } catch (error) {
        }
    } else {
        try {
            const result = await Todo.findAll({ raw: true, limit: 10 });
            return OkResponse(response, result);
        } catch (error) {
        }
    }
};

const getOneTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const result = await Todo.findByPk(id, { raw: true });
    if (result === null) {
        return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
    }
    return OkResponse(response, { id: result.id, activity_group_id: result.activity_group_id, title: result.title, is_active: result.is_active, priority: result.priority });
};

const createTodo = async (request, response) => {
    try {
        const { activity_group_id = '', title = '', is_active = 1, priority = 'very-high' } = await request.json();
        if (!activity_group_id) {
            return BadRequestResponse(response, 'activity_group_id cannot be null');
        } else if (!title) {
            return BadRequestResponse(response, 'title cannot be null');
        }
        const result = await Todo.create({ activity_group_id, title, is_active, priority, });
        return CreatedResponse(response, {
            id: result.id,
            activity_group_id: result.activity_group_id,
            title: result.title,
            is_active: !!result.is_active,
            priority: result.priority,
        });
    } catch (error) {
    }
};

const updateTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const data = await request.json();

    const result = await Todo.findOne({ where: { id } });
    if (result === null) {
        return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
    }
    await result.update({ ...data });
    return OkResponse(response, {
        title: result.title,
        is_active: result.is_active,
        priority: result.priority
    });
};

const deleteTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const result = await Todo.destroy({ where: { id } });
    if (result === 0) {
        return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
    }
    return OkResponse(response, {});
};

export { db as dbtodo, getTodo, getOneTodo, createTodo, updateTodo, deleteTodo };