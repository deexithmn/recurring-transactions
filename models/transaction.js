var mongoose = require("mongoose");

var TransactionSchema = new mongoose.Schema(
{
    trans_id:String,
    user_id:String,
    name:String,
    amount:Number,
    date:Date
});

var Transaction = mongoose.model("Transaction",TransactionSchema);

module.exports = Transaction;
