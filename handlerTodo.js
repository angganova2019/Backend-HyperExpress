import { db } from './mysql.config.js';
import { BadRequestResponse, CreatedResponse, NotFoundResponse, OkResponse } from './respons.js';


const getTodo = async (request, response) => {
    const { activity_group_id = '' } = request.query_parameters;
    let q = db.select('id', 'activity_group_id', 'title', 'is_active', 'priority').from('todos');
    if (activity_group_id) {
        q.where({
            activity_group_id
        });
    }
    const result = await q.limit(10);
    return OkResponse(response, result);
};

const getOneTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const result = await db.select('id', 'activity_group_id', 'title', 'is_active', 'priority').from('todos').where({ id });
    if (result.length === 0) {
        return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
    }
    return OkResponse(response, result[0]);
};

const createTodo = async (request, response) => {
    const { activity_group_id = '', title = '', is_active = 1, priority = 'very-high' } = await request.json();
    if (!activity_group_id) {
        return BadRequestResponse(response, 'activity_group_id cannot be null');
    } else if (!title) {
        return BadRequestResponse(response, 'title cannot be null');
    }
    const [id] = await db('todos').insert({ activity_group_id, title, is_active, priority, });
    const result = {
        id,
        activity_group_id,
        title,
        is_active: !!is_active,
        priority,
    };
    return CreatedResponse(response, result);
};

const updateTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const data = await request.json();
    await db('todos').where({ id }).update({ ...data });
    const result = await db.select('id', 'activity_group_id', 'title', 'is_active', 'priority').from('todos').where({ id });
    if (result.length === 0) {
        return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
    }
    return OkResponse(response, result[0]);
};

const deleteTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const result = await db('todos').where({ id }).delete();
    if (!result) {
        return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
    }
    return OkResponse(response, {});
};

export { getTodo, getOneTodo, createTodo, updateTodo, deleteTodo };