import {
    AccountBoxOutlined,
    AssignmentTurnedInOutlined,
    AssignmentTurnedInRounded,
    Flag,
    HelpOutline,
    Home,
    ListAlt,
    Person,
    TopicOutlined,
    TopicRounded,
    HomeOutlined,
    HomeRounded,
    SchoolOutlined,
    SchoolRounded,
    Category,
    AddCircleOutline,
} from '@mui/icons-material';
import { routes } from './configs/index';

export const homeNavigation = [
    {
        name: 'Home',
        icon: {
            default: HomeOutlined,
            active: HomeRounded,
        },
        path: routes.home,
        status: 'public',
    },
    {
        name: 'Topic',
        icon: {
            default: TopicOutlined,
            active: TopicRounded,
        },
        path: routes.topics,
        status: 'public',
    },
    {
        name: 'Courses',
        icon: {
            default: SchoolOutlined,
            active: SchoolRounded,
        },
        path: routes.courses,
        status: 'public',
    },
    {
        name: 'Add Course',
        icon: {
            default: AddCircleOutline,
            active: AddCircleOutline,
        },
        path: routes.addCourse,
        status: 'private',
    },
];

export const navigation = [
    {
        title: 'Dashboard',
        icon: <Home />,
        path: routes.admin.dashboard,
        children: null,
    },
    // {
    //     title: 'Manage Courses',
    //     icon: <SchoolRounded />,
    //     path: '/',
    //     children: [
    //         // {
    //         //     title: 'List Courses Today',
    //         //     icon: <ListAlt />,
    //         //     path: '/administrator/courses-today',
    //         // },
    //         {
    //             title: 'List Courses',
    //             icon: <ListAlt />,
    //             path: routes.admin.courses,
    //         },
    //     ],
    // },
    {
        title: 'Manage Courses',
        icon: <SchoolRounded />,
        path: routes.admin.courses,
        children: null,
    },
    {
        title: 'Manage Topics',
        icon: <Category />,
        path: routes.admin.topics,
        children: null,
    },
    {
        title: 'Manage Report',
        icon: <Flag />,
        path: '/',
        children: [
            {
                title: 'Courses Report',
                icon: <ListAlt />,
                path: routes.admin.reportCourse,
            },
            {
                title: 'Question Report',
                icon: <ListAlt />,
                path: routes.admin.reportQuestion,
            },
            {
                title: 'Rate Report',
                icon: <ListAlt />,
                path: routes.admin.reportRate,
            },
        ],
    },
    {
        title: 'Manage Account',
        icon: <Person />,
        path: routes.admin.accounts,
        children: null,
    },
];

export const homeUserPopper = [
    {
        name: 'User Profile',
        icon: AccountBoxOutlined,
        path: routes.userProfile,
    },
    // {
    //     name: 'Support',
    //     icon: HelpOutline,
    //     path: '/support',
    // },
    {
        name: 'Go to dashboard',
        icon: HelpOutline,
        path: routes.admin.dashboard,
    },
    {
        name: 'Login',
        icon: HelpOutline,
        path: routes.login,
    },
    {
        name: 'Register',
        icon: HelpOutline,
        path: routes.register,
    },
];
