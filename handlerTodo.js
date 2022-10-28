import { cache } from './caching.js';
import { db } from './mysql.config.js';
import { BadRequestResponse, CreatedResponse, NotFoundResponse, OkResponse } from './respons.js';

const caching = cache;

const getTodo = async (request, response) => {
    const { activity_group_id = '' } = request.query_parameters;
    const key = activity_group_id ? `todos-${activity_group_id}` : 'todos';
    let reply = caching.get(key);
    if (!reply) {
        let q = db.select('id', 'activity_group_id', 'title', 'is_active', 'priority').from('todos');
        if (activity_group_id) {
            q.where({
                activity_group_id
            });
        }
        reply = await q.limit(10);
        caching.set(key, reply);
    }
    return OkResponse(response, reply);
};

const getOneTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const key = `todos-${id}`;
    let reply = caching.get(key);
    if(!reply) {
        reply = await db.select('id', 'activity_group_id', 'title', 'is_active', 'priority').from('todos').where({ id }).first();
        if (!reply) {
            return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
        }
        caching.set(key, reply);
    }
    return OkResponse(response, reply);
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
    caching.set(`todos-${id}`, result);
    caching.del('todos');
    return CreatedResponse(response, result);
};

const updateTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const data = await request.json();
    await db('todos').where({ id }).update({ ...data });
    const result = await db.select('id', 'activity_group_id', 'title', 'is_active', 'priority').from('todos').where({ id }).first();
    if(!result){
        return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
    }
    caching.set(`todos-${id}`, result);
    caching.del('todos');
    return OkResponse(response, result);
};

const deleteTodo = async (request, response) => {
    const { id } = request.path_parameters;
    const result = await db('todos').where({ id }).delete();
    if (!result) {
        return NotFoundResponse(response, `Todo with ID ${id} Not Found`);
    }
    caching.del(`todos-${id}`);
    caching.del('todos');
    return OkResponse(response, {});
};

export { getTodo, getOneTodo, createTodo, updateTodo, deleteTodo };