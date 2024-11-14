document.addEventListener('DOMContentLoaded', ()=> {   
    const studentsForm = document.querySelector('#student-form')   
    const studentsTable = document.querySelector('#students-table').getElementsByTagName('tbody')[0]   
    const editStudentForm = document.querySelector('#edit-student')  
    let currentIndex = null;  
   
   
   
    function findStudents() {   
        fetch('/students')   
            .then(response => response.json())   
            .then(students => {   
                studentsTable.innerHTML = ''   
                students.forEach((student, index) => {   
                    const row = document.createElement('tr')   
                    row.innerHTML = `   
                    <td>${student.name}</td>   
                    <td>${student.surname}</td>   
                    <td>${student.age}</td>   
                    <td>${student.course}</td>   
                    <td>${student.faculty}</td>   
                    <td>${student.subjects}</td>   
                    <td>   
                    <button onClick='editStudent(${index})'>edit</button>   
                    <button >delete</button>   
                    </td>   
                    `   
                    studentsTable.appendChild(row)   
                })   
            })   
   
   
    }   
  
    function addStudents(event) {  
        event.preventDefault();  
          
        const studentsData = {  
            name: studentsForm.name.value,  
            surname: studentsForm.surname.value,  
            age: studentsForm.age.value,  
            course: studentsForm.course.value,  
            faculty: studentsForm.faculty.value,  
            subjects: studentsForm.subjects.value // This should be a string; we'll handle it as an array on the server  
        };  
      
        console.log("Sending student data:", studentsData); // Debug: Log the data being sent  
      
        fetch('/students', {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify(studentsData)  
        })  
        .then(response => {  
            if (!response.ok) {  
                throw new Error(`Server error: ${response.status}`);  
            }  
            return response.text();  
        })  
        .then(message => {  
            console.log("Server response:", message); // Debug: Log server response  
            findStudents(); // Refresh the student list  
        })  
        .catch(error => {  
            console.error("Error adding student:", error); // Log client-side error  
        });  
    }  
  
    window.editStudent = (index) => {  
        fetch('/students')   
            .then(response => response.json())   
            .then(students => {   
                const student = students[index];  
                currentIndex = index;  
                editStudentForm.style.display = 'block';  
                document.getElementById('edit-name').value = student.name  
                document.getElementById('edit-surname').value = student.surname  
                document.getElementById('edit-age').value = student.age  
                document.getElementById('edit-course').value = student.course  
                document.getElementById('edit-faculty').value = student.faculty  
                document.getElementById('edit-subjects').value = student.subjects  
            })   
    }  
  
  
  
  
    window.saveStudent = (event) => {  
     console.log('save')  
     event.preventDefault()  
const  updatedStudent = {  
name:  document.getElementById('edit-name').value,  
surname:    document.getElementById('edit-surname').value,  
age:    document.getElementById('edit-age').value,  
course:    document.getElementById('edit-course').value,  
faculty:    document.getElementById('edit-faculty').value,  
subjects:    document.getElementById('edit-subjects').value  
}  
  
        fetch(`/students/${currentIndex}`, { 
          method:'PUT', 
          headers: {

'Content-Type':'application/json' 
          }, 
          body: JSON.stringify(updatedStudent) 
        })   
            .then(() => {   
              editStudentForm.style.display='none'; 
              findStudents() 
            })   
    }  
  
    studentsForm.addEventListener('submit', addStudents)  
    findStudents()  
})
