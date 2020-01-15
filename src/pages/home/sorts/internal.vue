<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <div>
              <span>账户列表</span>
              <el-button v-if="perm5" type="text" @click="addNew" class="add-btn">新增商户</el-button>
            </div>
            <el-cascader class="casa" v-model="areaId" placeholder="请选择区域" :options="provinceOptions" @change="handleChange"></el-cascader>
            <div class="check-group">
              <el-radio-group class="unPass" v-model="statusType">
                <el-radio :label="6">内部创建审核中</el-radio>
                <el-radio :label="7">内部审核未通过</el-radio>
              </el-radio-group>
            </div>
            <el-dialog v-if="perm5" title="新增商户" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
              <el-form
                :model="ruleForm"
                status-icon
                ref="ruleForm"
                :rules="rules"
                :inline="true"
                :label-position="labelPosition"
              >
                <el-form-item label="账号" prop="username" :label-width="formLabelWidth">
                  <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                  label="农场名"
                  prop="name"
                  :label-width="formLabelWidth"
                >
                  <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="idCard" :label-width="formLabelWidth">
                  <el-input v-model="ruleForm.idCard" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phoneNumber" :label-width="formLabelWidth">
                  <el-input v-model="ruleForm.phoneNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="合作期限" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="time"
                    type="monthrange"
                    value-format="yyyy-M"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  class="area"
                  label="选择区域"
                  prop="areaChoose"
                  :label-width="formLabelWidth"
                >
                  <el-cascader
                    :options="areaOptions"
                    :props="props"
                    clearable
                    v-model="ruleForm.areaChoose"
                  ></el-cascader>
                </el-form-item>
                <el-form-item
                  class="area"
                  label="请输入详细地址"
                  prop="address"
                  label-width="120px"
                >
                  <el-input v-model="ruleForm.address" autocomplete="off"></el-input>
                </el-form-item>
                <div>
                  <el-form-item>
                    <div class="upload-title">请上传身份证正面照</div>
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
                  <el-form-item>
                    <div class="upload-title">请上传营业执照</div>
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
                  <div>
                    <el-form-item>
                      <div class="upload-title">其他证件照(非必传)</div>
                      <el-upload
                        class="uploader"
                        action
                        accept="image/jpeg, image/gif, image/png"
                        :auto-upload="false"
                        list-type="picture-card"
                        :on-change="onOtherUploadChange"
                        :on-remove="handleRemove"
                      ></el-upload>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
                <el-button type="primary" plain @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
              </div>
            </el-dialog>
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              element-loading-text="加载数据中"
              element-loading-spinner="el-icon-loading"
              :data="tableData"
              border
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" class="table-expand">
                    <el-form-item v-if="props.row.status == '7'" label="审核未通过原因">
                      <span>{{props.row.remark}}</span>
                    </el-form-item>
                    <el-form-item label="账号">
                      <span>{{props.row.loginName}}</span>
                    </el-form-item>
                    <el-form-item label="农场名">
                      <span>{{props.row.name}}</span>
                    </el-form-item>
                    <el-form-item label="手机号">
                      <span>{{ props.row.telephone }}</span>
                    </el-form-item>
                    <el-form-item label="合作期限：">
                      <span>{{ props.row.startDate + ' 至 ' + props.row.endDate}}</span>
                    </el-form-item>
                    <el-form-item label="所在区域">
                      <span
                        class="item-num"
                      >{{props.row.areas[0].province + ',' 
                      + props.row.areas[0].city + ',' 
                      + props.row.areas[0].district}}</span>
                      <div>{{props.row.address}}</div>
                    </el-form-item>
                    <el-form-item label="身份证证件照">
                      <viewer :images="[props.row.filePath + '/' + props.row.cardidName]"> 
                        <img class="img" :src="props.row.filePath + '/' + props.row.cardidName" alt="">
                      </viewer>
                    </el-form-item>
                    <el-form-item label="营业执照">
                      <viewer :images="[props.row.filePath + '/' + props.row.certificateName]"> 
                        <img class="img" :src="props.row.filePath + '/' + props.row.certificateName" alt="">
                      </viewer>
                    </el-form-item>
                    <el-form-item label="企业资质(附)" v-if="props.row.logo">
                      <viewer :images="filePaths(props.row.filePath, props.row.logo)">
                        <img v-for="(item, index) in props.row.fileList.split(',')" :key="index"
                          class="img"
                          :src="props.row.filePath + '/' + item"
                          alt
                        />
                      </viewer>
                    </el-form-item>
                    <el-form-item label="其他证件" v-if="props.row.fileList">
                      <viewer :images="filePaths(props.row.filePath, props.row.fileList)">
                        <img v-for="(item, index) in props.row.fileList.split(',')" :key="index"
                          class="img"
                          :src="props.row.filePath + '/' + item"
                          alt
                        />
                      </viewer>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="账号" prop="loginName" align="center"></el-table-column>
              <el-table-column
                label="农场名"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column label="手机号" prop="telephone" align="center"></el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="info"
                    disabled
                  >{{scope.row.status == '6' && type == '3' ? '内部创建审核中' : '内部创建审核未通过'}}</el-button>
                </template>
              </el-table-column>
              <!-- <el-table-column v-if="perm4" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    v-if="scope.row.status == '6' && type == '3'"
                    @click="showExam(scope.row)"
                  >内部创建审核</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    v-if="scope.row.status == '4' && type == '3'"
                    @click="showExam(scope.row)"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    v-if="scope.row.status == '7' && type == '3'"
                    @click="showExam(scope.row)"
                  >修改</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <el-pagination
              style="margin-top: 16px; text-align:right;"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-card>
        <!-- 内部审核弹框 -->
        <el-dialog v-if="perm4" :visible.sync="dialogExamVisible" :modal-append-to-body="false">
          <exam :objItem="examItem" @examUp="commit" :type="type"></exam>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import exam from "src/components/exam";
