export const checkCourseName = (data) => {
    let dataText = {};
    if (data.course_name === '') {
        dataText = { status: true, error: "Course name can't empty." };
    } else if (data.course_name.length > 255) {
        dataText = { status: true, error: 'Course name no more than 255 character.' };
    } else {
        dataText = { status: false, error: '' };
    }
    return dataText;
};

export const checkPassword = (data) => {
    let dataText = {};
    if (data.password) {
        if (data.password === '') {
            dataText = { status: true, error: "Password can't empty." };
        } else if (data.password.length > 50) {
            dataText = { status: true, error: 'Password no more than 50 character.' };
        } else if (data.password.length < 7) {
            dataText = { status: true, error: 'Password must at least 8 character.' };
        } else {
            dataText = { status: false, error: '' };
        }
    } else {
        dataText = { status: true, error: "Password can't empty." };
    }
    return dataText;
};

export const checkNewPassword = (data) => {
    let dataText = {};
    if (data.newPassword) {
        if (data.newPassword === '') {
            dataText = { status: true, error: "New password can't empty." };
        } else if (data.newPassword.length > 50) {
            dataText = { status: true, error: 'New password no more than 50 character.' };
        } else {
            dataText = { status: false, error: '' };
        }
    } else {
        dataText = { status: true, error: "New password can't empty." };
    }
    return dataText;
};

export const checkConfirmPassword = (data) => {
    let dataText = {};
    if (data.confirmPassword) {
        if (data.confirmPassword === '') {
            dataText = { status: true, error: "Confirm password can't empty." };
        } else if (data.confirmPassword.length > 50) {
            dataText = { status: true, error: 'Confirm password no more than 50 character.' };
        } else if (data.confirmPassword !== data.newPassword && data.newPassword !== '') {
            dataText = { status: true, error: 'Confirm password not equal new password.' };
        } else {
            dataText = { status: false, error: '' };
        }
    } else {
        dataText = { status: true, error: "Confirm password can't empty." };
    }
    return dataText;
};

export const checkConfirmPass = (data) => {
    let dataText = {};
    if (data.confirmPassword) {
        if (data.confirmPassword === '') {
            dataText = { status: true, error: "Confirm password can't empty." };
        } else if (data.confirmPassword.length > 50) {
            dataText = { status: true, error: 'Confirm password no more than 50 character.' };
        } else if (data.confirmPassword !== data.password && data.password !== '') {
            dataText = { status: true, error: 'Confirm password not equal password.' };
        } else {
            dataText = { status: false, error: '' };
        }
    } else {
        dataText = { status: true, error: "Confirm password can't empty." };
    }
    return dataText;
};

export const checkTermName = (data, termData) => {
    let dataText = {};
    let checkData = termData.filter((item) => item.term_name === data.term_name);
    if (data.term_name === '') {
        dataText = { status: true, error: "Chapter name can't empty." };
    } else if (data.term_name.length > 50) {
        dataText = { status: true, error: 'Chapter name no more than 50 character.' };
    } else if (checkData.length > 1 && data.term_name != '') {
        dataText = { status: true, error: 'Chapter name already exists.' };
    } else {
        dataText = { status: false, error: '' };
    }
    return dataText;
};

export const checkContent = (data) => {
    let dataText = {};
    if (data.content == '') {
        dataText = { status: true, error: "Content can't empty." };
    } else if (data.content.length > 1000) {
        dataText = { status: true, error: 'Content no more than 1000 character.' };
    } else {
        dataText = { status: false, error: '' };
    }
    return dataText;
};

export const checkEmail = (data) => {
    let dataText = {};
    if (data.email == '') {
        dataText = { status: true, error: "Email can't empty." };
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
        dataText = { status: true, error: 'Email not correct format. EX: abc@gmail.com' };
    } else if (data.email.length > 50) {
        dataText = { status: true, error: 'Email no more than 50 character.' };
    } else {
        dataText = { status: false, error: '' };
    }
    return dataText;
};

export const checkUsername = (data) => {
    let dataText = {};
    if (data.user_name == '') {
        dataText = { status: true, error: "Username can't empty." };
    } else if (data.user_name.length > 15) {
        dataText = { status: true, error: 'Username no more than 15 character.' };
    } else {
        dataText = { status: false, error: '' };
    }
    return dataText;
};
