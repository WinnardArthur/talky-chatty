const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    
    if (!content || !chatId) {
        return res.status(400).json({message: "Invalid data passed into request"})
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message 
        });

        res.json(message)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
} 

exports.allMessages = async (req, res) => {
    try {
        const messages = await Message.find({chat: req.parms.chatId}).populate(
            "sender", "name pic email"
            ).populate('chat');

            res.status(200).json(messages)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}