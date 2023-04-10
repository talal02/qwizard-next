import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/router";
import Image from "next/image";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { userConverter } from "../components/User";
import ClassroomMain from "../components/classroomMain";
import Classroom, { classroomConverter } from "../components/Classroom";

function Classrooms() {
  const [user, setUser] = useAuthState(auth);
  const [seen, setSeen] = useState(false);
  const [option, setOption] = useState("");
  const [enrolledClassrooms, setEnrolledClassrooms] = useState([]);
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [classType, setClassType] = useState("");
  const [classSemester, setClassSemester] = useState("");
  const router = useRouter();

  const addClassroom = async () => {
    try {
      const ref = doc(db, "users", user.email).withConverter(userConverter);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        let new_user = docSnap.data();
        new_user.classrooms.push(classCode);
        // quizzes, name, teacher_name, teacher_email, code, type, semester, announcements, students
        let new_classroom = new Classroom(
          {},
          className,
          new_user.name,
          new_user.email,
          classCode,
          classType,
          classSemester,
          [],
          []
        );
        try {
          let classRef = doc(db, "classrooms", classCode).withConverter(
            classroomConverter
          );
          console.log("CLASS REF", classRef);
          await setDoc(classRef, new_classroom);
          try {
            await setDoc(ref, new_user);
          } catch (error) {
            console.log("Error Setting New User");
          }
        } catch (error) {
          console.log("Error adding class", error);
        }
        togglePopup();
      }
    } catch (error) {
      console.log("ERRROR BASICLALLY");
    }
  };

  const joinClassroom = async () => {
    const ref = doc(db, "classrooms", classCode).withConverter(
      classroomConverter
    );
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      let new_classroom = docSnap.data();
      const userRef = doc(db, "users", user.email).withConverter(userConverter);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        let new_user = userSnap.data();
        if (new_user.classrooms.includes(classCode)) {
          alert("You are already in this classroom");
        } else {
          new_user.classrooms.push(classCode);
          try {
            if (new_classroom.announcements === undefined) {
              new_classroom.announcements = [];
            }
            new_classroom.students.push(new_user.email);
          } catch (e) {
            console.error(e);
            new_classroom.students = [new_user.email];
          }
          try {
            await setDoc(userRef, new_user);
          } catch (error) {
            console.log("Error Setting New User");
          }
          try {
            await setDoc(ref, new_classroom);
          } catch (error) {
            console.log("Error adding class", error);
          }
          togglePopup();
        }
      }
    }
  };

  const togglePopup = () => {
    setOption("");
    if (seen) {
      setSeen(false);
    } else {
      setSeen(true);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      const fetchClassData = async () => {
        const ref = doc(db, "users", user.email).withConverter(userConverter);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          const new_user = docSnap.data();
          let classes = [];
          console.log(new_user);
          for (let i = 0; i < new_user.classrooms.length; i++) {
            const classRef = doc(db, "classrooms", new_user.classrooms[i]);
            const classSnap = await getDoc(classRef);

            if (classSnap.exists()) {
              const new_class = classSnap.data();
              classes.push(new_class);
            }
          }
          setEnrolledClassrooms(classes);
        }
      };
      fetchClassData().catch(console.error);
    }
  }, [user, seen]);

  if (user) {
    return (
      <div id="main">
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-xs-6 col-sm-5 col-md-2 d-flex">
              <Image
                src="/logo.svg"
                className="mx-auto"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>

            <div className="col-xs-6 col-sm-3 col-md-2 d-flex align-items-center">
              <i
                className="fa fa-plus-square mr-3"
                style={{ fontSize: "xx-large", color: "orange" }}
                aria-hidden="true"
                onClick={togglePopup}
              ></i>
              <Image
                src={user.photoURL}
                className="mx-auto logout-img rounded-circle"
                alt="Logo"
                onClick={() => {
                  auth.signOut();
                }}
                width={60}
                height={60}
              />
            </div>
          </div>
          <section className="page-contain row">
            {!seen &&
              enrolledClassrooms.length > 0 &&
              enrolledClassrooms.map((classroom, idx) => {
                return (
                  <ClassroomMain
                    key={`class-${idx}`}
                    name={classroom.name}
                    teacher={classroom.teacher_name}
                    code={classroom.code}
                    semester={classroom.semester}
                    type={classroom.type}
                    openClass={() =>
                      router.push(`/classroom/${classroom.code}`)
                    }
                  />
                );
              })}
            {seen && option == "addClass" && (
              <div className="mt-5">
                <span className="close" onClick={togglePopup}>
                  {" "}
                  &times;{" "}
                </span>
                <h1 className="display-5 mb-5">Add Class</h1>
                <div className="mb-3">
                  <label htmlFor="className" className="form-label">
                    Class Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="className"
                    placeholder="Software Engineering"
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">
                    Class Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="classCode"
                    placeholder="CSE3004"
                    onChange={(e) => setClassCode(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="classType" className="form-label">
                    Class Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="classType"
                    placeholder="Elective or Core"
                    onChange={(e) => setClassType(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="classSemester" className="form-label">
                    Class Semester
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="classSemester"
                    placeholder="Fall 2022"
                    onChange={(e) => setClassSemester(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button className="btn btn-orange" onClick={addClassroom}>
                    Add
                  </button>
                </div>
              </div>
            )}
            {seen && option == "joinClass" && (
              <div className="mt-5 pt-5">
                <span className="close" onClick={togglePopup}>
                  {" "}
                  &times;{" "}
                </span>
                <h1 className="display-5 mb-5">Join Class</h1>
                <div>
                  <div className="mb-3">
                    <label htmlFor="classCode" className="form-label">
                      Class Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="classCode"
                      placeholder="CSE3004"
                      onChange={(e) => setClassCode(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-orange"
                      onClick={() => joinClassroom()}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            )}
            {seen && option == "" && (
              <div className="mt-5 pt-5">
                <button
                  className="btn btn-lg btn-orange col-12 m-5"
                  onClick={() => setOption("addClass")}
                >
                  Create a class
                </button>
                <button
                  className="btn btn-lg btn-orange col-12 m-5"
                  onClick={() => setOption("joinClass")}
                >
                  Join a class
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }
  return <></>;
}

export default Classrooms;
