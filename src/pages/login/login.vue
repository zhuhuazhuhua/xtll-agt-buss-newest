<template>
  <div class="login">
    <div class="middle-wrapper">
      <div class="title-wrapper">
        <div class="title">{{form.type == '2' ? '下田乐乐代理商后台管理系统' : '下田乐乐商户后台管理系统'}}</div>
      </div>
      <div class="login-form">
        <el-form ref="loginForm" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入账号">
              <i slot="prefix" class="el-input__icon el-icon-user-solid" style="font-size: 18px;"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :type="passwordType" v-model="form.password" placeholder="请输入密码">
              <i slot="prefix" class="el-input__icon el-icon-adm-password" style="font-size: 18px;"></i>
              <i
                slot="suffix"
                class="el-input__icon el-icon-view"
                style="cursor: pointer;"
                @click="_togglePasswordType"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model="form.type" placeholder="请选择账号角色" @change="selectChange">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            style="width: 100%;margin-bottom: 30px;"
            @click="loginHandle('loginForm')"
          >登陆系统</el-button>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="当前密码为初始密码,请修改"
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
    >
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        :rules="rules"
        :inline="true"
      >
        <el-form-item label="" prop="rePassword">
          <el-input :type="rePasswordType" v-model="ruleForm.rePassword" autocomplete="off">
            <i
              slot="suffix"
              class="el-input__icon el-icon-view"
              style="cursor: pointer;"
              @click="_toggleRePasswordType"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitChangePassword('ruleForm')">修 改</el-button>
        <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import validateCode from 'src/components/ValidateCode/index';
import rules from "src/assets/js/rules";
export default {
  components: {
    // validateCode
  },
  created() {},
  data() {
    // var checkYanzhengma = (rule, value, callback) => {
    //   value = value.toUpperCase();
    //   if (value === '') {
    //     callback(new Error('请输入验证码'));
    //   } else if (value !== this.checkCode) {
    //     callback(new Error('验证码错误'));
    //     this.$refs['validate-code'].draw();
    //   } else {
    //     callback();
    //   }
    // };
    return {
      dialogFormVisible: false,
      passwordType: "password",
      rePasswordType: "password",
      checkCode: "",
      form: {
        username: "",
        password: "",
        type: "2"
      },
      ruleForm: {
        rePassword: ""
      },
      rePassword: "",
      rules,
      options: [{ value: "2", label: "代理商" }, { value: "3", label: "商户" }]
    };
  },
  methods: {
    selectChange(e) {},
    _setCheckCode(value) {
      this.checkCode = value;
    },
    _togglePasswordType() {
      if (this.passwordType === "password") {
        this.passwordType = "text";
      } else {
        this.passwordType = "password";
      }
    },
    _toggleRePasswordType() {
      if (this.rePasswordType === "password") {
        this.rePasswordType = "text";
      } else {
        this.rePasswordType = "password";
      }
    },
    //修改密码
    submitChangePassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = '/updatePass';
          let data = {
            password: this.ruleForm.rePassword
          };
          this.axios.post(url, data)
          .then(res => {
            if(res.code == '1') {
              this.$message.success(res.msg);
              this.dialogFormVisible = false;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch();
        }
      });
    },
    loginHandle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        }
      });
    },
    login() {
      this.axios
        .post("/login", this.form)
        .then(res => {
          console.log(res);
          if (res.code == "1") {
              if(this.form.password == "xtll888888") {
                localStorage.setItem("token", "Bearer " + res.data.token);
                this.dialogFormVisible = true;
              } else {
              let myUrl = res.data.loginUser.user;
              let info =
                this.form.type == "2"
                  ? {
                      id: myUrl.agtId,
                      companyName: myUrl.companyName,
                      name: myUrl.name,
                      cardidImg: myUrl.filePath + "/" + myUrl.cardidName,
                      certificateImg:
                        myUrl.filePath + "/" + myUrl.certificateName,
                      time: myUrl.startDate + " 至 " + myUrl.endDate
                    }
                  : {
                      id: myUrl.parentId,
                      companyName: myUrl.companyName,
                      name: myUrl.name,
                      cardidImg: myUrl.filePath + "/" + myUrl.cardidName,
                      certificateImg:
                        myUrl.filePath + "/" + myUrl.certificateName,
                      address: myUrl.address,
                      instruction: myUrl.instruction,
                      telephone: myUrl.telephone,
                      userCardid: myUrl.userCardid,
                      userName: res.data.loginUser.username
                    };
              localStorage.setItem("status", myUrl.status);
              localStorage.setItem("token", "Bearer " + res.data.token);
              localStorage.setItem("type", this.form.type);
              localStorage.setItem("user", JSON.stringify(info));
              localStorage.setItem("myId", myUrl.id); //0 为代理商超管
              localStorage.setItem("remark", myUrl.remark);
              localStorage.setItem("isLogin", "1");
              if (res.data.loginUser.user.areaNums) {
                localStorage.setItem(
                  "areaNums",
                  JSON.stringify(res.data.loginUser.user.areaNums)
                );
              } else {
                localStorage.setItem("areaNums", "");
              }
              if (this.form.type == "2") {
                this.$router.replace("/home/agt");
              } else {
                localStorage.setItem("logo", myUrl.filePath + "/" + myUrl.logo);
                this.$router.replace("/home/information");
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
$light_gray: #fff;
$cursor: #fff;
.login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: $bg;
  .middle-wrapper {
    position: fixed;
    width: 100%;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-60%);
    .title-wrapper {
      margin-top: 50px;
      margin-bottom: 30px;
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: #ffffff;
    }
    .login-form {
      position: relative;
      margin: 0 auto;
      width: 520px;
      padding: 30px 50px;
      box-sizing: border-box;
      border-radius: 5px;
      .el-row {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
        .login-btn {
          width: 100%;
        }
      }
      .check-code-wrapper {
        display: flex;
        justify-content: space-between;
        height: 40px;
        .yanzhengma-wrapper {
          flex: 0 1 auto;
        }
        .validate-code-wrapper {
          flex: 0 0 160px;
        }
      }
    }
  }
}
</style>
