//載入express套件
let express = require("express");
let parser = require("body-parser");
//建立application物件
let app = express();

// 建立靜態網站空間
// 將專案資料夾中的public子資料夾，直接對應到網址上
/*
 例如：
 專案資料夾/public/test.html
 http://localhost:3000/test.html

 專案資料夾/public/landscape.jpg
 http://localhost:3000/landscape.jpg
*/
app.use(express.static('public'));
app.use(parser.urlencoded({extended:true}));
// Express 中介函式
// app.use(function(req,res,next){
//     console.log("Middleware1");
//     next();
//})

// 使用get處理路徑/calculate
// app.get("/calculate",function(req,res){
//     let num = req.query.number;
//     let result = num*num;
//     res.send("Answer: "+result);
// });

// 使用post處理路徑/calculate
app.post("/calculate",function(req,res){
    let num = req.body.number;
    let result = num*num;
    res.send("Answer: "+result);
});

//get用query，post用body接參數
//get
//req.query.參數名稱
//post
//使用body-parser套件做預先處理
//req.body.參數名稱

//Express路徑參數
//req.params.參數名稱


app.get("/",function(req,res){ 
    res.send("Hello Middleware");
    });
    
//啟動網頁伺服器在 http://localhost:3000/
app.listen(3000, function(){
    console.log("Server Started");
});


//在firebase上新增專案
//npm安裝firebase套件

//初始化firebase
//https://console.firebase.google.com/u/0/project/ntu-node-js/settings/serviceaccounts/adminsdk
let admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ntu-node-js.firebaseio.com"
});

//建立和資料庫的連線
let database = admin.database();


//處理post方法的路徑
app.post("/signup",function(req,res){ 
    let name = req.body.name;
    let account = req.body.account;
    let password = req.body.password;
    let time = (new Date()).getTime(); //1970.1.1到現在過了幾個毫秒
    // 將使用者加入資料庫

    // 將資料存進資料庫
    // 取得路徑參考
    let ref = database.ref("/users");
    // 操作資料
    ref.push({name:name, account:account, password:password, time:time
    }, function(error){
        if(error){
            res.send("Error");
        }else{
            res.send("OK");
        }
    })
    });


//處理post方法的路徑
app.post("/signin",function(req,res){ 
    let account = req.body.account;
    let password = req.body.password;
    //從吃料庫抓取資料來檢查
    let ref = database.ref("/users");
    //on會聆聽資料
    ref.orderByChild("account").equalTo(account).once("value", function(snapshot){
        let data=[];
        snapshot.forEach(function(userSnapshot){
            let value = userSnapshot.val();
            value.key = userSnapshot.key;
            data.push(value);
        });
        //從資料中比對密碼
        let user= data.find(function(item){
            return item.password===password;
        });
        
        if(user){
            updateUserTime(user.key);
            res.send(user);
        }else{
            res.send("Failed");
        }
       
    });
    });

    function updateUserTime(key){
        let time = (new Date()).getTime();
        let ref = database.ref("/users/"+key);
        ref.update({
            time:time
        },function(){}); 
    }



    //使用post方法處理路徑/post
    app.post("/post",function(req,res){
        let name = req.body.name;
        let content = req.body.content;
        let time = (new Date()).getTime();
        //放進資料庫
        let ref = database.ref("/messages");
        ref.push({name:name, content:content, time:time
        }, function(error){
            if(error){
                res.send("Error");
            }else{
                res.send("OK");
            }
        })
    });


    app.get("/get",function(req,res){
        let time = parseInt(req.query.time);
        let ref = database.ref("/messages");
        ref.orderByChild("time").startAt(time).once("value",function(snapshot){
            let data=[];
            snapshot.forEach(function(messageSnapshot){
                data.push(messageSnapshot.val());
            });
            res.send(data);
        });
    });