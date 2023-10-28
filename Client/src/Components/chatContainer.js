import React from "react";
import { SiRobotframework } from "react-icons/si";
import { FiUser } from "react-icons/fi";

function ChatContainer({ chatBotResponse }) {
  console.log("chatBotResponse:-:", chatBotResponse);
  return (
    <>
      {chatBotResponse &&
        chatBotResponse.map((item) => {
          const { bot, user } = item;
          let botKeys;
          if (Array.isArray(bot)) {
            botKeys = Object.keys(bot[0]).filter((item)=>
            {
                if(isNaN(item) === true){
                  return item
                }
            });
          }
          console.log("bot message:-", bot);
          console.log("type of bot message:-", typeof bot);
          return (
            <div className="chatContainerMessageRes">
              <p className="Message usermsg">
                <div className="messageIconContainer">
                  <FiUser className="useIconn"/>
                </div>

                <span>{user}</span>
              </p>
              {bot && bot.length > 0 && typeof bot === "string" ? (
                <div className="Message botMessage">
                  <div className="userIcon">
                    <SiRobotframework className="messageIcons" />
                  </div>
                  <div className="botMsgContainer">
                    <span className="messageContainer">{bot}</span>
                  </div>
                </div>
              ) : bot && bot.length > 0 && Array.isArray(bot) ? (
                <p className="Message botMessage loading">
                  <div className="messageIconContainer">
                    <SiRobotframework className="messageIcons" />
                  </div>
                  <div className="tableContainer">
                    <thead>
                      <tr>
                        {botKeys.map((item) => {
                          console.log("item:-", item);
                          return <th>{item}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {bot.map((item, index) => {
                        return (
                          <tr key={index}>
                            {botKeys.map((key) => {
                              return <td key={key}>{item[key]}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </div>
                </p>
              ) : (
                <p className="Message botMessage loading">
                  <SiRobotframework className="messageIcons" />
                  <span>Loading....</span>
                </p>
              )}
            </div>
          );
        })}
    </>
  );
}

export default ChatContainer;
