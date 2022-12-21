export const topics = [
    {
        id: 1,
        name: 'Computer Fundamental',
    },
    { id: 2, name: 'Software Engineering' },
    { id: 3, name: 'Japanese' },
    { id: 4, name: 'Mathematics' },
    { id: 5, name: 'Business Administration' },
    { id: 6, name: 'Finance' },
    {
        id: 7,
        name: 'Graphic Design',
    },
];

export const fakeQuestion = (totalQues) => {
    let i = 1;
    let arr = [];

    while (i <= totalQues) {
        arr.push({
            id: i,
            content: `Random question what is the good programing to create HTML #${i}`,
            answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
            correct_answers: ['Random Answer 1', 'Random Answer 2'],
            hint: 'This is hint to the question',
            explain: 'You should choose A because is true',
            createdAt: Date.now,
        });
        i++;
    }

    return arr;
};

export const fakeDataLearn = () => {
    let i = 1;
    let arr = [];

    while (i <= 20) {
        arr.push({
            question_id: i,
            content: `Random question what is the good programing to create HTML #${i}`,
            answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
            correct_answers: ['Random Answer 2'],
            hint: 'This is hint to the question',
            explain: 'You should choose A because is true',
            createdAt: Date.now,
        });
        i++;
    }

    return arr;
};

export function userTerm(num, pageIndex, pageSize, totalElement) {
    return new Promise(function (resolve, reject) {
        let i = 1;
        let arr = [];

        while (i <= num) {
            let generateName = (Math.random() + 1).toString(36).substring(2);
            let random = Math.floor(Math.random() * 300) + 1;
            let category = [topics[Math.floor(Math.random() * topics.length)]];
            let totalQues = Math.floor(Math.random() * 500) + 1;
            arr.push({
                course_id: i,
                course_name: `Course Detail Super ${i}`,
                category,
                totalQues,
                author: [
                    {
                        user_id: 'uuid' + i,
                        user_name: generateName,
                        slug: '/' + generateName,
                        avatar: `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${random}.jpg`,
                    },
                ],
                questions: fakeQuestion(totalQues),
                rate: {
                    value: Math.floor(Math.random() * 5) + 1,
                    total: Math.floor(Math.random() * 1000) + 1,
                },
                comments: Math.floor(Math.random() * 1000) + 1,
                shares: Math.floor(Math.random() * 1000) + 1,
                public_status: '2',
                created_at: '2022-10-03T17:22:30.504Z',
            });
            i++;
        }

        setTimeout(
            () =>
                resolve({
                    courses: arr.slice(pageIndex == 0 ? pageIndex : totalElement, totalElement + pageSize),
                    hasMore: Math.floor((arr.length - 18) / pageSize) + 1 > pageIndex,
                }),
            300,
        );
    });
}

export const rate = {
    totalRate: 5,
    comments: [
        {
            id: 'comment1',
            user: {
                id: 'uuid1',
                name: 'qweqwasdzcxc',
                slug: '/qweqwasdzcxc',
                photoURL: `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${200}.jpg`,
            },
            content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            createdAt: Date.now(),
            rate: 3,
        },
        {
            id: 'comment2',
            user: {
                id: 'uuid2',
                name: 'quananhasdask',
                slug: '/qweqwasdzcxc',
                photoURL: `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${21}.jpg`,
            },
            content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            createdAt: Date.now(),
            rate: 4,
        },
    ],
};

