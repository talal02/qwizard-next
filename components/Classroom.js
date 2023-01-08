class Classroom {
  constructor(name, teacher_name, teacher_email, code, type, semester, announcements, students) {
    this.name = name;
    this.teacher_name = teacher_name;
    this.teacher_email = teacher_email;
    this.students = students;
    this.code = code;
    this.announcements = announcements;
    this.type = type;
    this.semester = semester;
  }

}

export const classroomConverter = {
  toFirestore: function(classroom) {
    console.log(classroom);
    return {
      name: classroom.name,
      teacher_name: classroom.teacher_name,
      teacher_email: classroom.teacher_email,
      students: classroom.students,
      code: classroom.code,
      announcements: classroom.announcements,
      type: classroom.type,
      semester: classroom.semester
    };
  },
  fromFirestore: function(snapshot, options) {
    const data = snapshot.data(options);
    return new Classroom(data.name, data.teacher_name, data.teacher_email, data.code, data.type, data.semester, data.announcements);
  }
};

export default Classroom;