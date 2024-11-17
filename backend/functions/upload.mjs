// functions/qjs.mjs

// @see https://github.com/allmors/qjs/
// import qjs from 'fast-qjs/core';

export default async function (params, ctx) {
    const files = await this.db.collection('_files')
    if (ctx.method === 'POST') {
        const { file } = params
        const res = await this.files.upload(file)
        return ctx.reply.send({
            message: 'Upload successfully!',
            method: ctx.method,
            params: {
                ...res
            }
        });
    }

    // default
    if (ctx.method === 'GET') {
        const user = ctx.user
        if (!user) {
            return ctx.reply.send({
                message: 'Unauthorized',
                method: ctx.method
            }).status(401);
        }
        const list = files.find({})
        return ctx.reply.send({
            message: 'Hello from qjs API',
            method: context.method,
            params: list
        });
    }
}