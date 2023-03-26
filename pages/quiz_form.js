import { useEffect, useState} from "react"
import styles from '../styles/Home.module.css'
import QWizard_logo from "./logo"
import {Dropzone} from 'react-dropzone'
import Link from 'next/link';
import axios from "axios"
import Questions_Text from "./open_ended_qa/questions_text"
import Questions_File from "./open_ended_qa/questions_file"


export default function Quiz_form() {
    const url = process.env.NEXT_PUBLIC_API_URL 
    const [passage, setPassage] = useState("")
    const [filePassage, setFilePassage] = useState("")
    const [genfromfile, setGenfromfile] = useState(false) 
    const [generate, setGenerate] = useState(false)
    const [file, setFile] = useState(null) 
    
    const onChangeHandler= async event=>{
        // setFile(event.target.files[0])
        // console.log(event.target.files[0])
        const data = new FormData;
        data.append('uploaded_file',event.target.files[0])
        var response = {}
        if(event.target.files[0].type == "application/pdf"){
            response = await axios.post(url+'read_PDF', data)
        }
        else{
            response = await axios.post(url+'read_DOCX', data)
        }
        setFilePassage(response.data)
        setGenerate(false)
        setGenfromfile(false)    
    }

    useEffect(()=> {
    }, [generate,genfromfile])

  
    return (
        <>
        <QWizard_logo></QWizard_logo>
        <div class='container'>
            <div className="row mb-3 justify-content-space-between">
                <div className="col-10">
                {/* <small><span style={{'color':'orange'}}>paste a sample text to generate questions</span></small> */}
                    <h3 class>Generate Short Answer Questions</h3>
                </div>
                <div className="col-2">
                    <button type="button" class="btn btn-orange"><Link href="/current_quiz">Check out Quiz</Link></button>
                </div>
            </div>
            <div className="row mb-3 justify-content-center">
                <div className="lead col-12" style={{
                        fontSize: 'larger',
                        color: 'orange'
                    }}>
                        Paste a sample text to generate Questions
                </div> 
            </div>

            <div style={{'display': 'flex','justifyContent':'space-between'}}>
            
            </div>
            <form>
                <div class="form-group" style={{'display':"flex", justifyContent: "space-between"}}>
                    <label for="exampleFormControlTextarea1"></label>
                    <textarea  style={{"maxWidth":"100%"}} class="form-control" id="exampleFormControlTextarea1" rows="10" cols="50" onChange={e => {setPassage(e.target.value)
                    console.log('value', passage)
                    setGenerate(false)
                    setGenfromfile(false)}}></textarea>
                    <div class="col-md-6">
                        <div class="form-group files color">
                        {/* <label>Upload Your File </label> */}
                        <input type="file" class="form-control" multiple="" onChange={onChangeHandler}></input>
                    </div>
                </div>
                    
	  </div>
            </form>
            <div className="container">
            <span class="border">
                <div className="row g-1">
                    <div className="col-6">
                        <button class="btn btn-orange w-100" onClick={() => setGenerate(true)}>Generate using Text</button>
                    </div>
                    <div className="col-6">
                        <button class="btn btn-orange w-100" onClick={() => {
                            setGenfromfile(true)
                        }}>Generate using File</button>
                    </div>
                </div>
            </span>
            </div>
            {generate ? <Questions_Text content={passage}></Questions_Text>:null}
            {genfromfile ? <Questions_File content={filePassage}></Questions_File>:null}
        </div>
        </>
        
    )
}
