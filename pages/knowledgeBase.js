import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useState } from 'react';
import ReactShadowScroll from 'react-shadow-scroll';

function knowledgeBase() {

  const [topic, setTopic] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [showQuestion, setShowQuestion] = useState(false);

  const addQuestion = (question) => {
    if(!selectedQuestion.includes(question)) {
      setSelectedQuestion([...selectedQuestion, question]);
    }
  }

  const removeQuestion = (question) => {
    if(selectedQuestion.includes(question)) {
      setSelectedQuestion(selectedQuestion.filter((q) => q !== question));
    }
  }

  const questions = {
    "Inheritance": [
      {
        "question": "What is inheritance?",
        "answer": "Inheritance is a way to reuse code. It allows you to create a new class that is a modified version of an existing class. The new class is called a subclass, and the existing class is called a superclass. The subclass inherits all of the public and protected members of the superclass. In addition, it can have its own members in addition to the inherited members."
      },
      {
        "question": "What is the difference between inheritance and composition?",
        "answer": "Inheritance derives one class from another, composition defines a class as the sum of its parts."
      },
      {
        "question": "What is Is-A relationship in Java?",
        "answer": "Is-A relationship represents Inheritance. It is implemented using the “extends” keyword. It is used for code reusability."
      }
    ],
    "Composition": [
      {
        "question": "What is composition?",
        "answer": "Composition is a way to reuse code. It allows you to create a new class that contains instances of other classes as fields. The new class is called a composite class, and the other classes are called component classes. The composite class contains the component classes as fields, and it can have its own fields in addition to the component class fields."
      },
      {
        "question": "What is the difference between inheritance and composition?",
        "answer": "Inheritance derives one class from another, composition defines a class as the sum of its parts."
      }
    ],
    "Aggregation": [
      {
        "question": "What is aggregation?",
        "answer": "Aggregation is a special form of composition. It is a relationship between two classes that allows the child object to exist independently of the parent object. The child object has a reference to the parent object, but the parent object does not have a reference to the child object."
      },
      {
        "question": "What is the difference between aggregation and composition?",
        "answer": "Association between two objects that illustrate the “has-a” relationship is called Aggregation. A composition defines a part-of a relationship, and both the entities are connected to each other."
      }
    ],
    "Association": [
      {
        "question": "What is association?",
        "answer": "Association is a relationship between two classes that allows one object instance to cause another to perform an action on its behalf. The association relationship is also known as a collaboration relationship."
      },
      {
        "question": "What is the difference between association and aggregation?",
        "answer": "Aggregation describes a special type of an association which specifies a whole and part relationship. Association is a relationship between two classes where one class use another."
      }
    ]
  }

  return (
    <div className="container">
      <h1 className="text-center display-4">Knowledge Base</h1>
      <div className="row d-flex justify-content-center mt-4">
        <div className="col-sm-12 col-md-6">
          <Dropdown options={['Inheritance', 'Composition', 'Aggregation', 'Association']} onChange={(e) => setTopic(e.value)} placeholder="Select Topic" />
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-4">
      {
          topic && (
            <div className="col-sm-12 col-md-10 mt-4">
              <h3 className='display-5 text-center'>{topic}</h3>
                <ReactShadowScroll styleSubcontainer={{
                  'height': '400px',
                  'width': '100%',
                }}><ul style={{'list-style-type': 'none'}}>
                  {
                    questions[topic].map((question) => (
                      <li className='m-3 p-3 border'>
                        <div className='row'>
                          <div className='col-10'>  
                            <p className='lead'>{question['question']}</p>
                            <p className='lead'>{question['answer']}</p>
                          </div>
                          <div className='col-2 d-flex align-items-center'>
                            <button className='btn btn-primary' onClick={() => addQuestion(question)}>Select</button>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul></ReactShadowScroll>
            </div>
          )
        }
      </div>
      <div className="row d-flex justify-content-center mt-4">
        {
          selectedQuestion.length > 0 && (
            <div className="col-sm-12 col-md-10 mt-4">
              <div className='row'>
                <div className='col-10'>
                  <h3 className='display-5 text-center'>Selected Questions</h3>
                </div>
                <div className='col-2'>
                  <button className='btn btn-primary' onClick={() => setShowQuestion(true)}>{showQuestion ? "Hide" : "Show"}</button>
                </div>
              </div>
              {
                showQuestion && (
                  <ReactShadowScroll><ul style={{'list-style-type': 'none'}}>
                  {
                    selectedQuestion.map((question) => (
                      <li className='m-3 p-3 border'>
                        <div className='row'>
                          <div className='col-10'>  
                            <p className='lead'>{question['question']}</p>
                          </div>
                          <div className='col-2 d-flex align-items-center'>
                            <button className='btn btn-danger' onClick={() => removeQuestion(question)}>Remove</button>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul></ReactShadowScroll>
                )
              }
          </div>
          )
        }
      </div>
    </div>
  );
}

export default knowledgeBase;