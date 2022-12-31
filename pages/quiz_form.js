import { useEffect, useState } from "react"
import Questions from "./questions"
import styles from '../styles/Home.module.css'
import QWizard_logo from "./logo"
import Dropzone from 'react-dropzone'



export default function Quiz_form() {
    const [passage, setPassage] = useState('')
    const [generate, setGenerate] = useState(false)
    
    useEffect(()=> {
    }, [generate])

  
    return (
        <>
        <QWizard_logo></QWizard_logo> 
        <div class='container'>
            <div style={{'display': 'flex','justifyContent':'space-between'}}>
            <h2 class>Generate Questions <small><span style={{'color':'orange'}}>paste a sample text to generate questions</span></small></h2>
            <button type="button" class="btn btn-light" style={{'border': '1px solid orange'}}>Check out Quiz</button>
            
            </div>
            <form>
                <div class="form-group" style={{'display':"flex", justifyContent: "space-between"}}>
                    <label for="exampleFormControlTextarea1"></label>
                    <textarea  style={{"maxWidth":"60%"}} class="form-control" id="exampleFormControlTextarea1" rows="10" cols="50" onChange={e => {setPassage(e.target.value)
                    console.log('value', e.target.value)
                    setGenerate(false)}}></textarea>

                <h3><span style={{'color':'orange'}}>Or</span></h3>
                
                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div {...getRootProps()} style={{'border':"2px solid black", 'borderStyle':"dashed", "height":"100%"}}>
                        <input {...getInputProps()} />
                        <h6 style={{'color':'orange'}}>Drag 'n' drop some files here, or click to select files</h6>
                    </div>
                    </section>
                )}
                </Dropzone>

                </div>
                <div class='form-group'>
                        <button type="button" style={{'width':'100%', 'height':'auto', 'backgroundColor':'orange', 'borderRadius': '20px', 'padding':'0.5%', 'marginTop':'4%', "marginBottom":"2%"}} onClick={() => setGenerate(true)}><h5>Go!</h5></button>
                </div>
            </form>
            {generate ? <Questions content={passage}></Questions>:null}
        </div>
        </>
        
    )
}
