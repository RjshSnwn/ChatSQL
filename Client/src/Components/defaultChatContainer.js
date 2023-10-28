import React from 'react'
import "./Components.css"
import { SiRobotframework } from 'react-icons/si';

function DefaultChatContainer({getDefaultQuestion}) {
  return (
    <article className='defaultChart'>
      <p className='Message botDefaultMessage'><SiRobotframework className='messageIcons'/><span>Hello, How can i help you?</span></p>
      {/* <SiRobotframework/>  */}
      <div className='questionContainer'>
        <div className='questionSet1'>
          <div onClick={()=>{ getDefaultQuestion("which product has the highest net amount, return the amount as well?")}}>which product has the highest net amount, return the amount as well?</div>
          <div onClick={()=>{ getDefaultQuestion("What is distributor city and state for distributor?")}}>What is distributor city and state for distributor ?</div>
          </div>
          <div className='questionSet2'>
          <div onClick={()=>{ getDefaultQuestion("what is the zone code and zone name for the sales person?")}}>what is the zone code and zone name for the sales person?</div>
          <div onClick={()=>{ getDefaultQuestion("Give me 5 customer names from Punjab with their city name?")}}>Give me 5 customer names from Punjab with their city name?</div>
          </div>

      </div>
    </article>
  )
}

export default DefaultChatContainer