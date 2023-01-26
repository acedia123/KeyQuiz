import React from 'react';
import { routes } from '../configs/index';
import { DefaultLayout, Auth, Admin } from '../layouts/index';
// Auth
const Login = React.lazy(() => import('../pages/Auth/Login'));
const LoginFake = React.lazy(() => import('../pages/Auth/LoginFake'));
const SignUp = React.lazy(() => import('../pages/Auth/SignUp'));
const ForgotPassword = React.lazy(() => import('../pages/Auth/ForgotPassword'));

// General
const Home = React.lazy(() => import('../pages/Home'));
const UserProfile = React.lazy(() => import('../pages/Profile'));
const AuthorProfile = React.lazy(() => import('../pages/AuthorProfile'));

// Course
const Courses = React.lazy(() => import('../pages/Courses'));
const AddCourse = React.lazy(() => import('../pages/AddCourse'));
const EditCourse = React.lazy(() => import('../pages/AddCourse/EditQuestion'));
const CourseDetail = React.lazy(() => import('../pages/CourseDetail'));

// Learn
const Learn = React.lazy(() => import('../pages/Learn'));

//Test
const Test = React.lazy(() => import('../pages/Test/index'));
const TestDetail = React.lazy(() => import('../pages/Test/TestDetail'));

// Topic
const Topics = React.lazy(() => import('../pages/Topics'));

// Admin
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const AdminUsers = React.lazy(() => import('../pages/User/AdminListUsers'));
const AdminCourses = React.lazy(() => import('../pages/Courses/AdminCourses'));
const AdminTopics = React.lazy(() => import('../pages/Topics/AdminListTopics'));
const AdminCourseDetail = React.lazy(() => import('../pages/CourseDetail/AdminCourseDetail'));
const AdminProfile = React.lazy(() => import('../pages/Profile/AdminProfile'));
const AdminAccountDetail = React.lazy(() => import('../pages/User/AdminAccountDetail'));

const ReportCourse = React.lazy(() => import('../pages/Report/ReportCourse'));
const ReportQuestion = React.lazy(() => import('../pages/Report/ReportQuestion'));
const ReportRate = React.lazy(() => import('../pages/Report/ReportRate'));

const TextEditor = React.lazy(() => import('../pages/Learn/TextEditor.js'));

export const publicRoutes = [
    { path: routes.home, component: Home, layout: DefaultLayout },
    { path: routes.courses, component: Courses, layout: DefaultLayout },
    { path: routes.courseDetail + '/:id&tab=:tab', component: CourseDetail, layout: DefaultLayout },

    { path: routes.topics, component: Topics, layout: DefaultLayout },

    { path: routes.login, component: Login, layout: Auth },
    { path: routes.register, component: SignUp, layout: Auth },
    { path: routes.forgotPass, component: ForgotPassword, layout: Auth },

    { path: routes.activePage + '/:id', component: LoginFake, layout: Auth },

    { path: routes.authorProfile + '/:id', component: AuthorProfile, layout: DefaultLayout },
];

export const privateRoutes = [
    // private
    { path: routes.learn + '/:courseId', component: Learn, layout: null },

    { path: routes.test + '/:id', component: Test, layout: null },
    { path: routes.testDetail + '/:id', component: TestDetail, layout: null },

    { path: routes.addCourse, component: AddCourse, layout: DefaultLayout },
    { path: routes.editCourse + '/:id', component: EditCourse, layout: DefaultLayout },

    { path: routes.userProfile, component: UserProfile, layout: DefaultLayout },

    //auth
    { path: routes.admin.dashboard, component: Dashboard, layout: Admin },
    { path: routes.admin.courses, component: AdminCourses, layout: Admin },
    { path: routes.admin.topics, component: AdminTopics, layout: Admin },
    { path: routes.admin.courseDetail + '/:id', component: AdminCourseDetail, layout: Admin },
    { path: routes.admin.accounts, component: AdminUsers, layout: Admin },
    { path: routes.admin.adminProfile, component: AdminProfile, layout: Admin },
    { path: routes.admin.accountDetail + '/:id', component: AdminAccountDetail, layout: Admin },

    { path: routes.admin.reportCourse, component: ReportCourse, layout: Admin },
    { path: routes.admin.reportQuestion, component: ReportQuestion, layout: Admin },
    { path: routes.admin.reportRate, component: ReportRate, layout: Admin },
    { path: '/abc', component: TextEditor, layout: DefaultLayout },
];