import citys from "src/data/citii";
import areaJson from "src/data/city";
import { compress } from "src/assets/js/compress";
import rules from 'src/assets/js/rules';
export default {
  components: {
    exam
  },
  data() {
    return {
      perm4: false,
      perm5: false,
      time: "",
      provinceOptions: [],
      tableData: [],
      loading: true,
      pagesize: 10,
      currentpage: 1,
      statusType: 6,
      total: 0,
      dialogFormVisible: false,
      ruleForm: {
        name: "",
        username: "",
        phoneNumber: "",
        idCard: "",
        role: "",
        areaChoose: [],
        companyName: ""
      },
      userFormData: {},
      rules,
      formLabelWidth: "100px",
      labelPosition: "left",
      identityImageUrl: "", //身份证
      businessImageUrl: "", //营业执照
      fileList: [],
      props: { multiple: false }, //地区允许多选
      areas: [],
      areaOptions: areaJson,
      type: 3, //账户列表类型,
      id: "",
      dialogExamVisible: false,
      examItem: {},
      areaId: '',
      loginType: localStorage.getItem('type')
    };
  },
  computed: {},
  watch: {
    //审核状态修改
    statusType(e) {
      this.statusType == e;
      this.getTableData();
    }
  },
  created() {
    this.getPermTrueOrFalse();
  },
   mounted() {
    this.getTableData();
    this.superPlat();
  },
  methods: {
    getPermTrueOrFalse() {
      this.perm4 = this.getTrueOrFalse("4");
      this.perm5 = this.getTrueOrFalse("5");
    },
    filePaths(filePath, paths) {
      let lastPaths = paths.split(',');
      let allPaths = lastPaths.map(item => {
        return filePath + '/' + item;
      });
      return allPaths;
    },
    //选择区域
    handleChange(e) {
      this.areaId = e[e.length-1];
      this.getTableData();
    },
    //判断是否是超管
    superPlat() {
      let mark = localStorage.getItem("areaNums");
      this.mark = mark;
      if (!mark) {
        this.areaOptions = areaJson;
        this.provinceOptions = areaJson;
      } else {
        this.getProvinces();
      }
    },
    getProvinces() {
      let proFirst = new Set();
      JSON.parse(this.mark).forEach(item => {
        proFirst.add(item.split(",")[0]);
      });
      let firstData = [];
      proFirst.forEach(item => {
        firstData.push(
          citys.filter(x => {
            return x.ParentPath == item;
          })
        );
      });
      this.provinceOptions = firstData.map(item => {
        return {
          value: item[0].ParentPath,
          label: item[0].Province,
          children: []
        };
      });
      $.each(this.provinceOptions, (index, item) => {
        let proSecond = new Set();
        JSON.parse(this.mark).forEach(numItem => {
          if (numItem.split(",")[0] == item.value) {
            proSecond.add(numItem.split(",")[1]);
          }
        });
        let secondData = [];
        proSecond.forEach(secondItem => {
          secondData.push(
            citys.filter(x => {
              return (
                x.ParentPath &&
                x.ParentPath.split(",")[1] == secondItem &&
                x.ParentPath.split(",").length == 2
              );
            })
          );
        });
        item.children = secondData.map(second => {
          return {
            value: second[0].ParentPath.split(",")[1],
            label: second[0].City,
            children: []
          };
        });
      });
      $.each(this.provinceOptions, (index, item) => {
        $.each(item.children, (secondIndex, secondItem) => {
          let proThird = [];
          JSON.parse(this.mark).forEach(markItem => {
            if (markItem.split(",")[1] == secondItem.value) {
              proThird.push(markItem.split(",")[2]);
            }
          });
          let thirdData = [];
          proThird.forEach(thirdItem => {
            thirdData.push(
              citys.filter(x => {
                return (
                  x.ParentPath &&
                  x.ParentPath.split(",")[2] == thirdItem &&
                  x.ParentPath.split(",").length == 3
                );
              })
            );
          });
          secondItem.children = thirdData.map(third => {
            return {
              value: third[0].ParentPath.split(",")[2],
              label: third[0].District
            };
          });
        });
      });
      this.areaOptions = this.provinceOptions;
    },
    //展示审核弹框
    showExam(examItem) {
      this.examItem = examItem;
      this.dialogExamVisible = true;
    },
    //提交审核
    commit(e) {
      if (e.commitType != "1") {
        let data = {
          id: this.examItem.id,
          status: this.examItem.status,
          remark: e.reason ? e.reason : ""
        };
        this.dialogExamVisible = false;
        this.axios
          .post("/buss/bussInfoAuditing", data)
          .then(res => {
            if (res.code == "1") {
              this.$message({
                message: res.msg,
                type: "success",
                duration: 2000
              });
              this.dialogExamVisible = false;
              this.getTableData();
              return false;
            }
          })
          .catch();
      }
      this.dialogExamVisible = false;
    },
    //新增账号打开dialog，并设置当前类型
    addNew() {
      this.dialogFormVisible = true;
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
    //本地预览其他证件照图片
    onOtherUploadChange(file, fileList) {
      this.getOtherFileList(file, fileList);
    },
    //获取添加其他证件照文件
    getOtherFileList(file, fileList) {
      compress(file.raw, val => {
        this.fileList.push(val); // 或者 this.localFile=file.raw
      });
    },
    //其他证件删除图片
    handleRemove(file, fileList) {
      this.DeleteOtherFileList(file, fileList);
    },
    DeleteOtherFileList(file, fileList) {
      this.fileList = [];
      fileList.forEach(item => {
        compress(file.raw, val => {
          this.fileList.push(val); // 或者 this.localFile=file.raw
        });
      });
    },
    //新增账号表单提交,
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.areas = [];
          // for (var i = 0; i < this.ruleForm.areaChoose.length; i++) {
          //   this.areas.push(
          //     this.ruleForm.areaChoose[i][
          //       this.ruleForm.areaChoose[i].length - 1
          //     ]
          //   );
          // }
          let formData = new FormData();
            formData.append("cardIdfile", this.localIdentityFile);
            formData.append("certenfile", this.localBusinessFile);
            formData.append("userCardid", this.ruleForm.idCard);
            formData.append("loginName", this.ruleForm.username);
            formData.append("name", this.ruleForm.name);
            formData.append("startDate", this.time[0]);
            formData.append("endDate", this.time[1]);
            formData.append("areasNum", this.ruleForm.areaChoose[2]);
            formData.append("telephone", this.ruleForm.phoneNumber);
            formData.append("address", this.ruleForm.address);
            this.fileList.forEach(item => {
              formData.append("multipartFile", item);
            });
            let url = "/buss/add";
            this.axios
              .post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" }
              })
              .then(res => {
                this.success(res);
              })
              .catch(() => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加账号
    add(url, formData, config) {
      this.axios.post(url, formData, config).then(res => {
        this.success(res);
      });
    },
    //添加账号成功回调
    success(res) {
      if (res.code == 1) {
        this.$message({
          message: res.msg,
          type: "success",
          duration: 2000
        });
        this.resetForm("ruleForm");
        this.getTableData();
      } else {
        this.$message({
          message: res.msg,
          type: "error",
          duration: 2000
        });
      }
    },
    //删除账号成功回调
    delUserSuccess(res) {
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
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.identityImageUrl = "";
      this.businessImageUrl = "";
      this.areas = [];
    },
    //页面初始化获取数据列表
    getTableData() {
      let data = {
        pageNum: this.currentpage,
        pageSize: this.pagesize,
        status: this.statusType,
        areaId: this.areaId
      };
      console.log(data);
      let url = "/buss/findBussByPage";
      this.axios
        .post(url, data)
        .then(res => {
          if (res.code == 1) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.loading = false;
          } else {
            this.tableData = [];
          }
        })
        .catch(error => {});
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getTableData();
    },
    handleCurrentChange(value) {
      this.currentpage = value;
      console.log(value);
      this.getTableData();
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../../assets/styles/mixin";
@import "../../../assets/styles/sorts";
</style>
