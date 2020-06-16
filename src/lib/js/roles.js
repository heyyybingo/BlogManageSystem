function roles(num) {
    let result;
    switch (num) {
        case 0:
            result = "普通用户";
            break;
        case 1:
            result = "普通管理员";
            break;
        case 2:
            result = "2级管理员";
            break;
        case 10:
            result = "超级管理员";
            break;
        default:
            result = "未设定";
            break;

    }

    return result
}

export default roles