export const questions = [
    {
        id: 1,
        content: 'Random Name is this the best question i had learn #1',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
        correct_answers: ['Random Answer 1', 'Random Answer 2'],
        hint: 'This is hint to the question',
        explain: 'You should choose A because is true',
    },
    {
        id: 2,
        content: 'Random Name #2',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3'],
        correct_answers: ['Random Answer 1'],
        hint: 'This is hint to the question',
        explain: 'You should choose A because is true',
    },
    {
        id: 3,
        content: 'Random Name #3',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
        correct_answers: ['Random Answer 1', 'Random Answer 2'],
        hint: null,
        explain: 'You should choose A because is true',
    },
    {
        id: 4,
        content: 'Random Name #4',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
        correct_answers: ['Random Answer 1', 'Random Answer 2'],
        hint: null,
        explain: 'You should choose A because is true',
    },
    {
        id: 5,
        content: 'Random Name #5',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
        correct_answers: ['Random Answer 1', 'Random Answer 2'],
        hint: null,
        explain: 'You should choose A because is true',
    },
    {
        id: 6,
        content: 'Random Name #6',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
        correct_answers: ['Random Answer 1', 'Random Answer 2'],
        hint: null,
        explain: 'You should choose A because is true',
    },
    {
        id: 7,
        content: 'Random Name #7',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
        correct_answers: ['Random Answer 1', 'Random Answer 2'],
        hint: null,
        explain: 'You should choose A because is true',
    },
];

export const userAnswers = [
    {
        id: 1,
        content: 'Random Name is this the best question i had learn #1',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
        correct_answers: ['Random Answer 1', 'Random Answer 2'],
        hint: 'This is hint to the question',
        explain: 'You should choose A because is true',
        userChoose: [
            { index: 0, answer: 'Random Answer 1' },
            { index: 1, answer: 'Random Answer 2' },
        ],
    },
    {
        id: 2,
        content: 'Random Name #2',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3'],
        correct_answers: ['Random Answer 1'],
        hint: 'This is hint to the question',
        explain: 'You should choose A because is true',
        userChoose: [{ index: 1, answer: 'Random Answer 2' }],
    },
    {
        id: 3,
        content: 'Random Name #3',
        answers: ['Random Answer 1', 'Random Answer 2', 'Random Answer 3', 'Random Answer 4'],
        correct_answers: ['Random Answer 1', 'Random Answer 2'],
        hint: null,
        explain: 'You should choose A because is true',
        userChoose: [
            { index: 1, answer: 'Random Answer 2' },
            { index: 2, answer: 'Random Answer 3' },
        ],
    },
];

