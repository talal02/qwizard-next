import { useEffect, useState } from "react"

import QWizard_logo from "./logo"
import Dropzone from 'react-dropzone'
import MCQ_Questions from "./mcq_questions"
import Link from 'next/link';


export default function MCQ_Quiz_form() {
    const [passage, setPassage] = useState('')
    const [generate, setGenerate] = useState(false)
    
    useEffect(()=> {
    }, [generate])

  
    return (
        <>
        <QWizard_logo></QWizard_logo> 
        <div class='container'>
            <div className="row mb-3 justify-content-space-between">
                <div className="col-9">
                    <h3>Generate Multiple Choice Questions</h3>
                </div>
                <div className="col-3">
                    <button type="button" class="btn btn-orange"><Link href="/current_quiz">Check out Quiz</Link></button>
                </div>
            </div>
            <div className="row mb-3 justify-content-center">
                <div className="lead col-12" style={{
                        fontSize: 'larger',
                        color: 'orange'
                    }}>
                        Paste a sample text to generate Multiple Choice Questions
                </div> 
            </div>
            <div style={{'display': 'flex','justifyContent':'space-between'}}>            
            </div>
            <form>
                <div class="form-group" style={{'display':"flex", justifyContent: "space-between"}}>
                    <label for="exampleFormControlTextarea1"></label>
                    <textarea  style={{"maxWidth":"100%"}} class="form-control" id="exampleFormControlTextarea1" rows="10" cols="50" onChange={e => {setPassage(e.target.value)
                    console.log('value', e.target.value)
                    setGenerate(false)}}></textarea>

                {/* <h3><span style={{'color':'orange'}}>Or</span></h3>
                
                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div {...getRootProps()} style={{'border':"2px solid black", 'borderStyle':"dashed", "height":"100%"}}>
                        <input {...getInputProps()} />
                        <h6 style={{'color':'orange'}}>Drag 'n' drop some files here, or click to select files</h6>
                    </div>
                    </section>
                )}
                </Dropzone> */}

                </div>
            </form>
            <div className="row justify-content-center">
                <button type="button col-12" class="btn btn-orange w-50" onClick={() => setGenerate(true)}>Go!</button>
            </div>
            {generate ? <MCQ_Questions content={passage}></MCQ_Questions>:null}
        </div>
        </>
        
    )
}
