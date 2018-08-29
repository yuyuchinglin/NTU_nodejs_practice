module.exports=3;

/*
    http://主機名稱/路徑?參數列表
    參數列表：參數名稱=參數資料&參數名稱=參數資料&....
    ex. http://localhost:3000/image?name=landscape.jpg

    使用路徑做出彈性
    http://localhost:3000/img/landscape.jpg
*/

//處理路徑 /image 的要求

app.get("/pic/:name",function(req,res){  //取得request何Response物件
    //使用 req.params.參數名稱 取得路徑參數
    let name = req.params.name;
    res.download("./"+name);
});

app.get("/img/*",function(req,res){  //取得request何Response物件
//res.download("./landscape.jpg"); //利用set設定responses header
    //使用 req.query.參數名稱 取得HTTP參數
    let path = req.path;
    let name = path.replace("/img/","")
    res.download("./"+name);
});

//處理路徑 /image 的要求
app.get("/image",function(req,res){  //取得request何Response物件
//res.download("./landscape.jpg"); //利用set設定responses header
    //使用 req.query.參數名稱 取得HTTP參數
    let name = req.query.name;
    res.download("./"+name);
});

//處理路徑 / 的要求
app.get("/",function(req,res){  //取得request何Response物件
//res.set("test","my header"); //利用set設定responses header
//let obj={x:3,y:4}; 
//res.send(obj);
res.send("<h3>image</h3><img src='/img/landscape.jpg' />");
//取得連線的資訊
console.log(req.method); //連線的方法
console.log(req.ip); //用戶的ip v6
console.log(req.hostname); //連線的主機名稱

let lang = req.get("Accept-Language");
console.log(lang);
});

//處理路徑 /test 的要求
app.get("/test",function(req,res){
res.send("Hello Test");
});


app.post("/save",function(req,res){ 
    let name = req.body.name;
    let time = (new Date()).getTime();
    // 將資料存進資料庫
    // 取得路徑參考
    let ref = database.ref("/name");
    // 操作資料
    ref.set({name:name, time:time
    }, function(error){
        if(error){
            res.send("Error");
        }else{
            res.send("OK");
        }
    })
    });


    app.get("/update",function(req,res){ 
        let time = (new Date()).getTime();
        // 將資料存進資料庫
        // 取得路徑參考
        let ref = database.ref("/name");
        // 操作資料
        ref.update({ time:time
        }, function(error){
            if(error){
                res.send("Error");
            }else{
                res.send("OK");
            }
        })
        });