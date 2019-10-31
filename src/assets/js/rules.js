var validateRole = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请选择管理员角色"));
    } else {
        callback();
    }
};
var checkPhone = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("请输入手机号"));
    } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error("请输入正确的手机号"));
        }
    }
};
var validateIdCard = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("请输入身份证号"));
    } else {
        const reg = /^\d{17}[(0-9)|X|x ]{1}/;
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error("请输入正确的身份证号"));
        }
    }
};
var checkAreaChoose = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("请选择区域"));
    } else {
        callback();
    }
};
var validateUsername = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("请输入账号"));
    } else {
        const reg = /^[0-9a-zA-Z]+$/;
        if (reg.test(value)) {
            callback();
        } else {
            return callback(new Error("账号格式为数字或者字母"));
        }
    }
};
var validateRePassword = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("请输入密码"));
    } else {
        const reg = /xtll888888/;
        if (reg.test(value)) {
            return callback(new Error("此密码为初始密码,请重新设置"));
        } else {
            return callback();
        }
    }
};
export default {
    companyName: [
        { required: true, message: "请输入公司名", trigger: "blur" }
    ],
    name: [
        { required: true, message: "请输入账户人姓名", trigger: "blur" }
    ],
    userClass: [
        {
            required: true,
            message: "请选择您要创建的管理员级别",
            trigger: "change"
        }
    ],
    powerChoose: [
        { required: true, message: "请选择权限", trigger: "change" }
    ],
    username: [{ validator: validateUsername, trigger: "blur" }],
    phoneNumber: [{ validator: checkPhone, trigger: "blur" }],
    idCard: [{ validator: validateIdCard, trigger: "blur" }],
    role: [{ validator: validateRole, trigger: "change" }],
    areaChoose: [{ validator: checkAreaChoose, trigger: "change" }],
    time: [
        {
            type: "date",
            require: true,
            message: "请选择日期",
            trigger: "change"
        }
    ],
    agtClass: [
        { required: true, message: "请选择级别", trigger: "change" }
    ],
    address: [
        {
            required: true,
            message: "请输入详细地址(具体街道)",
            trigger: "blur"
        }
    ],
    orderId: [{ required: true, message: "请输入订单号", trigger: "blur" }],
    logistics: [
        { required: true, message: "请选择物流公司", trigger: "change" }
    ],
    bankName: [{ required: true, message: "请输入开户行", trigger: "blur" }],
    cardNum: [{ required: true, message: "请输入银行卡号", trigger: "blur" }],
    cardName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    loginName: [
        { required: true, message: "账号不能为空", trigger: "blur" }
    ],
    password: [
        { required: true, message: "密码不能为空", trigger: "blur" }
    ],
    type: [{ required: true, message: "请选择角色", trigger: "change" }],
    rePassword: [{ validator: validateRePassword, trigger: "blur" }]
}