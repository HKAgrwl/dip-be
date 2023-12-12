import { connection } from '../server.js'
import jwt from 'jsonwebtoken'

const addProject = async (req, res) => {
    try {
      // Extract email from JWT token
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization token' });
      }
  
      const token = authorizationHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const professorEmail = decodedToken.email;
  
      const { name, strength } = req.body;
  
      // Add project with professor email retrieved from token
      await connection.execute('INSERT INTO Projects (pname, professor, strength) VALUES (?, ?, ?)', [name, professorEmail, strength]);
  
      res.status(201).json({ message: 'Project added successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding project.' });
    }
  };

const deleteProject = async (req, res) => {
    try {
      const projectId = req.params.id;
  
      // Check for JWT token and verify
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization token' });
      }
  
      const token = authorizationHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if email from token matches professor in database
      const professorEmail = decodedToken.email;
      const project = await connection.query('SELECT * FROM Projects WHERE project_id = ?', [projectId]);
  
      if (project[0][0].professor !== professorEmail) {
        return res.status(403).json({ message: 'Unauthorized access to project' });
      }
  
      // Delete project if authorized
      await connection.query('DELETE FROM Projects WHERE project_id = ?', [projectId]);
  
      res.json({ message: 'Project deleted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting project.' });
    }
  };
  

// API endpoint to update a project
const updateProject = async (req, res) => {
    try {
      const projectId = req.params.id;
  
      // Check for JWT token and verify
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization token' });
      }
  
      const token = authorizationHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if email from token matches professor in database
      const professorEmail = decodedToken.email;
      const project = await connection.query('SELECT * FROM Projects WHERE project_id = ?', [projectId]);
  
      if (project[0][0].professor !== professorEmail) {
        return res.status(403).json({ message: 'Unauthorized access to project' });
      }
  
      // Update project if authorized
      const { name, strength } = req.body;
      await connection.query('UPDATE Projects SET name = ?, strength = ? WHERE project_id = ?', [name, strength, projectId]);
  
      res.json({ message: 'Project updated successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating project.' });
    }
  };
  

export {addProject,deleteProject,updateProject}

