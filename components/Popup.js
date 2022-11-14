import React, { useState } from "react";
import { setDoc, doc, getDoc } from 'firebase/firestore';
import {userConverter} from '../components/User';
import {db} from '../lib/firebase';
import Classroom, {classroomConverter} from "../components/Classroom";
export default function PopUp({toggle, user}) {
  const [addClass, setAddClass] = useState(false);
  const [joinClass, setJoinClass] = useState(false);
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [classType, setClassType] = useState("");
  const [classSemester, setClassSemester] = useState("");

  const handleClick = () => {
   toggle();
  };

  const addClassroom = async () => {
      try {
        const ref = doc(db, "users", user.email).withConverter(userConverter);
        const docSnap = await getDoc(ref);
        if(docSnap.exists()) {
          let new_user = docSnap.data();
          new_user.classrooms.push(classCode);
          let new_classroom = new Classroom(className, new_user.name, new_user.email, classCode, classType, classSemester, [], []);
          try {
            await setDoc(ref, new_user);
          } catch(error) {
            console.log('Error Setting New User');
          }
          try {
            let classRef = doc(db, "classrooms", classCode).withConverter(classroomConverter);
            console.log('CLASS REF', classRef);
            await setDoc(classRef, new_classroom);
          } catch(error) {
            console.log('Error adding class', error);
          }
          handleClick();
      } 
    } catch(error) {
        console.log('ERRROR BASICLALLY');
      }
    }

    const joinClassroom = async () => {
      const ref = doc(db, 'classrooms', classCode).withConverter(classroomConverter);
      const docSnap = await getDoc(ref);
      if(docSnap.exists()) {
        let new_classroom = docSnap.data();
        const userRef = doc(db, 'users', user.email).withConverter(userConverter);
        const userSnap = await getDoc(userRef);
        if(userSnap.exists()) {
          let new_user = userSnap.data();
          if(new_user.classrooms.includes(classCode)) {
            alert('You are already in this classroom');
          } else {
            new_user.classrooms.push(classCode);
            try {
              if(new_classroom.announcements === undefined) {
                new_classroom.announcements = [];
              }
              new_classroom.students.push(new_user.email);
            } catch(e) {
              console.error(e);
              new_classroom.students = [new_user.email];
            }
            try {
              await setDoc(userRef, new_user);
            } catch(error) {
              console.log('Error Setting New User');
            }
            try {
              await setDoc(ref, new_classroom);
            } catch(error) {
              console.log('Error adding class', error);
            }
            handleClick();
          }
        }
      }
    }

  return (
   <div className="modal">
     <div className="modal_content">
     <span className="close" onClick={handleClick}>&times;    </span>
     <br />
      {
        addClass ? (
          <div>
            <h1 className="display-4 mb-5">Add Class</h1>
            <div>
                <div className="mb-3">
                  <label htmlFor="className" className="form-label">Class Name</label>
                  <input type="text" className="form-control" id="className" onChange={(e) => setClassName(e.target.value)}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">Class Code</label>
                  <input type="text" className="form-control" id="classCode" onChange={(e) => setClassCode(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="classType" className="form-label">Class Type</label>
                  <input type="text" className="form-control" id="classType" onChange={(e) => setClassType(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="classSemester" className="form-label">Class Semester</label>
                  <input type="text" className="form-control" id="classSemester" onChange={(e) => setClassSemester(e.target.value)} />
                </div>
                <div className="text-center">
                  <button className="btn btn-orange" onClick={addClassroom}>Add</button>
                </div>
            </div>
          </div>
        ) : joinClass ? (
          <div>
            <h1 className="display-4 mb-5">Join Class</h1>
            <div>
                <div className="mb-3">
                  <label htmlFor="classCode" className="form-label">Class Code</label>
                  <input type="text" className="form-control" id="classCode" onChange={(e) => setClassCode(e.target.value)} />
                </div>
                <div className="text-center">
                  <button className="btn btn-orange" onClick={() => joinClassroom()}>Join</button>
                </div>
            </div>
          </div>
        ) : 
        <div>
          <button className="btn-candy" title="➕" onClick={() => setAddClass(!addClass)}>Create a class</button>
          <button className="btn-candy" title="🤝" onClick={() => setJoinClass(!joinClass)}>Join a class</button>
        </div>
      }
    </div>
   </div>
  );
}