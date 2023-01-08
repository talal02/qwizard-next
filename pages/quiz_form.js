import { useEffect, useState } from "react"
import Questions from "./questions"
import styles from '../styles/Home.module.css'
import QWizard_logo from "./logo"
import Dropzone from 'react-dropzone'
import Link from 'next/link';


export default function Quiz_form() {
    const [passage, setPassage] = useState('')
    const [generate, setGenerate] = useState(false)
    
    useEffect(()=> {
    }, [generate])

  
    return (
        <>
        <QWizard_logo></QWizard_logo>
        <div class='container'>
            <div className="row mb-3 justify-content-space-between">
                <div className="col-8">
                {/* <small><span style={{'color':'orange'}}>paste a sample text to generate questions</span></small> */}
                    <h3 class>Generate Short Answer Questions</h3>
                </div>
                <div className="col-4">
                    <button type="button" class="btn btn-orange"><Link href="/current_quiz">Check out Quiz</Link></button>
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
            {generate ? <Questions content={passage}></Questions>:null}
        </div>
        </>
        
    )
}
