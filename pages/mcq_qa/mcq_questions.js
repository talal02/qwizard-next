import { useEffect } from "react"
import { useState } from "react"
import { ThreeCircles } from "react-loader-spinner"
import Swal from "sweetalert2"
import {  useRecoilState } from "recoil"
import { quiz_atom } from "../../atoms/atoms"
import axios from "axios"

export default function MCQ_Questions(props){
    const question_url = "http://localhost:8080/"
    const context = props.content
    //const context = "I write code to build our final year project. It is a bit tough but I am enjoying it. I plan to work for another 30 minutes and then I will sleep."
    const [Questions,setQuestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [quiz, setQuiz] = useRecoilState(quiz_atom)


    useEffect(()=> {
        axios.post(question_url+'generate_mcqs', {"content": context}).then(res => {
            setQuestions(res.data)
            console.log(res)
            setLoading(false)
        })
        setLoading(true)
    },[])

    const saveQuestion = (index) => {
        const q = document.getElementById('q'+String(index)).innerHTML
        const op1 = document.getElementById('op1'+String(index)).innerHTML
        const op2 = document.getElementById('op2'+String(index)).innerHTML
        const op3 = document.getElementById('op3'+String(index)).innerHTML
        const op4 = document.getElementById('op4'+String(index)).innerHTML
        const a = document.getElementById('a'+String(index)).innerHTML
        const pair = {'question': q, 'option1':op1, 'option2':op2, 'option3':op3, 'option4':op4, 'answer': a}
        setQuiz((current) => [...current, pair])
        console.log(quiz)
        Swal.fire(
            'Question saved to quiz'
          )
    }

    const showQuestions = () => {
        console.log('Questions-->', Questions)
        const question_arr =[]
        Questions.map((question, index) => {
        
            question_arr.push(
                <div class="container" style={{"fontSize":"120%", "marginTop":"4%"}}>
                    <div class="row">
                        <div class="col-2"  style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Question: </span></div>
                        <div class="col-10" id={'q'+String(index)} contentEditable="true" style={{"border":"3px solid orange","padding":"1.5%"}} onInput={e => {console.log(e.target.innerHTML)}}> {question['Question']}</div>
                        <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Option 1: </span></div>
                        <div class="col-10" id={'op1'+String(index)}contentEditable="true" style={{"border":"3px solid orange","padding":"1.5%"}}>{question['Options'][0]}</div>
                        <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Option 2: </span></div>
                        <div class="col-10" id={'op2'+String(index)}contentEditable="true" style={{"border":"3px solid orange","padding":"1.5%"}}>{question['Options'][1]}</div>
                        <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Option 3: </span></div>
                        <div class="col-10" id={'op3'+String(index)}contentEditable="true" style={{"border":"3px solid orange","padding":"1.5%"}}>{question['Options'][2]}</div>
                        <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Option 4: </span></div>
                        <div class="col-10" id={'op4'+String(index)}contentEditable="true" style={{"border":"3px solid orange","padding":"1.5%"}}>{question['Options'][3]}</div>
                        <div class="col-2" style={{"border":"3px solid orange","padding":"1.5%"}}><span style={{'color':'brown'}}>Answer: </span></div>
                        <div class="col-10" id={'a'+String(index)}contentEditable="true" style={{"border":"3px solid orange","padding":"1.5%"}}>{question['Answer']}</div>
                        <div class="col-12" style={{"border":"3px solid orange","padding":"1.5%", "display":"flex", "justifyContent":"space-between"}}>   
                        <button type="button" class="btn btn-primary" onClick={ () => saveQuestion(index)}>Save Question to Quiz</button>
                            {/* <button type="button" class="btn btn-warning">Delete Question</button> */}
                        </div> 
                    </div> 
                </div>
            )
                   
        
        })
        return question_arr
    }

    const showLoading = () => {
        return (
            <ThreeCircles
                height="150%"
                width="150%"
                color="#ffa500"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="three-circles-rotating"
                outerCircleColor=""
                innerCircleColor=""
                middleCircleColor=""
            />
        )
    }
    
    // const questions = [
    //     {
    //         'question': 'what is the national color of Pakistan?',
    //         'answer': 'green'
    //     },
    //     {
    //         'question': 'when was Pakistan founded?',
    //         'answer': '1947'
    //     }
    // ]


    return(
        <>
       {loading ? <div style={{"display":"flex", "flexDirection":"column","justifyContent": "space-between"}}>
       <div>
                        <p class="h3">Please wait.<br></br>
                        <small class="text-muted"><span style={{'color':'orange'}}>Your list of Q/A's is being generated.</span></small>
                         </p>    
                        </div> 
                        
                        
                        <div style={{"margin": "auto"}}>
                            {showLoading()}
                        </div>
                       
                    </div>: 
                    <div>
                        <div class="alert alert-primary h4" role="alert" style={{"paddingTop":"2%"}}>You can edit the question/answers by clicking on their respective boxes.</div>
                        {showQuestions()}
                    </div>
       
       }
        </>
    )
}