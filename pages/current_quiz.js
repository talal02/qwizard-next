import React from "react";
import { useRecoilValue } from "recoil";
import { quiz_atom }from "../atoms/atoms"

export default function current_quiz(){

    const current_quiz = useRecoilValue(quiz_atom)

    const show_quiz = () => {
       const qa =[]
       current_quiz.map(question => {
            if(Object.keys(question).length == 2){
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
                           
                        </div> 
                        
                        </div>
             
    
                )
            }
            else{
                qa.push(
                    <div class="container" style={{"fontSize":"120%", "marginTop":"4%"}}>
                        <div class="row">
                            <div class="col-2"  style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Question: </span></div>
                            <div class="col-10"  style={{"border":"3px solid orange","padding":"1.5%"}} onInput={e => {console.log(e.target.innerHTML)}}> {question['question']}</div>
                            <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Option 1: </span></div>
                            <div class="col-10"  style={{"border":"3px solid orange","padding":"1.5%"}}>{question['option1']}</div>
                            <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Option 2: </span></div>
                            <div class="col-10"  style={{"border":"3px solid orange","padding":"1.5%"}}>{question['option2']}</div>
                            <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Option 3: </span></div>
                            <div class="col-10"  style={{"border":"3px solid orange","padding":"1.5%"}}>{question['option3']}</div>
                            <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Option 4: </span></div>
                            <div class="col-10"  style={{"border":"3px solid orange","padding":"1.5%"}}>{question['option4']}</div>
                            <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Answer: </span></div>
                            <div class="col-10"  style={{"border":"3px solid orange","padding":"1.5%"}}>{question['answer']}</div>
                            <div class="col-12" style={{"border":"3px solid orange","padding":"1.5%", "display":"flex", "justifyContent":"space-between"}}>   
                            <button type="button" class="btn btn-warning"> Delete question from Quiz</button>
                                {/* <button type="button" class="btn btn-warning">Delete Question</button> */}
                            </div>
                        </div> 
                    </div>
                )
            }
           
       })

        return qa 
    }

    return (
        <>{show_quiz()}</>
    )
}