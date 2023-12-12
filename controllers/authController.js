import {connection} from '../server.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const registerStudent = async (req, res) => {
  const { email, sname, spassword } = req.body;

  console.log(sname);

  const saltRounds = 10; // adjust as needed
  const hashedPassword = await bcrypt.hash(spassword, saltRounds);

  try {
    const query = `INSERT INTO Student (email, sname, spassword) VALUES (?, ?, ?)`;
    const values = [email, sname, hashedPassword];

    await connection.query(query, values);
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = `SELECT * FROM Student WHERE email = ?`;
    const values = [email];

    const result = await connection.query(query, values);
    const user = result[0][0];

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.spassword);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};


// using email to authenticate student
const updateStudent = async (req, res) => {
  const studentId = req.params.email;
  const { cgpa, firstPreference, secondPreference, thirdPreference } = req.body;

  // Update the student record
  const updateQuery = `
    UPDATE Student
    SET cgpa = ?,
        firstPreference = ?,
        secondPreference = ?,
        thirdPreference = ?
    WHERE email = ?;
  `;

  const values = [cgpa, firstPreference, secondPreference, thirdPreference, studentId];

  try {
    await connection.query(updateQuery, values);
    res.json({ message: "Student record updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating student record" });
  }
};

const registerProfessor = async (req, res) => {
  const { email, name, password } = req.body;

  const saltRounds = 10; // adjust as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const query = `INSERT INTO Professor (email, pname, ppassword) VALUES (?, ?, ?)`;
    const values = [email, name, hashedPassword];

    await connection.query(query, values);
    res.status(201).json({ message: "Professor registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const loginProfessor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = `SELECT * FROM Professor WHERE email = ?`;
    const values = [email];

    const result = await connection.query(query, values);
    const user = result[0][0]; // Change to `result[0]` for MySQL

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.ppassword);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // Generate JWT token
    const jwtPayload = { email: user.email }; // Include additional user information as needed
    const jwtOptions = { expiresIn: '24h' }; // Set expiration time for the token
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);
    console.log(token)
    // Assign token to response
    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

export { registerStudent, loginStudent, updateStudent,registerProfessor,loginProfessor };