export const myCourse = [
    {
        id: 1,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 1',
        category: {
            id: 2,
            name: 'Software Engineering',
        },
        totalQues: 214,
        user: {
            id: 'uuid1',
            name: 'eofhi343j1',
            slug: '/eofhi343j1',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/111.jpg',
        },
        reviews: {
            value: 5,
            total: 317,
        },
        comments: 944,
        shares: 599,
    },
    {
        id: 2,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 2',
        category: {
            id: 6,
            name: 'Finance',
        },
        totalQues: 168,
        user: {
            id: 'uuid2',
            name: 'lxkd4cjvdjh',
            slug: '/lxkd4cjvdjh',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/71.jpg',
        },
        reviews: {
            value: 5,
            total: 368,
        },
        comments: 652,
        shares: 802,
    },
    {
        id: 3,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 3',
        category: {
            id: 1,
            name: 'Computer Fundamental',
        },
        totalQues: 398,
        user: {
            id: 'uuid3',
            name: '2pkm4a79j3',
            slug: '/2pkm4a79j3',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/92.jpg',
        },
        reviews: {
            value: 4,
            total: 423,
        },
        comments: 167,
        shares: 690,
    },
    {
        id: 4,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 4',
        category: {
            id: 5,
            name: 'Business Administration',
        },
        totalQues: 191,
        user: {
            id: 'uuid4',
            name: 'nb2rco58gn',
            slug: '/nb2rco58gn',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/2.jpg',
        },
        reviews: {
            value: 4,
            total: 268,
        },
        comments: 376,
        shares: 595,
    },
    {
        id: 5,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 5',
        category: {
            id: 3,
            name: 'Japanese',
        },
        totalQues: 71,
        user: {
            id: 'uuid5',
            name: 'h4juj5l22ug',
            slug: '/h4juj5l22ug',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/261.jpg',
        },
        reviews: {
            value: 1,
            total: 914,
        },
        comments: 952,
        shares: 498,
    },
    {
        id: 6,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 6',
        category: {
            id: 1,
            name: 'Computer Fundamental',
        },
        totalQues: 284,
        user: {
            id: 'uuid6',
            name: 'cxdp87m3lp',
            slug: '/cxdp87m3lp',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/172.jpg',
        },
        reviews: {
            value: 5,
            total: 147,
        },
        comments: 942,
        shares: 158,
    },
    {
        id: 7,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 7',
        category: {
            id: 3,
            name: 'Japanese',
        },
        totalQues: 248,
        user: {
            id: 'uuid7',
            name: 'jcrmqxwxpb',
            slug: '/jcrmqxwxpb',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/140.jpg',
        },
        reviews: {
            value: 5,
            total: 565,
        },
        comments: 888,
        shares: 468,
    },
    {
        id: 8,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 8',
        category: {
            id: 4,
            name: 'Mathematics',
        },
        totalQues: 42,
        user: {
            id: 'uuid8',
            name: '1pmeleerav',
            slug: '/1pmeleerav',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/131.jpg',
        },
        reviews: {
            value: 5,
            total: 548,
        },
        comments: 531,
        shares: 368,
    },
    {
        id: 9,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 9',
        category: {
            id: 2,
            name: 'Software Engineering',
        },
        totalQues: 26,
        user: {
            id: 'uuid9',
            name: 'png7x5qmz2',
            slug: '/png7x5qmz2',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/212.jpg',
        },
        reviews: {
            value: 2,
            total: 521,
        },
        comments: 607,
        shares: 208,
    },
    {
        id: 10,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 10',
        category: {
            id: 6,
            name: 'Finance',
        },
        totalQues: 93,
        user: {
            id: 'uuid10',
            name: 'bw9xthw1qd',
            slug: '/bw9xthw1qd',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/162.jpg',
        },
        reviews: {
            value: 2,
            total: 4,
        },
        comments: 123,
        shares: 277,
    },
    {
        id: 11,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 11',
        category: {
            id: 4,
            name: 'Mathematics',
        },
        totalQues: 412,
        user: {
            id: 'uuid11',
            name: 'tk6gg7o4uy',
            slug: '/tk6gg7o4uy',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/31.jpg',
        },
        reviews: {
            value: 5,
            total: 247,
        },
        comments: 715,
        shares: 551,
    },
    {
        id: 12,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 12',
        category: {
            id: 6,
            name: 'Finance',
        },
        totalQues: 321,
        user: {
            id: 'uuid12',
            name: 'g18zu92u5dh',
            slug: '/g18zu92u5dh',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/8.jpg',
        },
        reviews: {
            value: 3,
            total: 744,
        },
        comments: 765,
        shares: 868,
    },
    {
        id: 13,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 13',
        category: {
            id: 1,
            name: 'Computer Fundamental',
        },
        totalQues: 81,
        user: {
            id: 'uuid13',
            name: 'j8ylmztinhk',
            slug: '/j8ylmztinhk',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1.jpg',
        },
        reviews: {
            value: 2,
            total: 727,
        },
        comments: 159,
        shares: 341,
    },
    {
        id: 14,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 14',
        category: {
            id: 5,
            name: 'Business Administration',
        },
        totalQues: 403,
        user: {
            id: 'uuid14',
            name: 'j1wklm69j6',
            slug: '/j1wklm69j6',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/176.jpg',
        },
        reviews: {
            value: 2,
            total: 376,
        },
        comments: 986,
        shares: 72,
    },
    {
        id: 15,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 15',
        category: {
            id: 7,
            name: 'Graphic Design',
        },
        totalQues: 206,
        user: {
            id: 'uuid15',
            name: '2msb5duaw4',
            slug: '/2msb5duaw4',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/31.jpg',
        },
        reviews: {
            value: 3,
            total: 89,
        },
        comments: 961,
        shares: 208,
    },
    {
        id: 16,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 16',
        category: {
            id: 2,
            name: 'Software Engineering',
        },
        totalQues: 493,
        user: {
            id: 'uuid16',
            name: 'nod67j3s7y',
            slug: '/nod67j3s7y',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/39.jpg',
        },
        reviews: {
            value: 4,
            total: 92,
        },
        comments: 650,
        shares: 970,
    },
    {
        id: 17,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 17',
        category: {
            id: 1,
            name: 'Computer Fundamental',
        },
        totalQues: 396,
        user: {
            id: 'uuid17',
            name: 'z4ogy6alpn',
            slug: '/z4ogy6alpn',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/260.jpg',
        },
        reviews: {
            value: 5,
            total: 533,
        },
        comments: 322,
        shares: 93,
    },
    {
        id: 18,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 18',
        category: {
            id: 3,
            name: 'Japanese',
        },
        totalQues: 70,
        user: {
            id: 'uuid18',
            name: 'qs4y3q9kt9',
            slug: '/qs4y3q9kt9',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/123.jpg',
        },
        reviews: {
            value: 4,
            total: 929,
        },
        comments: 710,
        shares: 152,
    },
    {
        id: 19,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 19',
        category: {
            id: 7,
            name: 'Graphic Design',
        },
        totalQues: 108,
        user: {
            id: 'uuid19',
            name: 'ruqcdyyhks',
            slug: '/ruqcdyyhks',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/56.jpg',
        },
        reviews: {
            value: 5,
            total: 733,
        },
        comments: 888,
        shares: 351,
    },
    {
        id: 20,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 20',
        category: {
            id: 3,
            name: 'Japanese',
        },
        totalQues: 159,
        user: {
            id: 'uuid20',
            name: 'pzd2ukae5o',
            slug: '/pzd2ukae5o',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/240.jpg',
        },
        reviews: {
            value: 5,
            total: 655,
        },
        comments: 287,
        shares: 987,
    },
    {
        id: 21,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 21',
        category: {
            id: 2,
            name: 'Software Engineering',
        },
        totalQues: 372,
        user: {
            id: 'uuid21',
            name: 'rz6mbhqpsp',
            slug: '/rz6mbhqpsp',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/12.jpg',
        },
        reviews: {
            value: 1,
            total: 94,
        },
        comments: 20,
        shares: 818,
    },
    {
        id: 22,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 22',
        category: {
            id: 1,
            name: 'Computer Fundamental',
        },
        totalQues: 88,
        user: {
            id: 'uuid22',
            name: 'z1174fzvyd',
            slug: '/z1174fzvyd',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/250.jpg',
        },
        reviews: {
            value: 3,
            total: 671,
        },
        comments: 290,
        shares: 784,
    },
    {
        id: 23,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 23',
        category: {
            id: 5,
            name: 'Business Administration',
        },
        totalQues: 405,
        user: {
            id: 'uuid23',
            name: 'cbfny4syqxg',
            slug: '/cbfny4syqxg',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/208.jpg',
        },
        reviews: {
            value: 4,
            total: 992,
        },
        comments: 307,
        shares: 625,
    },
    {
        id: 24,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 24',
        category: {
            id: 7,
            name: 'Graphic Design',
        },
        totalQues: 456,
        user: {
            id: 'uuid24',
            name: 'ejonmlr0efh',
            slug: '/ejonmlr0efh',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/173.jpg',
        },
        reviews: {
            value: 3,
            total: 110,
        },
        comments: 66,
        shares: 20,
    },
    {
        id: 25,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 25',
        category: {
            id: 1,
            name: 'Computer Fundamental',
        },
        totalQues: 375,
        user: {
            id: 'uuid25',
            name: '4dmdlwyxddf',
            slug: '/4dmdlwyxddf',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/262.jpg',
        },
        reviews: {
            value: 2,
            total: 760,
        },
        comments: 807,
        shares: 751,
    },
    {
        id: 26,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 26',
        category: {
            id: 7,
            name: 'Graphic Design',
        },
        totalQues: 175,
        user: {
            id: 'uuid26',
            name: 'eatktafzfmj',
            slug: '/eatktafzfmj',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/285.jpg',
        },
        reviews: {
            value: 2,
            total: 165,
        },
        comments: 559,
        shares: 44,
    },
    {
        id: 27,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 27',
        category: {
            id: 7,
            name: 'Graphic Design',
        },
        totalQues: 226,
        user: {
            id: 'uuid27',
            name: 'zwz6h6j3jx',
            slug: '/zwz6h6j3jx',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/45.jpg',
        },
        reviews: {
            value: 5,
            total: 74,
        },
        comments: 312,
        shares: 652,
    },
    {
        id: 28,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 28',
        category: {
            id: 2,
            name: 'Software Engineering',
        },
        totalQues: 492,
        user: {
            id: 'uuid28',
            name: 'z4xkefbzal',
            slug: '/z4xkefbzal',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/14.jpg',
        },
        reviews: {
            value: 2,
            total: 187,
        },
        comments: 219,
        shares: 628,
    },
    {
        id: 29,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 29',
        category: {
            id: 6,
            name: 'Finance',
        },
        totalQues: 321,
        user: {
            id: 'uuid29',
            name: 'r0obgellaj',
            slug: '/r0obgellaj',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/116.jpg',
        },
        reviews: {
            value: 3,
            total: 710,
        },
        comments: 397,
        shares: 190,
    },
    {
        id: 30,
        createdAt: '2022-10-03T17:22:30.504Z',
        name: 'Course Detail Super 30',
        category: {
            id: 1,
            name: 'Computer Fundamental',
        },
        totalQues: 72,
        user: {
            id: 'uuid30',
            name: 'gldhf9yiun',
            slug: '/gldhf9yiun',
            photoURL: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/207.jpg',
        },
        reviews: {
            value: 1,
            total: 148,
        },
        comments: 835,
        shares: 367,
    },
];

