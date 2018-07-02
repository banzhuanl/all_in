var baseComponent = require('../prototype/baseComponent');
var bookModel = require('../models/book');

class book extends baseComponent{
    constructor(){
        super()
        this.getBoy = this.getBoy.bind(this);
        this.getGirl = this.getGirl.bind(this);
        this.getPub = this.getPub.bind(this);
    }
    async getBoy(req,res,next){
        try{
            const books = await bookModel.find({for:'boy'},null,{limit:6});
            const tag = await bookModel.distinct('type',{for: 'boy'});
            if(!books){
                throw new Error('no books');
            }else {
                //res.setHeader("Content-Type", "text/html");
                res.setHeader('content-type','application/json');
                res.send({data: books,tags:tag});
            }
        }catch(err){
            res.send({
                status: 0,
                type: 'GET_book_error',
                message: err.message,
            });
        }
    }
    async getGirl(req,res,next){
        try{
            const books = await bookModel.find({for:'girl'},null,{limit:6});
            const tag = await bookModel.distinct('type',{for: 'girl'});
            if(!books){
                throw new Error('no books');
            }else {
                res.setHeader('content-type','application/json');
                res.send({data: books,tags:tag});
            }
        }catch(err){
            res.send({
                status: 0,
                type: 'GET_book_error',
                message: err.message,
            });
        }
    }
    async getPub(req,res,next){
        try{
            const books = await bookModel.find({for:'pub'},null,{limit:6});
            const tag = await bookModel.distinct('type',{for: 'pub'});
            if(!books){
                throw new Error('no books');
            }else {
                res.setHeader('content-type','application/json');
                res.send({data: books,tags:tag});
            }
        }catch(err){
            res.send({
                status: 0,
                type: 'GET_book_error',
                message: err.message,
            });
        }
    }
}
module.exports = new book();