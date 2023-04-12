class Classroom {
  constructor(
    quizzes,
    name,
    teacher_name,
    teacher_email,
    code,
    type,
    semester,
    announcements,
    students, 
    attemptedQuizzes
  ) {
    this.quizzes = quizzes;
    this.name = name;
    this.teacher_name = teacher_name;
    this.teacher_email = teacher_email;
    this.students = students;
    this.code = code;
    this.announcements = announcements;
    this.type = type;
    this.semester = semester;
    this.attemptedQuizzes = attemptedQuizzes;
  }
}

export const classroomConverter = {
  toFirestore: function (classroom) {
    console.log(classroom);
    return {
      name: classroom.name,
      teacher_name: classroom.teacher_name,
      teacher_email: classroom.teacher_email,
      students: classroom.students,
      code: classroom.code,
      announcements: classroom.announcements,
      type: classroom.type,
      semester: classroom.semester,
      quizzes: classroom.quizzes,
      attemptedQuizzes: classroom.attemptedQuizzes,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Classroom(
      data.quizzes,
      data.name,
      data.teacher_name,
      data.teacher_email,
      data.code,
      data.type,
      data.semester,
      data.announcements,
      data.students,
      data.attemptedQuizzes
    );
  },
};

export default Classroom;
