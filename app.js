var express=require('express')
var url=require('url');
var querystring=require('querystring')
var app=express()
var path=require('path')
var mysql=require('mysql')
var routing=require('./routing.js')
app.set("view engine","ejs")
app.set("views",path.resolve(__dirname,'./views'))
app.use('/',routing);
app.listen(8070);