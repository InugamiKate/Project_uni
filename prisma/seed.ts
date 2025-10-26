import { PrismaClient } from '@prisma/client';
import {hashPassword} from '../src/infrastructure/common/crypto.util';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial data for Project Uni...');

    // Create Majors
    const csMajor = await prisma.major.create({
        data: {
            name: 'Computer Science',
            plain_name: 'computer science',
            description: 'The study of computers and computational systems.',
            created_by: 'system',
        },
    });

    const eeMajor = await prisma.major.create({
        data: {
            name: 'Electrical Engineering',
            plain_name: 'electrical engineering',
            description: 'The study and application of electricity, electronics, and electromagnetism.',
            created_by: 'system',
        },
    });
        
    // Create Major Intakes
    const csIntake2023 = await prisma.majorIntake.create({
        data: {
            major_id: csMajor.id,
            intake: '2023',
            total_weight: 120,
            created_by: 'system',
        },
    });

    const csIntake2024 = await prisma.majorIntake.create({
        data: {
            major_id: csMajor.id,
            intake: '2024',
            total_weight: 125,
            created_by: 'system',
        },
    });

    const eeIntake2023 = await prisma.majorIntake.create({
        data: {
            major_id: eeMajor.id,
            intake: '2023',
            total_weight: 130,
            created_by: 'system',
        },
    });

    // Create Semesters
    const fallSemester2025 = await prisma.semester.create({
        data: {
            name: 'Fall 2025',
            plain_name: 'fall 2025',
            start_date: '2025-08-15',
            end_date: '2025-12-15',
            created_by: 'system',
        },
    });

    const springSemester2026 = await prisma.semester.create({
        data: {
            name: 'Spring 2026',
            plain_name: 'spring 2026',
            start_date: '2026-01-10',
            end_date: '2026-05-10',
            created_by: 'system',
        },
    });

    // Create Users
    const password = await hashPassword('123456');

    const adminUser = await prisma.user.create({
        data: {
            name: 'System Admin',
            birthday: '1980-01-01',
            phone: '1234567890',
            email: 'admin@uni.edu.vn',
            role: 'admin',
            is_student: false,
            active: true,
            created_by: 'system',
            address: '123 Admin St, City, Country',
            sex: 'male',
            code: 'ADMIN001',
            plain_name: 'system admin',
        },
    });

    const headCSUser = await prisma.user.create({
        data: {
            name: 'CS head user',
            birthday: '1980-01-01',
            phone: '0987654321',
            email: 'head@uni.edu.vn',
            role: 'program_head',
            is_student: false,
            major_id: csMajor.id,
            active: true,
            created_by: adminUser.id,
            address: '456 CS St, City, Country',
            sex: 'female',
            code: 'CSHEAD001',
            plain_name: 'cs head user',
        },
    });

    const headEEUser = await prisma.user.create({
        data: {
            name: 'EE head user',
            birthday: '1980-01-01',
            phone: '1122334455',
            email: 'head_ee@uni.edu.vn',
            role: 'program_head',
            is_student: false,
            major_id: eeMajor.id,
            active: true,
            created_by: adminUser.id,
            address: '789 EE St, City, Country',
            sex: 'male',
            code: 'EEHEAD001',
            plain_name: 'ee head user',
        },
    });

    const studentUserCSA = await prisma.user.create({
        data: {
            name: 'CS student A',
            birthday: '2000-01-01',
            phone: '1234567890',
            email: 'csstudenta@uni.edu.vn',
            role: 'student',
            is_student: true,
            major_id: csMajor.id,
            mi_id: csIntake2023.id,
            active: true,
            created_by: headCSUser.id,
            address: '123 CS St, City, Country',
            sex: 'male',
            code: 'CSSTUDENT001',
            plain_name: 'cs student a',
        },
    });

    const studentUserCSB = await prisma.user.create({
        data: {
            name: 'CS student B',
            birthday: '2000-01-01',
            phone: '1234567890',
            email: 'csstudentb@uni.edu.vn',
            role: 'student',
            is_student: true,
            major_id: csMajor.id,
            mi_id: csIntake2023.id,
            active: true,
            created_by: headCSUser.id,
            address: '123 CS St, City, Country',
            sex: 'female',
            code: 'CSSTUDENT002',
            plain_name: 'cs student b',
        },
    });

    const studentUserCSC = await prisma.user.create({
        data: {
            name: 'CS student C',
            birthday: '2000-01-01',
            phone: '1234567890',
            email: 'csstudentc@uni.edu.vn',
            role: 'student',
            is_student: true,
            major_id: csMajor.id,
            mi_id: csIntake2023.id,
            active: true,
            created_by: headCSUser.id,
            address: '123 CS St, City, Country',
            sex: 'male',
            code: 'CSSTUDENT003',
            plain_name: 'cs student c',
        },
    });

    const studentUserEEA = await prisma.user.create({
        data: {
            name: 'EE student A',
            birthday: '2000-01-01',
            phone: '1234567890',
            email: 'eestudenta@uni.edu.vn',
            role: 'student',
            is_student: true,
            major_id: eeMajor.id,
            mi_id: eeIntake2023.id,
            active: true,
            created_by: headEEUser.id,
            address: '123 EE St, City, Country',
            sex: 'male',
            code: 'EESTUDENT001',
            plain_name: 'ee student a',
        },
    });

    const studentUserEEB = await prisma.user.create({
        data: {
            name: 'EE student B',
            birthday: '2000-01-01',
            phone: '1234567890',
            email: 'eestudentb@uni.edu.vn',
            role: 'student',
            is_student: true,
            major_id: eeMajor.id,
            mi_id: eeIntake2023.id,
            active: true,
            created_by: headEEUser.id,
            address: '123 EE St, City, Country',
            sex: 'female',
            code: 'EESTUDENT002',
            plain_name: 'ee student b',
        },
    });

    const studentUserEEC = await prisma.user.create({
        data: {
            name: 'EE student C',
            birthday: '2000-01-01',
            phone: '1234567890',
            email: 'eestudentc@uni.edu.vn',
            role: 'student',
            is_student: true,
            major_id: eeMajor.id,
            mi_id: eeIntake2023.id,
            active: true,
            created_by: headEEUser.id,
            address: '123 EE St, City, Country',
            sex: 'male',
            code: 'EESTUDENT003',
            plain_name: 'ee student c',
        },
    });

    const lecturerUserCS = await prisma.user.create({
        data: {
            name: 'CS Lecturer',
            birthday: '1980-01-01',
            phone: '0987654321',
            email: 'cs_lecturer@uni.edu.vn',
            role: 'teacher',
            is_student: false,
            major_id: csMajor.id,
            active: true,
            created_by: headCSUser.id,
            address: '123 CS St, City, Country',
            sex: 'male',
            code: 'CSLECTURER001',
            plain_name: 'cs lecturer',
        },
    });

    const lecturerUserEE = await prisma.user.create({
        data: {
            name: 'EE Lecturer',
            birthday: '1980-01-01',
            phone: '1122334455',
            email: 'ee_lecturer@uni.edu.vn',
            role: 'teacher',
            is_student: false,
            major_id: eeMajor.id,
            active: true,
            created_by: headEEUser.id,
            address: '123 EE St, City, Country',
            sex: 'female',
            code: 'EELECTURER001',
            plain_name: 'ee lecturer',
        },
    });

    // Create Accounts
    const adminAcc = await prisma.account.create({
        data: {
            username: 'admin',
            password,
            role: 'ADMIN',
            user_id: adminUser.id,
        },
    });

    const headCSAcc = await prisma.account.create({
        data: {
            username: 'cs_head',
            password,
            role: 'PROGRAM_HEAD',
            user_id: headCSUser.id,
        },
    });

    const headEEAcc = await prisma.account.create({
        data: {
            username: 'ee_head',
            password,
            role: 'PROGRAM_HEAD',
            user_id: headEEUser.id,
        },
    });

    const studentAccCSA = await prisma.account.create({
        data: {
            username: 'cs_student_a',
            password,
            role: 'STUDENT',
            user_id: studentUserCSA.id,
        },
    });

    const studentAccCSB = await prisma.account.create({
        data: {
            username: 'cs_student_b',
            password,
            role: 'STUDENT',
            user_id: studentUserCSB.id,
        },
    });

    const studentAccCSC = await prisma.account.create({
        data: {
            username: 'cs_student_c',
            password,
            role: 'STUDENT',
            user_id: studentUserCSC.id,
        },
    });

    const studentAccEEA = await prisma.account.create({
        data: {
            username: 'ee_student_a',
            password,
            role: 'STUDENT',
            user_id: studentUserEEA.id,
        },
    });

    const studentAccEEB = await prisma.account.create({
        data: {
            username: 'ee_student_b',
            password,
            role: 'STUDENT',
            user_id: studentUserEEB.id,
        },
    });

    const studentAccEEC = await prisma.account.create({
        data: {
            username: 'ee_student_c',
            password,
            role: 'STUDENT',
            user_id: studentUserEEC.id,
        },
    });

    const lecturerAccCS = await prisma.account.create({
        data: {
            username: 'cs_lecturer_acc',
            password,
            role: 'LECTURER',
            user_id: lecturerUserCS.id,
        },
    });

    const lecturerAccEE = await prisma.account.create({
        data: {
            username: 'ee_lecturer_acc',
            password,
            role: 'LECTURER',
            user_id: lecturerUserEE.id,
        },
    });

    // Create Course
    const courseCSA = await prisma.course.create({
        data: {
            name: 'Introduction to Programming',
            plain_name: 'introduction to programming',
            weight: 3,
            description: 'Introduction to basic programming concepts using Python.',
            major_id: csMajor.id,
        },
    });

    const courseCSB = await prisma.course.create({
        data: {
            name: 'Database Systems',
            plain_name: 'database systems',
            weight: 4,
            description: 'Study of database design, SQL, and database management systems.',
            major_id: csMajor.id,
        },
    });

    const courseEECA = await prisma.course.create({
        data: {
            name: 'Circuit Analysis',
            plain_name: 'circuit analysis',
            weight: 3,
            description: 'Fundamentals of electrical circuits and analysis techniques.',
            major_id: eeMajor.id,
        },
    });

    const courseEECB = await prisma.course.create({
        data: {
            name: 'Electromagnetics',
            plain_name: 'electromagnetics',
            weight: 4,
            description: 'Study of electromagnetic fields and their applications.',
            major_id: eeMajor.id,
        },
    });

    // Create Class
    const class1 = await prisma.class.create({
        data: {
                name: 'CS101A',
                plain_name: 'cs101a',
                course_id: courseCSA.id,
                semester_id: fallSemester2025.id,
                created_by: headCSUser.id,
                major_id: csMajor.id,
                lecturer_id: lecturerUserCS.id,
                description: 'Morning class for CS101',
                location: 'Building A, Room 101',
                max_student: 30,
                status: 'in_process',
                regist_status: 'closed',
        },
    });

    const class2 = await prisma.class.create({
        data: {
            name: 'CS102A',
            plain_name: 'cs102a',
            course_id: courseCSB.id,
            semester_id: fallSemester2025.id,
            created_by: headCSUser.id,
            major_id: csMajor.id,
            lecturer_id: lecturerUserCS.id,
            description: 'Morning class for CS102',
            location: 'Building A, Room 102',
            max_student: 30,
            status: 'closed',
            regist_status: 'closed',
        },
    });

    const class3 = await prisma.class.create({
        data: {
            name: 'EE101A',
            plain_name: 'ee101a',
            course_id: courseEECA.id,
            semester_id: fallSemester2025.id,
            created_by: headEEUser.id,
            major_id: eeMajor.id,
            lecturer_id: lecturerUserEE.id,
            description: 'Morning class for EE101',
            location: 'Building B, Room 201',
            max_student: 30,
            status: 'regist_available',
            regist_status: 'open',
        },
    });

    const class4 = await prisma.class.create({
        data: {
            name: 'CS_OLD_CLASS',
            plain_name: 'cs_old_class',
            course_id: courseCSA.id,
            semester_id: fallSemester2025.id,
            created_by: headCSUser.id,
            major_id: csMajor.id,
            lecturer_id: lecturerUserCS.id,
            description: 'Old class for CS101',
            location: 'Building A, Room 101',
            max_student: 30,
            status: 'closed',
            regist_status: 'closed',
        }
    })

    // Create Class Regists
    await prisma.classRegist.createMany({
        data: [
            {
                student_id: studentUserCSA.id,
                class_id: class4.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSB.id,
                class_id: class4.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSC.id,
                class_id: class4.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSA.id,
                class_id: class1.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSA.id,
                class_id: class2.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSB.id,
                class_id: class2.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSC.id,
                class_id: class1.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSC.id,
                class_id: class2.id,
                status: 'rejected',
            },
            {
                student_id: studentUserEEA.id,
                class_id: class3.id,
                status: 'pending',
            },
            {
                student_id: studentUserEEB.id,
                class_id: class3.id,
                status: 'pending',
            },
            {
                student_id: studentUserEEC.id,
                class_id: class3.id,
                status: 'pending',
            },
        ],
    });

    // Create Exam
    const exam1 = await prisma.exam.create({
        data: {
            name: 'Midterm Exam CS101A',
            plain_name: 'midterm exam cs101a',
            major_id: csMajor.id,
            course_id: courseCSA.id,
            semester_id: fallSemester2025.id,
            created_by: headCSUser.id,
            date: '2025-10-15',
            class_id: class1.id,
            place: 'Building A, Room 101',
            status: 'regist_available',
            regist_status: 'open',
        },
    });

    const exam2 = await prisma.exam.create({
        data: {
            name: 'Final Exam CS102A',
            plain_name: 'final exam cs102a',
            major_id: csMajor.id,
            course_id: courseCSB.id,
            semester_id: fallSemester2025.id,
            created_by: headCSUser.id,
            date: '2025-12-10',
            class_id: class2.id,
            status: 'regist_available',
            regist_status: 'open',
        },
    });

    const exam3 = await prisma.exam.create({
        data: {
            name: 'Final Exam CS102A',
            plain_name: 'final exam cs102a',
            major_id: csMajor.id,
            course_id: courseCSB.id,
            semester_id: fallSemester2025.id,
            status: 'new',
            regist_status: 'closed',
            created_by: headCSUser.id,
            date: '2025-12-10',
            class_id: class2.id,
        },
    });

    const exam4 = await prisma.exam.create({
        data: {
            name: 'Old Exam CS101A',
            plain_name: 'old exam cs101a',
            major_id: csMajor.id,
            course_id: courseCSA.id,
            semester_id: fallSemester2025.id,
            status: 'closed',
            regist_status: 'closed',
            created_by: headCSUser.id,
            date: '2025-12-10',
            class_id: class4.id,
        }
    });

    const exam5 = await prisma.exam.create({
        data: {
            name: 'Old Exam CS101A',
            plain_name: 'old exam cs101a',
            major_id: csMajor.id,
            course_id: courseCSA.id,
            semester_id: fallSemester2025.id,
            status: 'closed',
            regist_status: 'closed',
            created_by: headCSUser.id,
            date: '2025-12-10',
            class_id: class4.id,
        }
    });

    // Create Exam Regists
    await prisma.examRegist.createMany({
        data: [
            {
                student_id: studentUserCSA.id,
                exam_id: exam4.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSB.id,
                exam_id: exam4.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSC.id,
                exam_id: exam4.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSA.id,
                exam_id: exam5.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSB.id,
                exam_id: exam5.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSC.id,
                exam_id: exam5.id,
                status: 'approved',
            },
            {
                student_id: studentUserCSA.id,
                exam_id: exam1.id,
                status: 'pending',
            },
            {
                student_id: studentUserCSB.id,
                exam_id: exam1.id,
                status: 'pending',
            }
        ]
    });

    // Create Exam Grades
    await prisma.examGrade.createMany({
        data: [
            {
                student_id: studentUserCSA.id,
                exam_id: exam4.id,
                grade: 5.0,
                is_passed: false
            },
            {
                student_id: studentUserCSB.id,
                exam_id: exam4.id,
                grade: 5.0,
                is_passed: false
            },
            {
                student_id: studentUserCSC.id,
                exam_id: exam4.id,
                grade: 5.0,
                is_passed: false
            },
            {
                student_id: studentUserCSA.id,
                exam_id: exam5.id,
                grade: 5.0,
                is_passed: false
            },
            {
                student_id: studentUserCSB.id,
                exam_id: exam5.id,
                grade: 3.3,
                is_passed: true
            },
            {
                student_id: studentUserCSC.id,
                exam_id: exam5.id,
                grade: 5.0,
                is_passed: false
            }
        ]
    })

    // Create Timetable
    await prisma.timetable.createMany({
        data: [
            {
                major_id: csMajor.id,
                mi_id: csIntake2023.id,
                name: 'Class CS101A Timetable',
                description: 'Timetable for class CS101A',
                location: 'Building A, Room 101',
                day: 'MONDAY',
                period: 'MORNING',
                time_start: '9:00',
                time_end: '11:00',
                object_type: 'CLASS',
                object_id: class1.id,
                created_by: headCSUser.id,
            },
            {
                major_id: csMajor.id,
                mi_id: csIntake2023.id,
                name: 'Class CS101A Timetable',
                description: 'Timetable for class CS101A',
                location: 'Building A, Room 101',
                day: 'WEDNESDAY',
                period: 'MORNING',
                time_start: '9:00',
                time_end: '11:00',
                object_type: 'CLASS',
                object_id: class1.id,
                created_by: headCSUser.id,
            },
            {
                major_id: csMajor.id,
                mi_id: csIntake2023.id,
                name: 'Class CS101A Timetable',
                description: 'Timetable for class CS101A',
                location: 'Building A, Room 101',
                day: 'FRIDAY',
                period: 'MORNING',
                time_start: '9:00',
                time_end: '11:00',
                object_type: 'CLASS',
                object_id: class1.id,
                created_by: headCSUser.id,
            },
            {
                major_id: csMajor.id,
                mi_id: csIntake2023.id,
                name: 'Midterm Exam CS101A Timetable',
                description: 'Timetable for Midterm Exam CS101A',
                location: 'Building A, Room 101',
                day: 'TUESDAY',
                period: 'EVENING',
                time_start: '9:00',
                time_end: '11:00',
                object_type: 'EXAM',
                object_id: exam1.id,
                created_by: headCSUser.id,
            },
            {
                major_id: csMajor.id,
                mi_id: csIntake2023.id,
                name: 'Final Exam CS102A Timetable',
                description: 'Timetable for Final Exam CS102A',
                location: 'Building A, Room 102',
                day: 'THURSDAY',
                period: 'EVENING',
                time_start: '9:00',
                time_end: '11:00',
                object_type: 'EXAM',
                object_id: exam2.id,
                created_by: headCSUser.id,
            },
            {
                major_id: csMajor.id,
                mi_id: csIntake2024.id,
                name: 'Class CS101B Timetable',
                description: 'Timetable for class CS101B',
                location: 'Building B, Room 201',
                day: 'MONDAY',
                period: 'MORNING',
                time_start: '9:00',
                time_end: '11:00',
                object_type: 'CLASS',
                object_id: class2.id,
                created_by: headCSUser.id,
            },
            {
                major_id: csMajor.id,
                mi_id: csIntake2024.id,
                name: 'Class CS101B Timetable',
                description: 'Timetable for class CS101B',
                location: 'Building B, Room 201',
                day: 'WEDNESDAY',
                period: 'MORNING',
                time_start: '9:00',
                time_end: '11:00',
                object_type: 'CLASS',
                object_id: class2.id,
                created_by: headCSUser.id,
            },
            {
                major_id: csMajor.id,
                mi_id: csIntake2024.id,
                name: 'Class CS101B Timetable',
                description: 'Timetable for class CS101B',
                location: 'Building B, Room 201',
                day: 'FRIDAY',
                period: 'MORNING',
                time_start: '9:00',
                time_end: '11:00',
                object_type: 'CLASS',
                object_id: class2.id,
                created_by: headCSUser.id,
            },
            {
                major_id: eeMajor.id,
                mi_id: eeIntake2023.id,
                name: 'Class EE101A Timetable',
                description: 'Timetable for class EE101A',
                location: 'Building C, Room 301',
                day: 'TUESDAY',
                period: 'AFTERNOON',
                time_start: '13:00',
                time_end: '15:00',
                object_type: 'CLASS',
                object_id: class3.id,
                created_by: headEEUser.id,
            },
            {
                major_id: eeMajor.id,
                mi_id: eeIntake2023.id,
                name: 'Class EE101A Timetable',
                description: 'Timetable for class EE101A',
                location: 'Building C, Room 301',
                day: 'THURSDAY',
                period: 'AFTERNOON',
                time_start: '13:00',
                time_end: '15:00',
                object_type: 'CLASS',
                object_id: class3.id,
                created_by: headEEUser.id,
            }
        ]
    });

    // Create Notifications
    const welcome_notification = await prisma.notification.create({
        data: {
            title: 'Welcome to Project Uni',
            content: 'This is a notification for all users.',
            object_type: 'ALL',
            object_id: null,
            created_by: 'system',
        }
    });

    // Create Notification Users
    await prisma.notificationUser.createMany({
        data: [
            {
                notification_id: welcome_notification.id,
                user_id: adminUser.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: headCSUser.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: headEEUser.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: studentUserCSA.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: studentUserCSB.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: studentUserCSC.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: studentUserEEA.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: studentUserEEB.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: studentUserEEC.id,
                is_read: false,
            },
            {
                notification_id: welcome_notification.id,
                user_id: lecturerUserCS.id,
                is_read: false,
            },
            {                
                notification_id: welcome_notification.id,
                user_id: lecturerUserEE.id,
                is_read: false,
            },
        ]
    });

    console.log('Seed completed successfully!');
    console.table({
        'Majors Created': 2,
        'Major Intakes Created': 2,
        'Semesters Created': 2,
        'Users Created': 12,
        'Accounts Created': 12,
        'Courses Created': 4,
        'Classes Created': 4,
        'Class Registrations Created': 21,
        'Exams Created': 5,
        'Exam Registrations Created': 14,
        'Exam Grades Created': 6,
        'Timetable Entries Created': 10,
        'Notifications Created': 1,
        'Notification Users Created': 12,
    });
    }

    main()
    .catch((e) => {
        console.error('Error while seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
