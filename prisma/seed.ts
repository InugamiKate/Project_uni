import { PrismaClient } from '@prisma/client';
import {hashPassword} from '../src/infrastructure/common/crypto.util';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial data for Project Uni...');

    // Create Majors
    const csMajor = await prisma.major.create({
        data: {
        name: 'Computer Science',
        plain_name: 'Computer Science',
        description: 'The study of computers and computational systems.',
        created_by: 'system',
        },
    });

    const eeMajor = await prisma.major.create({
        data: {
        name: 'Electrical Engineering',
        plain_name: 'Electrical Engineering',
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
        plain_name: 'Fall 2025',
        start_date: '2025-08-15',
        end_date: '2025-12-15',
        created_by: 'system',
        },
    });

    const springSemester2026 = await prisma.semester.create({
        data: {
        name: 'Spring 2026',
        plain_name: 'Spring 2026',
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
        email: 'admin@uni.edu.vn',
        role: 'admin',
        is_student: false,
        active: true,
        created_by: 'system',
        },
    });

    const headCSUser = await prisma.user.create({
        data: {
        name: 'CS head user',
        email: 'head@uni.edu.vn',
        role: 'program_head',
        is_student: false,
        major_id: csMajor.id,
        active: true,
        created_by: adminUser.id,
        },
    });

    const headEEUser = await prisma.user.create({
        data: {
        name: 'EE head user',
        email: 'head_ee@uni.edu.vn',
        role: 'program_head',
        is_student: false,
        major_id: eeMajor.id,
        active: true,
        created_by: adminUser.id,
        },
    });

    const studentUserCSA = await prisma.user.create({
        data: {
        name: 'CS student A',
        email: 'csstudenta@uni.edu.vn',
        role: 'student',
        is_student: true,
        major_id: csMajor.id,
        mi_id: csIntake2023.id,
        active: true,
        created_by: headCSUser.id,
        },
    });

    const studentUserCSB = await prisma.user.create({
        data: {
        name: 'CS student B',
        email: 'csstudentb@uni.edu.vn',
        role: 'student',
        is_student: true,
        major_id: csMajor.id,
        mi_id: csIntake2023.id,
        active: true,
        created_by: headCSUser.id,
        },
    });

    const studentUserCSC = await prisma.user.create({
        data: {
        name: 'CS student C',
        email: 'csstudentc@uni.edu.vn',
        role: 'student',
        is_student: true,
        major_id: csMajor.id,
        mi_id: csIntake2023.id,
        active: true,
        created_by: headCSUser.id,
        },
    });

    const studentUserEEA = await prisma.user.create({
        data: {
        name: 'EE student A',
        email: 'eestudenta@uni.edu.vn',
        role: 'student',
        is_student: true,
        major_id: eeMajor.id,
        mi_id: eeIntake2023.id,
        active: true,
        created_by: headEEUser.id,
        },
    });

    const studentUserEEB = await prisma.user.create({
        data: {
        name: 'EE student B',
        email: 'eestudentb@uni.edu.vn',
        role: 'student',
        is_student: true,
        major_id: eeMajor.id,
        mi_id: eeIntake2023.id,
        active: true,
        created_by: headEEUser.id,
        },
    });

    const studentUserEEC = await prisma.user.create({
        data: {
        name: 'EE student C',
        email: 'eestudentc@uni.edu.vn',
        role: 'student',
        is_student: true,
        major_id: eeMajor.id,
        mi_id: eeIntake2023.id,
        active: true,
        created_by: headEEUser.id,
        },
    });

    const lecturerUserCS = await prisma.user.create({
        data: {
        name: 'CS Lecturer',
        email: 'cs_lecturer@uni.edu.vn',
        role: 'teacher',
        is_student: false,
        major_id: csMajor.id,
        active: true,
        created_by: headCSUser.id,
        },
    });

    const lecturerUserEE = await prisma.user.create({
        data: {
        name: 'EE Lecturer',
        email: 'ee_lecturer@uni.edu.vn',
        role: 'teacher',
        is_student: false,
        major_id: eeMajor.id,
        active: true,
        created_by: headEEUser.id,
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
        role: 'USER',
        user_id: lecturerUserCS.id,
        },
    });

    const lecturerAccEE = await prisma.account.create({
        data: {
        username: 'ee_lecturer_acc',
        password,
        role: 'USER',
        user_id: lecturerUserEE.id,
        },
    });

    // Create Course
    const courseCSA = await prisma.course.create({
        data: {
        name: 'Introduction to Programming',
        plain_name: 'Introduction to Programming',
        weight: 3,
        description: 'Introduction to basic programming concepts using Python.',
        major_id: csMajor.id,
        },
    });

    const courseCSB = await prisma.course.create({
        data: {
        name: 'Database Systems',
        plain_name: 'Database Systems',
        weight: 4,
        description: 'Study of database design, SQL, and database management systems.',
        major_id: csMajor.id,
        },
    });

    const courseEECA = await prisma.course.create({
        data: {
        name: 'Circuit Analysis',
        plain_name: 'Circuit Analysis',
        weight: 3,
        description: 'Fundamentals of electrical circuits and analysis techniques.',
        major_id: eeMajor.id,
        },
    });

    const courseEECB = await prisma.course.create({
        data: {
        name: 'Electromagnetics',
        plain_name: 'Electromagnetics',
        weight: 4,
        description: 'Study of electromagnetic fields and their applications.',
        major_id: eeMajor.id,
        },
    });

    // Create Class
    const class1 = await prisma.class.create({
    data: {
        name: 'CS101A',
        plain_name: 'CS101A',
        course_id: courseCSA.id,
        semester_id: fallSemester2025.id,
        created_by: headCSUser.id,
        major_id: csMajor.id,
        lecturer_id: lecturerUserCS.id,
    },
    });

    const class2 = await prisma.class.create({
    data: {
        name: 'CS102A',
        plain_name: 'CS102A',
        course_id: courseCSB.id,
        semester_id: fallSemester2025.id,
        created_by: headCSUser.id,
        major_id: csMajor.id,
        lecturer_id: lecturerUserCS.id,
    },
    });

    const class3 = await prisma.class.create({
    data: {
        name: 'EE101A',
        plain_name: 'EE101A',
        course_id: courseEECA.id,
        semester_id: fallSemester2025.id,
        created_by: headEEUser.id,
        major_id: eeMajor.id,
        lecturer_id: lecturerUserEE.id,
    },
    });

    // Create Exam
    const exam1 = await prisma.exam.create({
    data: {
        name: 'Midterm Exam CS101A',
        plain_name: 'Midterm Exam CS101A',
        major_id: csMajor.id,
        course_id: courseCSA.id,
        semester_id: fallSemester2025.id,
        created_by: headCSUser.id,
        date: '2025-10-15',
        class_id: class1.id,
    },
    });

    const exam2 = await prisma.exam.create({
    data: {
        name: 'Final Exam CS102A',
        plain_name: 'Final Exam CS102A',
        major_id: csMajor.id,
        course_id: courseCSB.id,
        semester_id: fallSemester2025.id,
        created_by: headCSUser.id,
        date: '2025-12-10',
        class_id: class2.id,
    },
    });


    console.log('Seed completed successfully!');
    console.table({
        Majors: 2,
        'Major Intakes': 2,
        Semesters: 2,
        Users: 12,
        Accounts: 12,
        Courses: 4,
        Classes: 3,
        Exams: 2,
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
