<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <div>
              <span>企业信息</span>
              <span class="red" v-if="status != '1'">您的企业资料上传并审核通过后才可查看其他页面信息！</span>
            </div>
          </div>
          <div class="table-wrapper">
            <div class="refer" v-if="hasRefer">
              <div class="refer-item">推介人姓名：{{referName}}</div>
              <div class="refer-item">推介人电话：{{referTelephone}}</div>
            </div>
            <div class v-if="status == '1'">
              <div class="title">您的企业信息审核已通过</div>
              <div class="item">
                <span>农场名：</span><span>{{user.name}}</span>
              </div>
              <div class="item">
                <span>法人名：</span><span>{{user.userName}}</span>
              </div>
              <div class="item">
                <span>手机号：</span><span>{{user.telephone}}</span>
              </div>
              <div class="item">
                <span>身份证号：</span><span>{{user.userCardid}}</span>
              </div>
              <div class="item">
                <span>企业简介：</span><span>{{user.instruction}}</span>
              </div>
              <div class="item">
                <span>详细地址：</span><span>{{user.address}}</span>
              </div>
              <div class="item">
                <div>身份证证件照：</div>
                <viewer :images="[user.cardidImg]"> 
                  <img class="img" :src="user.cardidImg" alt />
                </viewer>
              </div>
              <div class="item">
                <div>营业执照：</div>
                <viewer :images="[user.certificateImg]"> 
                  <img class="img" :src="user.certificateImg" alt />
                </viewer>
              </div>
              <div class="item">
                <div>企业资质：</div>
                <viewer :images="[logo]"> 
                  <img class="img" :src="logo" alt />
                </viewer>
              </div>
            </div>
            <div class v-if="status == '3'">
              您的企业信息等待审核中
            </div>
            <div class v-if="status == '8'|| status == '5'">
              <div class="nopass" v-if="status == '5'">您的企业信息审核未通过，请重新上传资料</div>
              <el-form
                :model="ruleForm"
                status-icon
                ref="ruleForm"
                :rules="rules"
                :inline="true"
                :label-position="labelPosition"
              >
                <div>
                  <el-form-item label="企业名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item>
                      <div class="upload-title">企业资质</div>
                      <el-upload
                        class="uploader"
                        action
                        accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
                        :auto-upload="false"
                        list-type="picture-card"
                        :on-change="onOtherUploadChange"
                        :on-remove="handleRemove"
                      ></el-upload>
                    </el-form-item>
                </div>
                <div>
                  <el-form-item label="企业简介" prop="instruction" :label-width="formLabelWidth">
                    <el-input :clearable="true" style="width: 500px" :rows="6" minlength="30" type="textarea" v-model="ruleForm.instruction" autocomplete="off"></el-input>
                  </el-form-item>
                </div>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
                <el-button type="primary" plain @click="resetForm('ruleForm')">重 置</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { compress } from "src/assets/js/compress";
export default {
  components: {},
  data() {
    return {
      logo: '',
      status: '',
      hasRefer: false,
      remark: '',
      labelPosition: "left",
      formLabelWidth: "100px",
      businessImageUrl: [],
      user: localStorage.getItem('user'),
      ruleForm: {
        name: "",
        instruction: ""
      },
      rules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        businessImageUrl: [
          { required: true, message: "请上传您的企业资质", trigger: "change" }
        ],
        instruction: [
          { required: true, message: "请输入您的企业简介", trigger: "blur" }
        ]
      },
      referName: '',
      referTelephone: ''
    };
  },
  created() {
    this.getStatusAndRemark();
    this.getRefer();
  },
  mounted() {
    this.getStatus();
  },
  watch: {
  },
  computed: {},
  methods: {
    //页面初始化
    getStatusAndRemark() {
      this.status = localStorage.getItem('status');
      this.remark = localStorage.getItem('remark');
      this.user = JSON.parse(localStorage.getItem('user'));
      console.log(this.user);
      this.logo = localStorage.getItem('logo');
    },
    getRefer() {
      this.axios.get('/show/referRelation')
      .then(res => {
        if(res.code == '1' && res.data.hasReferOrNot) {
          this.referName = res.data.name;
          this.referTelephone = res.data.telephone;
          this.hasRefer = true;
        }
      })
      .catch();
    },
    getStatus() {
      this.axios.get('/getUserInfo')
      .then(res => {
        if(res.code == '1' && res.data.status == '1' && this.status != '1') {
          this.$message.info('您的企业信息审核状态已更新,请重新登录');
          this.$router.replace('/login');
        }
      })
      .catch();
    },
    //本地预览其他证件照图片
    onOtherUploadChange(file, fileList) {
      this.getOtherFileList(file, fileList);
    },
    //获取添加其他证件照文件
    getOtherFileList(file, fileList) {
      compress(file.raw, val => {
        this.businessImageUrl.push(val); // 或者 this.localFile=file.raw
      });
    },
    //其他证件删除图片
    handleRemove(file, fileList) {
      this.DeleteOtherFileList(file, fileList);
    },
    DeleteOtherFileList(file, fileList) {
      this.fileList = [];
      this.businessImageUrl = [];
      console.log(fileList.length);
      fileList.forEach(item => {
        compress(file.raw, val => {
          this.businessImageUrl.push(val); // 或者 this.localFile=file.raw
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.businessImageUrl) {
            this.$message({
              message: "请上传您的企业资质",
              type: "error",
              duration: 2000
            });
          } else {
            let formData = new FormData();
            this.businessImageUrl.forEach(item => {
              formData.append('logoImage', item);
            });
            formData.append("name", this.ruleForm.name);
            formData.append("instruction", this.ruleForm.instruction);
            formData.append("id", localStorage.getItem("myId"));
            formData.append("status", '3');
            this.axios
              .post("/buss/qualificationAudit", formData, {
                headers: { "Content-Type": "multipart/form-data" }
              })
              .then(res => {
                if (res.code == "1") {
                  this.$message({
                    message: res.msg,
                    type: "success",
                    duration: 2000
                  });
                  this.status = '3';
                  localStorage.setItem('status', '3');
                  this.businessImageUrl == '';
                  this.resetForm("ruleForm");
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
                    duration: 2000
                  });
                }
              })
              .catch(() => {});
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/mixin";
.basic {
  .header {
    min-width: 900px;
    @include fx(flex-start);
    .red {
      margin-left: 20px;
      color: red;
    }
  }
  .table-wrapper {
    .refer {
      margin-bottom: 20px;
      .refer-item {
        margin-bottom: 10px;
      }
    }
      .title {
        @include sc(18px, green);
        margin-bottom: 30px;
      }
      .item {
        margin-top: 20px;
        .img {
          margin-top: 10px;
          width: 300px;
        } 
      }
    }
  .dialog-footer {
    text-align: center;
  }
  .nopass {
    margin-bottom: 20px;
    @include sc(16px, #e4393c);
  }
  .uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .uploader-icon {
      @include wh(178px, 178px);
      @include sc(28px, #8c939d);
      line-height: 178px;
      text-align: center;
    }
    .identity {
      @include wh(178px, 178px);
      display: block;
    }
  }
  .uploader:hover {
    border-color: $uploadHoverBorder;
  }
}
</style>
