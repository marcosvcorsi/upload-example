const Post = require('../models/Post');

module.exports = {
    async create(req, res) {
        const { originalname: name, size, filename: key } = req.file;

        const post = await Post.create({
            name,
            size,
            key,
            url: ''
        })

        return res.json(post);
    },

    async index(req, res) {
        const posts = await Post.find();

        return res.send(posts);
    },

    async delete(req, res) {
        const { id } = req.params;

        await Post.deleteOne({ _id: id })

        res.send();
    }
}