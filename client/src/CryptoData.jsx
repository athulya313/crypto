import React, { useEffect, useState } from 'react';

function CryptoData() {
  const [priceData, setPriceData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [allprice,setAllPrice]=useState([])

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');   // initializing socket connection
    socket.onopen = () => {
      setConnectionStatus('Connection established');  //establishing connection
    };

    socket.onmessage = (event) => {
      try {
        //console.log('Received data:', event.data);
        const data = JSON.parse(event.data);
        if (data.symbol && data.price) {
          setPriceData(data);//setting latest price

          setAllPrice((prevPrice)=>[...prevPrice,data.price]) //setting all the previous values
        } else {
          console.error('Data missing symbol or price', data);
        }
      } catch (error) {
        console.error('Error parsing received data:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error occured:', error.message);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error('WebSocket connection closed unexpectedly');
      }
      setConnectionStatus('Disconnected');
    };

    return () => {
      socket.close();
    };
  }, []); 

  return (
    <div style={{textAlign: 'center', fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',padding: '30px',
      borderRadius: '10px',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    }}>
    <h1 style={{color:'orange'}}>Latest Price from Binance</h1>
    <p>Connection Status: {connectionStatus}</p>
    {priceData && (
      <div>
        <p>Symbol: {priceData.symbol}</p>
        <p> Latest Price BTC: <span style={{ color: 'orange', fontSize: '20px', fontWeight: 'bold' }}>
              ${priceData.price}</span></p>
      
      </div>
    )}

    <div><h2 style={{color:'orange'}}>Previous Price List</h2>
      <ul style={{ listStyleType: 'none' }}>
        {allprice.map((price,index)=>(
          <li key={index} >${price}</li>
        ))}
      </ul>

    </div>
  </div>

  );
}

export default CryptoData;













