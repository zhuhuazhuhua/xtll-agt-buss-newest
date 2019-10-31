<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <div>
              <span>商品信息</span>
              <span class="sort">
                商品分类
                <el-cascader class="casa" v-model="value" :options="options" @change="handleChange"></el-cascader>
              </span>
              <el-button type="text" @click="addGoods" class="add-btn">新增商品</el-button>
            </div>
          </div>
          <div class="table-wrapper">
            <el-table v-loading="loading" element-loading-text="加载数据中" :data="tableData" border>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" class="table-expand">
                    <el-form-item label="商品名称">
                      <span>{{props.row.name}}</span>
                    </el-form-item>
                    <el-form-item label="所属农场">
                      <span>{{props.row.farm}}</span>
                    </el-form-item>
                    <el-form-item label="产品规格">
                      <span>{{props.row.specs}}</span>
                    </el-form-item>
                    <el-form-item label="应季期(月)">
                      <span>{{props.row.seasinal}}</span>
                    </el-form-item>
                    <el-form-item label="商品上市日期">
                      <span>{{props.row.addedDate}}</span>
                    </el-form-item>
                    <el-form-item label="商品下市日期">
                      <span>{{props.row.offDate}}</span>
                    </el-form-item>
                    <el-form-item label="商户售价(元)">
                      <span>{{props.row.merchantPrice}}</span>
                    </el-form-item>
                    <el-form-item label="平台售价(元)">
                      <span>{{props.row.platformPrice}}</span>
                    </el-form-item>
                    <el-form-item label="配送范围">
                      <div style="max-width: 500px!important;">
                        <span
                          class="nowrap"
                          v-for="(item, index) in props.row.areas"
                          :key="index"
                        >{{item.province + ', '}}</span>
                      </div>
                    </el-form-item>
                    <el-form-item label="商品图片" v-if="props.row.goodsPicList[0].goodsProductName">
                      <viewer
                        :images="filePaths(props.row.goodsPicList[0].picPath, props.row.goodsProductName)"
                      >
                        <img
                          class="img"
                          v-for="(item, index) in props.row.goodsProductName.split(',')"
                          :key="index"
                          :src="props.row.goodsPicList[0].picPath + '/' + item"
                          alt
                        />
                      </viewer>
                    </el-form-item>
                    <el-form-item label="公司介绍">
                      <div>{{props.row.goodsPicList[0].intro1}}</div>
                      <viewer
                        :images="[props.row.goodsPicList[0].picPath + '/' + props.row.goodsPicList[0].goodsPicName.split(',')[0]]"
                      >
                        <img
                          class="img"
                          :src="props.row.goodsPicList[0].picPath + '/' + props.row.goodsPicList[0].goodsPicName.split(',')[0]"
                          alt
                        />
                      </viewer>
                    </el-form-item>
                    <el-form-item label="产品介绍">
                      <div>{{props.row.goodsPicList[0].intro2}}</div>
                      <viewer
                        :images="[props.row.goodsPicList[0].picPath + '/' + props.row.goodsPicList[0].goodsPicName.split(',')[1]]"
                      >
                        <img
                          class="img"
                          :src="props.row.goodsPicList[0].picPath + '/' + props.row.goodsPicList[0].goodsPicName.split(',')[1]"
                          alt
                        />
                      </viewer>
                    </el-form-item>
                    <el-form-item label="食用方法介绍">
                      <div>{{props.row.goodsPicList[0].intro3}}</div>
                      <viewer
                        :images="[props.row.goodsPicList[0].picPath + '/' + props.row.goodsPicList[0].goodsPicName.split(',')[2]]"
                      >
                        <img
                          class="img"
                          :src="props.row.goodsPicList[0].picPath + '/' + props.row.goodsPicList[0].goodsPicName.split(',')[2]"
                          alt
                        />
                      </viewer>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="name" align="center"></el-table-column>
              <el-table-column label="所属农场" prop="farm" align="center"></el-table-column>
              <el-table-column label="产品规格" prop="specs" align="center"></el-table-column>
              <el-table-column label="应季期(月)" prop="seasinal" align="center"></el-table-column>
              <el-table-column label="商品上市日期" min-width="120px" prop="addedDate" align="center"></el-table-column>
              <el-table-column label="商品下市日期" min-width="120px" prop="offDate" align="center"></el-table-column>
              <el-table-column label="商户售价(元)" prop="merchantPrice" align="center"></el-table-column>
              <el-table-column label="平台售价(元)" prop="platformPrice" align="center"></el-table-column>
              <el-table-column label="利润率" align="center" prop>
                <template slot-scope="scope">
                  <span>{{((scope.row.platformPrice - scope.row.merchantPrice) / scope.row.merchantPrice * 100).toFixed(3)}}%</span>
                </template>
              </el-table-column>
              <el-table-column label="配送范围" prop="areas" align="center">
                <template slot-scope="scope">
                  <div style="max-height: 50px!important;">
                    <span
                      class="nowrap"
                      v-for="(item, index) in scope.row.areas"
                      :key="index"
                    >{{item.province + ', '}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="审核状态" align="center">
                <template slot-scope>
                  <el-button size="mini" type="info">已通过</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="goodsDown(scope.row)">下架</el-button>
                  <el-button size="mini" type="primary" @click="changed(scope.row)">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 16px; text-align:right;"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5, 10, 15, 20]"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
          <el-dialog
            title="新增商品"
            :visible.sync="dialogAddGoodsVisible"
            :modal-append-to-body="false"
          >
            <el-form
              v-show="addPage == '1'"
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
              <el-form-item label="商品种类" prop="goodsType" :label-width="formLabelWidth">
                <el-cascader class="casa" v-model="ruleForm1.goodsType" :options="options1"></el-cascader>
              </el-form-item>
              <!-- <el-form-item label="农场名称" prop="farm" :label-width="formLabelWidth">
                <el-input v-model="ruleForm1.farm" autocomplete="off"></el-input>
              </el-form-item>-->
              <el-form-item label="产品规格" prop="specs" :label-width="formLabelWidth">
                <el-input v-model="ruleForm1.specs" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="应季期(全年配送请选择1月1号到1月1号)"
                prop="seasinal"
                :label-width="formLabelWidth"
              >
                <el-date-picker
                  v-model="ruleForm1.seasinal"
                  type="daterange"
                  value-format="MM-dd"
                  format="MM-dd"
                  range-separator="至"
                  start-placeholder="商品上市日期"
                  end-placeholder="商品下市日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="出售价格(元)" prop="merchantPrice" :label-width="formLabelWidth">
                <el-input type="number" v-model="ruleForm1.merchantPrice" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                class="area"
                label="配送范围"
                prop="distribution"
                :label-width="formLabelWidth"
              >
                <el-cascader
                  :props="props"
                  :options="areaOptions"
                  clearable
                  v-model="ruleForm1.distribution"
                ></el-cascader>
              </el-form-item>
              <el-form-item>
                <div class="upload-title">商品图片(最少上传一张)</div>
                <el-upload
                  class="uploader"
                  action
                  accept="image/jpeg, image/gif, image/png"
                  :auto-upload="false"
                  list-type="picture-card"
                  :on-change="onGoodsUploadChange"
                  :on-remove="handleRemove"
                ></el-upload>
              </el-form-item>
              <div class="info-title">
                <el-button type="primary" @click="submitForm('ruleForm1')">下一页</el-button>
                <el-button type="primary" plain @click="resetForm('ruleForm1')">重 置</el-button>
              </div>
            </el-form>
            <el-form
              v-show="addPage == '2'"
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
              <div class="info-title">
                <el-button type="primary" @click="addPage = '1'">上一页</el-button>
                <el-button type="primary" plain @click="resetForm('ruleForm2')">重 置</el-button>
              </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button v-show="addPage== '2'" type="primary" @click="submitForm('ruleForm2')">提 交</el-button>
              <el-button type="info" @click="cancelDialog">取 消</el-button>
            </div>
          </el-dialog>
          <el-dialog title="商品修改" :visible.sync="dialogChangeVisible" :modal-append-to-body="false">
            <goods-change :goods="changedGoods" @childChange="getChildChange"></goods-change>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import all from "../../data/city.json";
import sorts from "../../data/productSort.json";
import goodsChange from "./goods-change";
import { compress } from "src/assets/js/compress";
export default {
  components: {
    goodsChange
  },
  data() {
    return {
      areaOptions: [],
      formLabelWidth: "100px",
      statusType: "1,4,5",
      labelPosition: "top",
      props: { multiple: true },
      rate: "",
      dialogVisible: false,
      loading: false,
      tableData: [],
      total: 0,
      value: ["1"],
      options: sorts,
      options1: [],
      pagesize: 10,
      currentpage: 1,
      goodsType: "1",
      type: localStorage.getItem("type"),
      dialogAddGoodsVisible: false,
      dialogChangeVisible: false,
      changedGoods: {},
      fileList: [],
      addPage: "1", //form表单页码
      identityImageUrl: "", //企业图片
      businessImageUrl: "", //商品图片
      methodImageUrl: "", //食用方法
      reason: "",
      id: "",
      ruleForm1: {
        name: "",
        goodsType: "",
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
        goodsType: [
          { required: true, message: "请选择商品种类", trigger: "change" }
        ],
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
      }
    };
  },
  created() {
    this.areaOptions = all.map(item => {
      return {
        value: item.value,
        label: item.label
      };
    });
  },
  mounted() {
    this.getTableData("1");
    this.getSort();
  },
  watch: {
    // value(val) {
    //   this.value = val;
    //   console.log(val);
    //   this.getTableData();
    // }
  },
  computed: {},
  methods: {
    //图片组url拼接
    filePaths(filePath, paths) {
      let lastPaths = paths.split(",");
      let allPaths = lastPaths.map(item => {
        return filePath + "/" + item;
      });
      return allPaths;
    },
    //修改页面提交或者取消
    getChildChange(e) {
      this.dialogChangeVisible = false;
    },
    getSort() {
      this.axios
        .get("/showChoose")
        .then(res => {
          this.getSortList(res.msg);
        })
        .catch();
    },
    getSortList(list) {
      console.log(list);
      this.options1 = JSON.parse(
        JSON.stringify(list)
          .replace(/list/g, "children")
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      this.options = JSON.parse(
        JSON.stringify(list)
          .replace(/list/g, "children")
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      this.options.unshift({
        value: "1",
        label: "全部"
      });
    },
    getTableData() {
      let data = {
        pageNum: this.currentpage,
        pageSize: this.pagesize,
        goodType: this.goodsType,
        status: "1,4,5"
      };
      this.axios
        .post("/goods/findGoodsByPage", data)
        .then(res => {
          if (res.code == "1") {
            console.log(res);
            this.tableData = res.rows;
            this.total = res.total;
          }
        })
        .catch();
    },
    //关闭form表单窗口
    cancelDialog() {
      this.dialogAddGoodsVisible = false;
      this.addPage = "1";
      this.reset();
    },
    changed(row) {
      this.changedGoods = row;
      this.dialogChangeVisible = true;
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
    //新增商品
    addGoods() {
      this.dialogAddGoodsVisible = true;
    },
    //添加商品提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addPage == "2") {
            if (
              !this.identityImageUrl ||
              !this.businessImageUrl ||
              !this.methodImageUrl
            ) {
              this.$message({
                message: "请上传图片",
                type: "error",
                duration: 2000
              });
            } else {
              let url = "/goods/addGoods";
              let formData = new FormData();
              let distribution = [];
              distribution = this.ruleForm1.distribution.map(item => {
                return item[0];
              });
              formData.append("name", this.ruleForm1.name);
              formData.append("goodsType", this.ruleForm1.goodsType);
              formData.append("farm", this.ruleForm1.farm);
              formData.append("specs", this.ruleForm1.specs);
              formData.append("seasinalOnDate", this.ruleForm1.seasinal[0]);
              formData.append("seasinaloffDate", this.ruleForm1.seasinal[1]);
              formData.append("merchantPrice", this.ruleForm1.merchantPrice);
              this.fileList.forEach(item => {
                formData.append("productImages", item);
              });
              formData.append("distribution", distribution);
              formData.append("file1", this.localIdentityFile);
              formData.append("file2", this.localBusinessFile);
              formData.append("file3", this.localMethodFile);
              formData.append("intro1", this.ruleForm2.intro1);
              formData.append("intro2", this.ruleForm2.intro2);
              formData.append("intro3", this.ruleForm2.intro3);
              this.upFormData(url, formData);
            }
          } else {
            if (!this.fileList.length) {
              this.$message({
                message: "请上传商品图片",
                type: "error",
                duration: 2000
              });
            } else {
              this.addPage = "2";
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    upFormData(url, formData) {
      this.axios
        .post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
          this.success(res);
        })
        .catch(() => {});
    },
    success(res) {
      if (res.code == 1) {
        this.$message({
          message: res.msg,
          type: "success",
          duration: 2000
        });
        this.reset();
        this.getTableData();
      } else {
        this.$message({
          message: res.msg,
          type: "error",
          duration: 2000
        });
      }
    },
    reset() {
      this.resetForm("ruleForm1");
      this.resetForm("ruleForm2");
      this.addPage = "1";
      this.identityImageUrl = "";
      this.businessImageUrl = "";
      this.methodImageUrl = "";
    },
    //商户下架商品
    goodsDown(row) {
      this.$confirm(`即将申请下架此商品，是否继续？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let formData = new FormData();
          formData.append("type", "3");
          formData.append("status", "5");
          console.log(row);
          formData.append("goodsAddId", row.id);
          this.axios
            .post("/goods/goodsAddInfoEdit", formData)
            .then(res => {
              if (res.code == 1) {
                this.$message({
                  message: res.msg,
                  type: "success",
                  duration: 2000
                });
                this.getTableData();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                  duration: 2000
                });
              }
            })
            .catch();
        })
        .catch(() => {});
    },
    //重置商品表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //上架日期格式化
    getAddedDate(row, column) {
      return row.addedDate.split(" ")[0];
    },
    //下架日期格式化
    getOffDate(row, column) {
      return row.offDate.split(" ")[0];
    },
    //商品种类
    handleChange(value) {
      this.goodsType = value.join(",");
      value != "1" && this.$set(this.ruleForm1, "goodsType", value);
      this.getTableData();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getTableData();
    },
    handleCurrentChange(value) {
      this.currentpage = value;
      this.getTableData();
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/mixin";
@import "../../assets/styles/goods";
</style>
