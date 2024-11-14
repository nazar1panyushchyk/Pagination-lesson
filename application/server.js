const express = require ("express"); 
const fs = require('fs'); 
const bodyParser = require('body-parser'); 

 
 
const app = express() 
const PORT = 3000 
const filePath = 'students.json'; 
 
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended:true})) 
 
app.use(express.static('public')) 
 
app.get('/students', function (req, res) { 
    fs.readFile(filePath, 'utf8', (err, data) => { 
        if (err) { 
        return res.status(500).send('Error reading a file') 
        } 
        const jsonParseStudents = JSON.parse(data) 
        res.json(jsonParseStudents) 
        }); 
}) 
 
app.post('/students', (req, res) => { 
    console.log("Received data:", req.body); // Debug: Log received data

    fs.readFile(filePath, 'utf8', (err, data) => { 
        if (err) { 
            console.error("Error reading file:", err); 
            return res.status(500).send('Error reading file');
        }

        let students;
        try {
            students = JSON.parse(data); 
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return res.status(500).send("Error parsing JSON data");
        }

        const newStudent = { 
            ...req.body, 
            subjects: Array.isArray(req.body.subjects) ? req.body.subjects : [req.body.subjects] // Ensure subjects is an array
        };

        students.push(newStudent);

        fs.writeFile(filePath, JSON.stringify(students, null, 2), (error) => {
            if (error) { 
                console.error("Error writing file:", error); 
                return res.status(500).send('Error writing file');
            }
            console.log("Student successfully added:", newStudent); // Debug: Log successful addition
            res.send("Student is added");
        });
    });
});


app.listen(PORT, () => { 
    console.log(`Service is running on port http://localhost:${PORT}`); 
})