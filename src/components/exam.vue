<template>
  <div class="outer">
    <div class="info">
      <div class="info-item">
        <div class="info-title">账号</div>
        <div class="info-content">{{objItem.loginName}}</div>
      </div>
      <div class="info-item">
        <div class="info-title">用户名</div>
        <div class="info-content">{{objItem.name}}</div>
      </div>
      <div class="info-item">
        <div class="info-title">身份证</div>
        <div class="info-content">{{objItem.userCardid}}</div>
      </div>
      <div class="info-item">
        <div class="info-title">手机号</div>
        <div class="info-content">{{objItem.telephone}}</div>
      </div>
      <div class="img-info">
        <div class="img-item">
          <div classs="info-title">身份证证件照</div>
          <viewer :images="[cardImg]">
            <img class="img" :src="cardImg" alt />
          </viewer>
        </div>
        <div class="img-item">
          <div classs="info-title">营业执照</div>
          <viewer :images="[certificateImg]">
            <img class="img" :src="certificateImg" alt />
          </viewer>
        </div>
        <div class="img-item" v-if="fileList">
          <div classs="info-title">其他证件</div>
          <viewer :images="fileList">
            <img
              v-for="(item, index) in fileList"
              :key="index"
              class="img"
              :src="item"
              alt
            />
          </viewer>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="operate('1')">取消</el-button>
      <el-button @click="operate('2')" type="primary">通过</el-button>
      <el-button @click="operate('3')" type="danger">不通过</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "exam",
  props: ["objItem", "type"],
  data() {
    return {
      cardImg: "",
      certificateImg: "",
      fileList: []
    };
  },
  mounted() {
    this.imgSrc();
  },
  watch: {
    objItem() {
      this.imgSrc();
    }
  },
  methods: {
    imgSrc() {
      this.certificateImg =
      this.objItem.filePath + "/" + this.objItem.certificateName;
      this.cardImg = this.objItem.filePath + "/" + this.objItem.cardidName;
      this.fileList = this.objItem.fileList.split(',').map(item => {
        return this.objItem.filePath + '/' + item
      });
    },
    operate(type) {
      if (type == "3") {
        this.$prompt("请输入审核失败原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "textarea",
          inputPattern: /\S/,
          inputErrorMessage: "审核失败原因不可为空"
        })
          .then(({ value }) => {
            this.$emit("examUp", { commitType: type, reason: value });
          })
          .catch(() => {});
      } else {
        this.$emit("examUp", { commitType: type });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/mixin";
.info {
  margin: 20px 40px;
  .info-item {
    @include fx(flex-start);
    margin-bottom: 20px;
    .info-title {
      @include sc(16px, #444);
      text-align: right;
      min-width: 60px;
      margin-right: 20px;
    }
  }
  .img-info {
    @include fx(flex-start);
    .img-item {
      margin-right: 30px;
      .info-title {
        @include sc(16px, #444);
        text-align: right;
        min-width: 60px;
        margin-right: 20px;
      }
      .img {
        max-width: 200px;
        margin-top: 15px;
      }
    }
  }
}
</style>