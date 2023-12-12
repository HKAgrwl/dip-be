import { connection } from '../server.js'

async function assignProject(student, project) {
    try {
        console.log(student.email);
        console.log(project.project_id);

        await connection.execute(
            'UPDATE Student SET assignedProject = ? WHERE email = ?',
            [project.project_id, student.email]
        );

        await connection.execute('UPDATE Projects SET strength = strength - 1 WHERE project_id = ?', [project.project_id]);
    } catch (error) {
        console.error(error);
    }
}

const getResults = async (req, res) => {
    try {
        // Get students in descending order of CGPA
        const studentList = await connection.execute(
            'SELECT email, cgpa, firstPreference, secondPreference, thirdPreference,assignedProject FROM Student WHERE assignedProject IS NULL ORDER BY cgpa DESC'
        );
        // Loop through students and assign projects
        for (const students of studentList) {
            for (const student of students) {
                // Check available project preferences
                const preferences = [student.firstPreference, student.secondPreference, student.thirdPreference];
                // console.log(preferences)

                for (const preference of preferences) {
                    // Check if project has available slots
                    const project = await connection.execute('SELECT * FROM Projects WHERE project_id = ?', [preference]);
                    // console.log(project[0][0]);
                    if (project[0][0].strength > 0) {
                        await assignProject(student, project[0][0]);
                        break;
                    }
                }
            }
        }

        // Update unassigned students
        await connection.execute('UPDATE Student SET assigned = FALSE WHERE assignedProject IS NULL');

        res.json({ message: 'Projects assigned successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error assigning projects.' });
    }
};

export { getResults }