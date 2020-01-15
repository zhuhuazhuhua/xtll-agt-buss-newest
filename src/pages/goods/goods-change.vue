<template>
  <div class="basic">
    <el-radio-group class="radio-group" v-model="addPage">
      <el-radio :label="'1'">商品基本信息修改</el-radio>
      <el-radio :label="'2'">商品落地页修改</el-radio>
    </el-radio-group>
    <el-form
      v-if="addPage == '1'"
      class="info-form"
      :model="ruleForm1"
      status-icon
      ref="ruleForm1"
      :rules="rules"
      :inline="true"
      :label-position="labelPosition"
    >
      <div class="info-title">商品基本信息</div>
      <el-form-item label="商品名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="ruleForm1.name" autocomplete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item label="农场名称" prop="farm" :label-width="formLabelWidth">
                <el-input v-model="ruleForm1.farm" autocomplete="off"></el-input>
      </el-form-item>-->
      <el-form-item label="产品规格" prop="specs" :label-width="formLabelWidth">
        <el-input v-model="ruleForm1.specs" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="应季期(全年配送请选择1月1号到1月1号)" prop="seasinal" :label-width="formLabelWidth">
        <el-date-picker
          v-model="ruleForm1.seasinal"
          type="daterange"
          value-format="MM-dd"
          format="MM-dd"
          :editable="false"
          range-separator="至"
          start-placeholder="商品上市日期"
          end-placeholder="商品下市日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="出售价格(元)" prop="merchantPrice" :label-width="formLabelWidth">
        <el-input type="number" v-model="ruleForm1.merchantPrice" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="area" label="配送范围" prop="distribution" :label-width="formLabelWidth">
        <el-cascader
          :props="props"
          :options="areaOptions"
          clearable
          v-model="ruleForm1.distribution"
        ></el-cascader>
      </el-form-item>
      <div class="up-tit">请上传一到五张图片</div>
      <div class="img_box">
        <div
          class="img_size"
          v-for="(item,index) of imgList"
          :key="index"
          v-show="imgList.length!=0"
        >
          <viewer :images="[item]">
            <img :src="item" />
          </viewer>
          <div class="remove_logo" @click="fileDel(index)">X</div>
        </div>
        <div class="add_img" @click="fileClick" v-show="addState">
          <span>+</span>
        </div>
        <input
          id="inpu"
          name="files"
          style="display: none;"
          @change="fileChange($event)"
          type="file"
          ref="file"
          accept="image/*"
        />
      </div>
      <!-- <el-form-item>
        <div class="upload-title">商品图片(最少上传一张)</div>
        <el-upload
          class="uploader"
          action
          accept="image/jpeg, image/gif, image/png"
          :auto-upload="false"
          list-type="picture-card"
          :on-change="onGoodsUploadChange"
          :on-remove="handleRemove"
        >
        </el-upload>
      </el-form-item>-->
    </el-form>
    <el-form
      v-if="addPage == '2'"
      class="info-form"
      :model="ruleForm2"
      status-icon
      ref="ruleForm2"
      :rules="rules"
      :inline="true"
      :label-position="labelPosition"
    >
      <div>
        <el-form-item>
          <div class="upload-title">企业图片</div>
          <el-upload
            class="uploader"
            action
            :show-file-list="false"
            :auto-upload="false"
            accept="image/jpeg, image/gif, image/png"
            :on-change="onIdentityUploadChange"
          >
            <img v-if="identityImageUrl" :src="identityImageUrl" class="identity" />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro1" :label-width="formLabelWidth">
          <el-input
            :clearable="true"
            style="width: 500px; max-width: 100%"
            :rows="6"
            minlength="30"
            type="textarea"
            v-model="ruleForm2.intro1"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item>
          <div class="upload-title">商品图片</div>
          <el-upload
            class="uploader"
            action
            accept="image/jpeg, image/gif, image/png"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onBusinessUploadChange"
          >
            <img v-if="businessImageUrl" :src="businessImageUrl" class="identity" />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品介绍" prop="intro2" :label-width="formLabelWidth">
          <el-input
            :clearable="true"
            style="width: 500px"
            :rows="6"
            minlength="30"
            type="textarea"
            v-model="ruleForm2.intro2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item>
          <div class="upload-title">食用方法图片</div>
          <el-upload
            class="uploader"
            action
            :show-file-list="false"
            :auto-upload="false"
            accept="image/jpeg, image/gif, image/png"
            :on-change="onmethodUploadChange"
          >
            <img v-if="methodImageUrl" :src="methodImageUrl" class="identity" />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="食用方法介绍" prop="intro3" :label-width="formLabelWidth">
          <el-input
            :clearable="true"
            style="width: 500px"
            :rows="6"
            minlength="30"
            type="textarea"
            v-model="ruleForm2.intro3"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="canSubmit" @click="submitForm">提 交</el-button>
      <el-button type="primary" plain @click="resetForm">重 置</el-button>
      <el-button type="info" @click="cancelDialog">取 消</el-button>
    </div>
  </div>
