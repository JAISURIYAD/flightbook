var express=require('express')
var router=express.Router();
var path=require('path')
var url=require('url');
var querystring=require('querystring');
var mysql=require('mysql');
var alerts = require('alert'); 
const { allowedNodeEnvironmentFlags } = require('process');
router.use(express.static('./public'))
var passwords;
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Jaisuriyad.20cse",
    database: "flight"
  });
  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
});
router.get('/',function(req,res)
{
    res.sendFile(path.join(__dirname,'public/templates/main.html'))
})
router.get('/main.html',function(req,res)
{
    res.sendFile(path.join(__dirname,'public/templates/main.html'))
})
router.get('/signin.html',function(req,res)
{
    res.sendFile(path.join(__dirname,'public/templates/signin.html'))
})
router.get('/userlogin.html',function(req,res)
{
    res.sendFile(path.join(__dirname,'public/templates/userlogin.html'))
})
router.get('/adminlogin.html',function(req,res)
{
    res.sendFile(path.join(__dirname,'public/templates/adminlogin.html'))
})
router.get('/bookflight.html',function(req,res)
{
    res.sendFile(path.join(__dirname,'public/templates/bookflight.html'))
})
router.get('/addflight.html',function(req,res)
{
    res.sendFile(path.join(__dirname,'public/templates/addflight.html'))
})
router.get('/search.html',function(req,res)
{
    res.sendFile(path.join(__dirname,'public/templates/search.html'))
})
router.get('/adminlogindone',function(req,res)
{
    var query=url.parse(req.url).query;
   var name=querystring.parse(query)["name"]
   var password=querystring.parse(query)["pwd"]

   var qur="select * from adminlogin where '"+password+"'='suriyasathish' and '"+name+"'='jaisuriya' "; 
   con.query(qur,function(err,result)
   {
    if(err) throw err;
    else if(result!="")
    {
        alerts('login successfully')
        res.sendFile(path.join(__dirname,'public/templates/adminpage.html'))
    }
    else
    {
        alerts('incorrect username and password')
    }
   })
})
router.get('/signindone',function(req,res)
{
    var query=url.parse(req.url).query;
    var name=querystring.parse(query)['name']
    var password=querystring.parse(query)['pwd']
    var phone=querystring.parse(query)['phone']
    var email=querystring.parse(query)['email']
    var age=querystring.parse(query)['age']
    console.log(email)
    console.log(age)
    var q="insert into signin values('"+name+"','"+password+"','"+phone+"','"+email+"','"+age+"')"
    con.query(q,function(err,result)
    {
        if(err) throw err;
        console.log(result)
        allowedNodeEnvironmentFlags("signin successfully")
        res.sendFile(path.join(__dirname,'public/templates/main.html'))
    })
})
router.get('/userlogindone',function(req,res)
{
    var query=url.parse(req.url).query;
   var name=querystring.parse(query)["name"]
    passwords=querystring.parse(query)["pwd"]

   var qur="select * from signin where '"+passwords+"' in (select password from signin) and '"+name+"' in(select username from signin) "; 
   con.query(qur,function(err,result)
   {
    if(err) throw err;
    else if(result!="")
    {
        res.sendFile(path.join(__dirname,'public/templates/userpage.html'))
    }
    else if(result=="")
    {
        alerts("incorrect name and password")
    }
   })
})

