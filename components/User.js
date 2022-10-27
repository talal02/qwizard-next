class User {
  constructor(name, email, photoURL, classrooms) {
    this.name = name;
    this.email = email;
    this.photoURL = photoURL;
    this.classrooms = classrooms;
  }
}

export const userConverter = {
  toFirestore: function(user) {
    return {
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      classrooms: user.classrooms
    };
  },
  fromFirestore: function(snapshot, options) {
    const data = snapshot.data(options);
    return new User(data.name, data.email, data.photoURL, data.classrooms);
  }
}
export default User;