import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import DefaultChatContainer from "../Components/defaultChatContainer";
import ChatContainer from "../Components/chatContainer";
import Navbar from "../Components/Navbar";

function Home() {
  const [question, setQuestion] = useState("");
  const [showDefault, setShowDefault] = useState(false);
  const [chatBotResponse, setChatBotResponse] = useState([]);

  const handleSubmit = async (defaultQuestion) => {
    setQuestion("");
    console.log("question:-", question);
    const userQuestion = defaultQuestion && defaultQuestion.length > 0 ? defaultQuestion : question
    setChatBotResponse([
      ...chatBotResponse,
      {
        bot: "",
        user: userQuestion,
      },
    ]);
    if (userQuestion && userQuestion.length > 0) {
      const url = "http://127.0.0.1:5000/question";
      setShowDefault(true);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      });

      if (res.ok) {
        const botRes = await res.json();
        console.log("botRes:-", botRes);
        setChatBotResponse([
          ...chatBotResponse,
          {
            bot: botRes.result,
            user: userQuestion,
          },
        ]);
      }
    //  setQuestion("");
    } else {
      alert("Please Ask a vaild question!");
    }
  };

  const  getDefaultQuestion =  async (defaultQuestion) =>{
    console.log("defaultQuestion:-",defaultQuestion)
    handleSubmit(defaultQuestion)
   }
  
   console.log("question:-",question)
  return (
    <div className="Container">
      <Navbar />
      <article className="homeContainer">
        <section className="innerContainer">
          <div className="mainChatContainer">
            <section className="chatBoxContainer">
              {showDefault === false ? (
                <DefaultChatContainer getDefaultQuestion={getDefaultQuestion}/>
              ) : (
                <ChatContainer chatBotResponse={chatBotResponse} />
              )}
            </section>
            <div className="inputBoxOuterContainer">
              <div className="inputBoxContainer">
                <input
                  className="inputBox"
                  type="text"
                  placeholder="What do you want from the Database?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === "Enter"){ 
                      handleSubmit()
                    };
                  }}
                />
                <div className="iconContainer">
                  <AiOutlineSend
                    className="sendIcon"
                    size={20}
                    onClick={() => handleSubmit()}
                  />
                </div>
              </div>
              <div className="footerContainer">
                <p></p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}

export default Home;
