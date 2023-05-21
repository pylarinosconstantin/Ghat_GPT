import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
const App = () => {
const [value, setValue] = useState("")
const [message, setMesssage]= useState(null)
const [previousChats, setPreviousChats]= useState([])
const [currentTitle, setCurrentTitle]= useState(null)


const createNewChat=()=>{
  setMesssage(null)
  setValue("")
  setCurrentTitle(null)
}


const handleClick=(uniqueTitle)=> {
  setCurrentTitle(uniqueTitle)
  setMesssage(null)
  setValue("")
}

  const getMessages = async () =>{
    const options={
      method:"POST",
      body : JSON.stringify({
          message: value
      }),
      headers: {
        "Content-Type":"application/json"
      }
    }
    try{
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMesssage(data.choices[0].message)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=> {

console.log(currentTitle, value, message)
if(!currentTitle && value && message){
  setCurrentTitle(value)
}
if(currentTitle && value && message ){
  setPreviousChats(prevChats =>(
  [...prevChats, 
    {
      title:currentTitle,
      role:"user",
      content:value
    },
    {
      title:currentTitle,
      role:message.role,
      content:message.content
    }
  ]

  ))
}
  },[message, currentTitle])
  console.log(previousChats)

  const currentChat= previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set( previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
         {uniqueTitles?.map((uniqueTitle, index)=> <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul> 
        <nav>
          <center>
          <p>Developed by <br></br><b>Pylarinos Constantin</b></p>
          </center>
        </nav>
      </section>
      <section className="main">
      {!currentTitle && <h1>Care2Share GPT</h1>}
      <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>

            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
      </ul>
      <div className="bottom-section">
        <div className="input-container">
          <input value={value} onChange={(e) => setValue(e.target.value)}></input>
          <div id="submit" onClick={getMessages}><FontAwesomeIcon icon={faPaperPlane}/></div>
        </div>
        <p className="info">
          C2S is a smart social networking 
          platform where you can find out everything.
        </p>
      </div>
      </section>
    </div>
  )
}

export default App;