router.get('/adddone',function(req,res)
{
    var query=url.parse(req.url).query;
    var flightname=querystring.parse(query)['flightname']
    var flightnumber=querystring.parse(query)['flightnumber']
    var departure=querystring.parse(query)['departure']
    var arrival=querystring.parse(query)['arrival']
    var date=querystring.parse(query)['date']
    var time=querystring.parse(query)['time']
    var q="insert into addflight values('"+flightnumber+"','"+flightname+"','"+departure+"','"+arrival+"','"+date+"','"+time+"')"
    con.query(q,function(err,result)
    {
        if(err) throw err;
        console.log(result)
        var i;
        for(i=1;i<=60;i++)
        {
        var q1="insert into flightseat values('"+flightnumber+"','"+flightname+"','"+departure+"','"+arrival+"','"+date+"','"+time+"','"+i+"')"
    con.query(q1,function(err,result1)
    {
        if(err) throw err;
        console.log(result1)
        
    })  }

        alerts("flight added successfully")
        res.sendFile(path.join(__dirname,'public/templates/addflight.html'))
    })  
})
router.get('/flightremove',function(req,res)
{
    var query=url.parse(req.url).query;
    var flightnumber=querystring.parse(query)['flightnumber']
    var q="delete from addflight where flightnumber='"+flightnumber+"'";
    con.query(q,function(err,result)
    {
        if(err) throw err;
        var q1="delete from flightseat where flightnumber='"+flightnumber+"'";
           con.query(q1,function(err,result1)
        {
            if(err) throw err;
        
        })



        alerts('flight removed successfully')
        res.sendFile(path.join(__dirname,'public/templates/addflight.html'))
    })
})
router.get('/searchdone',function(req,res)
{
    var query=url.parse(req.url).query;
    var date=querystring.parse(query)['date'];
        var qur="select * from addflight where flightdate='"+date+"'";
    con.query(qur,function(err,result)
    {
        if(err) throw err;
        else if(result!="")
        {
               console.log(result)
                res.render('searching',{title:'sending result',action:'list',rows:result});
            
        }
        else{
            alerts("Flight not available this particular date")
        }
    })
})
router.get('/bookdone',function(req,res)
{
    var query=url.parse(req.url).query;
    var passengername=querystring.parse(query)['name']
    var source=querystring.parse(query)['source']
    var destination=querystring.parse(query)['destination']
    var date=querystring.parse(query)['date']
    var time=querystring.parse(query)['time']
    var seatno=querystring.parse(query)['seat']
    var q="select distinct flightname from flightseat where flightdata in (select flightdata from flightseat where flightdata='"+date+"') and '"+source+"' in (select departure from flightseat where flightdata='"+date+"') and '"+destination+"' in (select arrival from flightseat where flightdata='"+date+"') and '"+time+"' in (select timing from flightseat where flightdata='"+date+"') and '"+seatno+"' in(select seatno from flightseat where flightdata='"+date+"')"
    con.query(q,function(err,result)
    {
        if(err) throw err;
        else if(result!="")
        {
            if(result.length > 0){
                console.log(result[0].flightname);
                flightnames = result[0].flightname;
           }
            console.log(passwords)
            var q1="insert into booking values('"+passwords+"','"+passengername+"','"+source+"','"+destination+"','"+date+"','"+time+"','"+seatno+"','"+flightnames+"')"
            con.query(q1,function(err,result1)
            {
                if(err) throw err;
                console.log(result1)
                var q2="delete from flightseat where seatno='"+seatno+"'";
                con.query(q2,function(err,result2)
                {
                    if(err) throw err;
                    console.log(result2)
                    res.sendFile(path.join(__dirname,'public/templates/userlogin.html'))
                })  
                
            })  
            alerts('Successfully booked')
        }
        else{
            alerts("Chosse the avilability of seats,date and places")
        }
    })  
})
router.get('/mybooking.html',function(req,res)
{
    var query=url.parse(req.url).query;
    var date=querystring.parse(query)['date'];
        var qur="select * from booking where password='"+passwords+"'";
    con.query(qur,function(err,result)
    {
        if(err) throw err;
        else if(result!="")
        {
               console.log(result)
                res.render('mybookings',{title:'sending result',action:'list',rows:result});
            
        }
        else{
            alerts("My booking not available")
        }
    })
})

router.get('/allbooking.html',function(req,res)
{
    var query=url.parse(req.url).query;
    var date=querystring.parse(query)['date'];
        var qur="select * from booking";
    con.query(qur,function(err,result)
    {
        if(err) throw err;
        else if(result!="")
        {
               console.log(result)
                res.render('allbookings',{title:'sending result',action:'list',rows:result});
            
        }
        else{
            alerts("All booking not available")
        }
    })
})
module.exports=router;