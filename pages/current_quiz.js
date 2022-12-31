import React from "react";
import { useRecoilValue } from "recoil";
import { quiz_atom }from "../atoms/atoms"

export default function current_quiz(){

    const current_quiz = useRecoilValue(quiz_atom)

    const show_quiz = () => {
       const qa =[]
       current_quiz.map(question => {
            qa.push(
                <div class="container" style={{"fontSize":"120%", "marginTop":"4%"}}>
                        <div class="row">
                        <div class="col-2"  style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Question: </span></div>
                        <div class="col-10"  style={{"border":"3px solid orange","padding":"1.5%"}} onInput={e => {console.log(e.target.innerHTML)}}> {question['question']}</div>
                        <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Answer: </span></div>
                        <div class="col-10"  style={{"border":"3px solid orange","padding":"1.5%"}}>{question['answer']}</div>
                        <div class="col-12" style={{"border":"3px solid orange","padding":"1.5%", "display":"flex", "justifyContent":"space-between"}}> 
                        <button type="button" class="btn btn-warning"> Delete question from Quiz</button>
                            {/* <button type="button" class="btn btn-warning">Delete Question</button> */}
                        </div>
                        {/* <EditText
                            name='textbox3'
                            defaultValue={question['Question']}
                            editButtonProps={{ style: { marginLeft: '5px', width: 16 } }}
                            showEditButton
                        />
                        <EditText
                            name='textbox3'
                            defaultValue={question['Answer']}
                            editButtonProps={{ style: { marginLeft: '5px', width: 16 } }}
                            showEditButton
                        /> */}
                        {/* <div className = 'tasks-container'>
                <div contenteditable="true" onInput={e => editTask(item.id, e.currentTarget.textContent)} >
                    {item.chore}
                </div> */}
                    </div> 
                    
                    </div>
         

            )


       })

        return qa 
    }

    return (
        <>{show_quiz()}</>
    )
}