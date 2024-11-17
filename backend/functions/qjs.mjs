// @see https://github.com/allmors/qjs/
import qjs from 'fast-qjs/core';

export default async function (params, ctx) {
    const User = await qjs.db.collection('user');
    const user = await User.insertOne({ name: "Sam", email: 'sam@codingsamrat.com' })

    // or 

    // const User = await this.db.collection('user');
    // ......

    return ctx.reply.send({
        message: 'Hello from qjs API',
        method: ctx.method,
        result: {
            ...user
        }
    });
}
