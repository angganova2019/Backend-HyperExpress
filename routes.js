import { Router } from 'hyper-express';
import { createActivity, deleteActivity, getActivity, getOneActivity, updateActivity } from "./handlerActivity.js";
import { createTodo, deleteTodo, getOneTodo, getTodo, updateTodo } from './handlerTodo.js';
const api_router = new Router();

api_router.get('/activity-groups', getActivity);
api_router.get('/activity-groups/:id', getOneActivity);
api_router.post('/activity-groups', createActivity);
api_router.patch('/activity-groups/:id', updateActivity);
api_router.delete('/activity-groups/:id', deleteActivity);

api_router.get('/todo-items', getTodo);
api_router.get('/todo-items/:id', getOneTodo);
api_router.post('/todo-items', createTodo);
api_router.patch('/todo-items/:id', updateTodo);
api_router.delete('/todo-items/:id', deleteTodo);

export { api_router };