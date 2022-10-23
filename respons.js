const OkResponse = (res, data) => {
    return res
        .status(200)
        .header('Connection', 'keep-alive')
        .header('Keep-Alive', 'timeout=5')
        .header('Content-Type', 'application/json')
        .send(
            JSON.stringify({
                status: 'Success',
                message: 'Success',
                data,
            }),
        )
        .end();
};

const NotFoundResponse = (res, message) => {
    return res
        .status(404)
        .header('Connection', 'keep-alive')
        .header('Keep-Alive', 'timeout=5')
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(
            JSON.stringify({
                status: 'Not Found',
                message,
                data: {},
            }),
        )
        .end();
};

const CreatedResponse = (res, data) => {
    return res
        .status(201)
        .header('Connection', 'keep-alive')
        .header('Keep-Alive', 'timeout=5')
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(
            JSON.stringify({
                status: 'Success',
                message: 'Success',
                data,
            }),
        )
        .end();
};

const BadRequestResponse = (res, message) => {
    return res
        .status(400)
        .header('Connection', 'keep-alive')
        .header('Keep-Alive', 'timeout=5')
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(
            JSON.stringify({
                status: 'Bad Request',
                message,
                data: {},
            }),
        )
        .end();
};

export { OkResponse, NotFoundResponse, CreatedResponse, BadRequestResponse };