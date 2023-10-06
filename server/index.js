const express=require("express");

const app=express(); 
const http=require("http");
const WebSocket=require("ws");
const server=http.createServer(app);
const wss=new WebSocket.Server({server})


let apicalls=0;
let activeusers=0


wss.on('connection',(socket)=>{
    console.log("connected to socket");

    activeusers++  //increment the user count when connection was made
    
    const cryptoUrl=new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade'); //using binance url to get real time crypto data
  
    cryptoUrl.on('error', (error) => {
        console.error("WebSocket error:", error.message);
    });

    cryptoUrl.on('message',(data)=>{
      
       if(activeusers >=1 && apicalls <3000){ //checking whether there is any active user and the api limit is upto 3000
        const CryptoData = JSON.parse(data);//data received from websockets
        if (CryptoData.e === 'trade') {
            
        const ConvertedPrice = parseFloat(CryptoData.p);//convert string to floating point
         const roundedPrice = ConvertedPrice.toFixed(2);// beautify the price value
         const cryptoPrice = roundedPrice;
        socket.send(JSON.stringify({ symbol: 'BTCUSDT', price: cryptoPrice }));
        }
    }else{
        socket.send("Your Daily limit exceeded") //for sending error message if limit exceeds
    }

    })
    socket.on('close',()=>{
        activeusers-- //it will decrement the user count while closing connection
        cryptoUrl.close();
    })
})




app.get("/",(req,res)=>{
    res.send("connection established");
})


server.listen(4000)