//Course Class
class Course {
    constructor(title, instructor, image) {
        this.courseID = Math.floor(Math.random() * 10000);
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
}
//UI Class
class UI {

    addCourseToList(course) {
        const list = $('#course-list').val();

        var html = `
            <tr>
                <td><img src="https://picsum.photos/100"</td>
                <td>${course.title}</td>
                <td>${course.instructor}</td>
                <td><a href="#" data-id="${course.courseID}" class="btn btn-danger btn-sm delete">Delete</a></td>
            </tr>
        `;
        $('#course-list').append(html);
    }

    clearControls() {
        $('#title').val("");
        $('#instructor').val("");
        $('#image').val("");
    }

    deleteCourse(target) {
        $(target).parent().parent().remove();
    }

    static showAlert(message, className) {
        var alert = `
            <div class="alert alert-${className}">
                ${message} 
            </div>
        `;
        const row = document.querySelector('#row');
        row.insertAdjacentHTML("afterbegin", alert);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }
}
//Storage Class
class Storage {

    static getCourses() {
        let courses;

        if (localStorage.getItem('courses') === null) {
            courses = [];
        } else {
            courses = JSON.parse(localStorage.getItem('courses'));
        }

        return courses;
    }

    static displayCourses() {
        const courses = Storage.getCourses();

        courses.forEach(course => {
            const ui = new UI();
            ui.addCourseToList(course);
        });
    }

    static addCourse(course) {
        const courses = Storage.getCourses();
        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    static deleteCourse(element) {
        if (element.classList.contains('delete')) {
            const id = element.getAttribute('data-id');

            const courses = Storage.getCourses();

            courses.forEach((course, index) => {
                if (course.courseID == id) {
                    courses.splice(index, 1);
                }
            });

            localStorage.setItem('courses', JSON.stringify(courses));
        }
    }
}

$(document).ready(function () {

    $(document).ready(Storage.displayCourses());


    $('#new-course').submit(function (e) {

        e.preventDefault();

        const title = $('#title').val();
        const instructor = $('#instructor').val();
        const image = $('#image').val();

        //create course object
        const course = new Course(title, instructor, image);

        //create UI

        const ui = new UI();

        //control

        if (title === '' || instructor === '' || image === '') {
            UI.showAlert('Please complete the form', 'warning');
        } else {
            //add course to list

            ui.addCourseToList(course);

            //save to localstorage

            Storage.addCourse(course);

            //clear controls

            ui.clearControls();

            UI.showAlert('The course has been added', 'success');
        }

    });

    //delete course
    $(document).on('click', '.delete', function (e) {
        e.preventDefault();

        //delete course
        const ui = new UI();
        ui.deleteCourse(e.target);

        //delete from LS

        Storage.deleteCourse(e.target);

        UI.showAlert('The course has been deleted', 'danger');
    });

});