</template>
<script>
import all from "../../data/city.json";
import sorts from "../../data/productSort.json";
import { compress } from "src/assets/js/compress";
export default {
  components: {},
  props: ["goods"],
  data() {
    return {
      canSubmit: true,
      areaOptions: all,
      formLabelWidth: "100px",
      labelPosition: "top",
      loading: false,
      props: { multiple: true, checkStrictly: true },
      type: localStorage.getItem("type"),
      dialogAddGoodsVisible: false,
      addPage: "1", //form表单页码
      identityImageUrl: "", //企业图片
      businessImageUrl: "", //商品图片
      methodImageUrl: "", //食用方法
      reason: "",
      ruleForm1: {
        name: "",
        farm: JSON.parse(localStorage.getItem("user")).name,
        specs: "",
        seasinal: [],
        merchantPrice: "",
        distribution: ""
      },
      ruleForm2: {
        intro1: "",
        intro2: "",
        intro3: ""
      },
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        specs: [{ required: true, message: "请输入产品规格", trigger: "blur" }],
        seasinal: [
          {
            required: true,
            message: "请选择应季期",
            trigger: "change"
          }
        ],
        merchantPrice: [
          { required: true, message: "请输入出售价格", trigger: "blur" }
        ],
        distribution: [
          { required: true, message: "请选择配送范围", trigger: "change" }
        ],
        intro1: [
          { required: true, message: "请填写您的企业简介", trigger: "change" }
        ],
        intro2: [
          { required: true, message: "请填写商品简介", trigger: "change" }
        ],
        intro3: [
          { required: true, message: "请填写食用方法简介", trigger: "change" }
        ]
      },
      imgList: [],
      goodsList: [],
      addState: true
    };
  },
  created() {
    let opts = JSON.parse(JSON.stringify(all));
    $.each(opts, (index, item) => {
      $.each(item.children, (secondIndex, secondItem) => {
        delete secondItem.children;
      });
    });
    this.areaOptions = opts;
    // this.areaOptions = all.map(item => {
    //   return {
    //     value: item.value,
    //     label: item.label
    //   };
    // });
  },
  mounted() {
    this.getGoodsInfo();
  },
  watch: {
    goods(val) {
      this.getGoodsInfo();
    },
    imgList() {
      if (this.imgList.length < 5) {
        this.addState = true;
      } else {
        this.addState = false;
      }
    }
  },
  computed: {},
  methods: {
    fileClick() {
      document.getElementById("inpu").click();
    },
    fileChange(e) {
      console.log(e.target.files[0].size);
      if((e.target.files[0].size / 1024 / 1024) > 2) {
        this.$message({
          message: "图片大小不能超过2M！",
          type: "error",
          duration: 2000
        });
        return false;
      }
      this.canSubmit = true;
      var reader = new FileReader();
      reader.readAsArrayBuffer(e.target.files[0]);
      reader.onload = event => {
        // blob stuff
        var blob = new Blob([event.target.result]); // create blob...
        let blobURL = this.getObjectURL(blob); // and get it's URL
        this.imgList.push(blobURL);
        // this.getGoodsList();
        this.upload(blobURL);
      };
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    fileDel(index) {
      this.canSubmit = true;
      this.imgList.splice(index, 1);
      // this.getGoodsList();
      this.goodsList.splice(index, 1);
      this.canSubmit = false;
    },
    getGoodsList() {
      this.goodsList = [];
      $.each(this.imgList, (index, item) => {
        this.upload(item);
      });
    },
    //回显商品图片
    showGoodsList() {
      this.imgList = [];
      let arr = this.goods.goodsProductName.split(",");
      console.log(arr);
      $.each(arr, (index, item) => {
        this.imgList.push(this.goods.goodsPicList[0].picPath + "/" + item);
      });
      // this.imgList = arr.map(item => {
      //   return this.goods.goodsPicList[0].picPath + "/" + item;
      // });
      this.getGoodsList();
      // for (let i = 0; i < arr.length; i++) {
      //   this.upload(this.goods.goodsPicList[0].picPath + "/" + arr[i]);
      // }
    },
    //图片路径转化为blob
    upload(src) {
      // if (!HTMLCanvasElement.prototype.toBlob) {
      //     Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      //       value: function (callback, type, quality) {   
      //         var canvas = this;                        
      //         setTimeout(function () {                          
      //           var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]);
      //           var len = binStr.length;                          
      //           var arr = new Uint8Array(len);
      //           for (var i = 0; i < len; i++) {                            
      //             arr[i] = binStr.charCodeAt(i);                          
      //           }                           
      //           callback(new Blob([arr], { type: type || 'image/png' }));
      //         });                      
      //       }                    
      //     });                  
      //   }
      var img = new Image();
      img.setAttribute("crossorigin", "anonymous");
      img.src = src;
      img.onload = () => {
        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext("2d");
        cvs.width = img.width;
        cvs.height = img.height;
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
        cvs.toBlob(e => {
          let file = new window.File(
            [new Blob([e], { type: "mime" })],
            "test.jpeg",
            {
              type: "image/jpeg"
            }
          );
          this.goodsList.push(file);
          if(this.imgList.length == this.goodsList.length) {
            this.canSubmit = false;
          }
        });
      };
    },
    //获取父组件商品信息
    getGoodsInfo() {
      this.ruleForm1 = {
        name: this.goods.name,
        specs: this.goods.specs,
        seasinal: [
          this.goods.seasinal.split("#")[0],
          this.goods.seasinal.split("#")[1]
        ],
        merchantPrice: this.goods.merchantPrice,
        // distribution: this.goods.distribution.split(",")
        distribution: this.getAreaNums()
      };
      this.imgList = [];
      this.goodsList = [];
      if (this.goods.goodsProductName) {
        this.showGoodsList();
      }
    },
    getAreaNums() {
      let areas = [];
      let _areas = [];
      $.each(this.goods.areaNums, (index, item) => {
        areas.push(item);
      });
      $.each(areas, (index, item) => {
        if(item.length > 1) {
          item = item.split(',');
        }
        _areas.push(item);
      });
      return _areas;
    },
    //关闭form表单窗口
    cancelDialog() {
      this.upEmit();
    },
    //本地浏览商品图片
    onGoodsUploadChange(file, fileList) {
      this.getGoodsFileList(file, fileList);
    },
    getGoodsFileList(file, fileList) {
      compress(file.raw, val => {
        this.fileList.push(val); // 或者 this.localFile=file.raw
      });
    },
    //删除多选商品图片
    handleRemove(file, fileList) {
      this.DeleteGoodsFileList(file, fileList);
    },
    DeleteGoodsFileList(file, fileList) {
      this.fileList = [];
      fileList.forEach(item => {
        compress(file.raw, val => {
          this.fileList.push(val); // 或者 this.localFile=file.raw
        });
      });
    },
    //本地浏览身份证图片
    onIdentityUploadChange(file) {
      const idLt10M = file.size / 1024 / 1024 < 10;
      if (!idLt10M) {
        this.$message.error("上传如片大小不能超过 10M！");
        return false;
      } else {
        compress(file.raw, val => {
          this.localIdentityFile = val; // 或者 this.localFile=file.raw
          let reader = new FileReader();
          reader.readAsDataURL(this.localIdentityFile); //这里也可以直接写参数event.raw
          reader.onload = () => {
            this.identityImageUrl = reader.result;
          };
        });
      }
    },
    //本地预览营业执照图片
    onBusinessUploadChange(file) {
      const idLt10M = file.size / 1024 / 1024 < 10;
      if (!idLt10M) {
        this.$message.error("上传如片大小不能超过 10M！");
        return false;
      } else {
        compress(file.raw, val => {
          this.localBusinessFile = val; // 或者 this.localFile=file.raw
          let reader = new FileReader();
          reader.readAsDataURL(this.localBusinessFile); //这里也可以直接写参数event.raw
          reader.onload = () => {
            this.businessImageUrl = reader.result;
          };
        });
      }
    },
    //本地预览食用方法图片
    onmethodUploadChange(file) {
      const idLt10M = file.size / 1024 / 1024 < 10;
      if (!idLt10M) {
        this.$message.error("上传如片大小不能超过 10M！");
        return false;
      } else {
        compress(file.raw, val => {
          this.localMethodFile = val; // 或者 this.localFile=file.raw
          let reader = new FileReader();
          reader.readAsDataURL(this.localMethodFile); //这里也可以直接写参数event.raw
          reader.onload = () => {
            this.methodImageUrl = reader.result;
          };
        });
      }
    },
    submitForm() {
      let formName = this.addPage == "1" ? "ruleForm1" : "ruleForm2";
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData();
          if (this.addPage == "1") {
            console.log(this.goodsList.length, this.imgList.length);
            if (!this.goodsList.length) {
              this.$message.error("请上传一到五张商品图片");
            } else {
              if (this.goodsList.length < this.imgList.length) {
                this.$message({
                  type: "error",
                  message: "请重试",
                  duration: 2000
                });
                return false;
              }
              let distribution = [];
              distribution = this.ruleForm1.distribution.map(item => {
                return item.length == 2 ? item[1] : item[0];
              });
              console.log(distribution);
              this.goodsList.forEach(item => {
                  formData.append("productImages", item);
                });
              formData.append("type", "1");
              formData.append("name", this.ruleForm1.name);
              formData.append("goodsAddId", this.goods.id);
              formData.append("seasinalOnDate", this.ruleForm1.seasinal[0]);
              formData.append("seasinalOffDate", this.ruleForm1.seasinal[1]);
              formData.append("merchantPrice", this.ruleForm1.merchantPrice);
              formData.append("specs", this.ruleForm1.specs);
              formData.append("distribution", distribution);
              this.changeSub(formData);
            }
          } else {
            formData.append("type", "2");
            formData.append("goodsAddId", this.goods.id);
            formData.append("file1", this.localIdentityFile);
            formData.append("file2", this.localBusinessFile);
            formData.append("file3", this.localMethodFile);
            formData.append("intro1", this.ruleForm2.intro1);
            formData.append("intro2", this.ruleForm2.intro2);
            formData.append("intro3", this.ruleForm2.intro3);
            formData.append("name", this.goods.name);
            this.changeSub(formData);
          }
        }
      });
    },
    upEmit() {
      this.$emit("childChange", {});
    },
    changeSub(data) {
      this.axios
        .post("/goods/goodsAddInfoEdit", data)
        .then(res => {
          this.success(res);
        })
        .catch(error => {
          this.$message({
          message: "上传失败，请重试！",
          type: "error",
          duration: 2000
        });
        });
    },
    success(res) {
      if (res.code == 1) {
        this.$message({
          message: res.msg,
          type: "success",
          duration: 2000
        });
      } else {
        this.$message({
          message: res.msg,
          type: "error",
          duration: 2000
        });
      }
      this.resetForm();
      this.upEmit();
    },
    //重置商品表单
    resetForm() {
      if (this.addPage == "1") {
        this.$refs["ruleForm1"].resetFields();
        this.imgList = [];
        this.goodsList = [];
      } else {
        this.$refs["ruleForm2"].resetFields();
        this.identityImageUrl = "";
        this.businessImageUrl = "";
        this.methodImageUrl = "";
      }
    },
    //上架日期格式化
    getAddedDate(row, column) {
      return row.addedDate.split(" ")[0];
    },
    //下架日期格式化
    getOffDate(row, column) {
      return row.offDate.split(" ")[0];
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/mixin";
.basic {
  .radio-group {
    margin-bottom: 20px;
  }
  .header {
    min-width: 900px;
    @include fx(flex-start);
    .add-btn {
      font-weight: bold;
      font-size: 18px;
      margin-left: 10px;
    }
    .sort {
      margin-left: 40px;
    }
    .radio-group,
    .casa {
      margin-left: 20px;
    }
  }
  .recommend-tag {
    display: inline-block;
    margin: 4px 0;
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }
  .checkbox-group {
    margin-left: 20px;
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
  .info-title {
    font-size: 16px;
    margin-bottom: 20px;
  }
  .reason {
    @include fx(flex-start);
    @include sc(16px, #e4393c);
    margin-bottom: 20px;
  }
  .info-form {
    padding-left: 20px;
  }
}
.img_size {
  width: 120px;
  height: 124px;
  position: relative;
  margin-right: 10px;
  img {
    display: block;
    width: 120px;
    height: 124px;
  }
}
.up-tit {
  margin: 20px 0;
}
.img_box {
  width: 100%;
  padding: 0 2%;
  display: flex;
  margin-bottom: 20px;
  flex-wrap: wrap;
  .add_img {
    width: 100px;
    height: 100px;
    border: 1px dashed #999;
    @include fx(center);
    font-size: 30px;
    cursor: pointer;
  }
  .remove_logo {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #999;
    top: 0;
    right: 0;
    text-align: center;
    font-size: 20px;
    color: #555;
  }
}
</style>