export const tests = [
    {
        id: 1,
        name: 'Test 1 Japaneses',
        status: 0,
        user: {
            id: 1,
            photoURL: '123',
            displayName: 'abcd',
        },
    },
    {
        id: 2,
        name: 'Test 1 Math',
        status: 1,
        user: {
            id: 2,
            photoURL: '113',
            displayName: 'Huong',
        },
    },
    {
        id: 3,
        name: 'Test 1 Math1',
        status: 2,
        user: {
            id: 1,
            photoURL: '123',
            displayName: 'abcd',
        },
    },
];

export const author = [
    {
        id: 1,
        name: 'Masterrclad',
        avatar: '10',
        slug: 'Masterrclad',
    },
    {
        id: 2,
        name: 'Eminem',
        avatar: '120',
        slug: 'Eminem',
    },
    {
        id: 3,
        name: 'Bicesp',
        avatar: '121',
        slug: 'Bicesp',
    },
    {
        id: 4,
        name: 'Pharrell Williams',
        avatar: '110',
        shortDesc: `Pharrell Williams (sinh ngày 5 tháng 4 1973), thường được gọi là chỉ đơn giản là Pharrell, là một nghệ sĩ ghi
        âm Mỹ, nhà sản xuất, nhạc sĩ và nhà thiết kế thời trang. Cùng với Chad Hugo, họ làm cho bộ đôi sản xuất
        bản ghi The Neptunes, nơi mà họ sản xuất pop, hip hop và R & B âm nhạc.`,
        description: `Pharrell Williams (sinh ngày 5 tháng 4 1973), thường được gọi là chỉ đơn giản là Pharrell, là một nghệ sĩ ghi âm Mỹ, nhà sản xuất, nhạc sĩ và nhà thiết kế thời trang. Cùng với Chad Hugo, họ làm cho bộ đôi sản xuất bản ghi The Neptunes, nơi mà họ sản xuất pop, hip hop và R & B âm nhạc. Ông cũng là ca sĩ chính và tay trống của ban nhạc rock NERD, mà ông thành lập với Hugo và bạn thời thơ ấu Shay Haley. Ông phát hành đĩa đơn đầu tay của mình "Frontin '"trong năm 2003 và theo dõi với album đầu tay của mình In My Mind vào năm 2006 . Là một phần của The Neptunes, Williams đã sản xuất đĩa đơn nhiều cho âm nhạc nghệ sĩ. Bộ đôi sản xuất đã giành được ba giải thưởng Grammy trong số mười đề cử. Ông cũng là đồng sáng lập của các thương hiệu quần áo Tỷ phú Boys Club và Ice Cream Clothing`,
        slug: 'Pharrell-Williams',
    },
];
