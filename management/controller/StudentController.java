package com.student.management.controller;

import com.student.management.entity.Student;
import com.student.management.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // STUDENT CAN ADD NAME
    @PostMapping
    public Student addStudent(@RequestBody Student student) {

        Student newStudent = new Student();
        newStudent.setName(student.getName());

        return studentService.addStudent(newStudent);
    }

    // EVERYONE CAN VIEW STUDENTS
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // EVERYONE CAN VIEW ONE STUDENT
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {

        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ONLY ADMIN CAN UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id,
            @RequestBody Student student,
            @RequestHeader(value = "X-Admin-Token", required = false) String adminToken) {

        if (!AdminController.isValidToken(adminToken)) {
            return ResponseEntity.status(403)
                    .body("Admin access required");
        }

        return ResponseEntity.ok(
                studentService.updateStudent(id, student)
        );
    }

    // ONLY ADMIN CAN DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(
            @PathVariable Long id,
            @RequestHeader(value = "X-Admin-Token", required = false) String adminToken) {

        if (!AdminController.isValidToken(adminToken)) {
            return ResponseEntity.status(403)
                    .body("Admin access required");
        }

        studentService.deleteStudent(id);

        return ResponseEntity.ok("Student deleted successfully");
    }
}