<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <div>
              <span>账户列表</span>
              <el-button type="text" @click="addNew" class="add-btn">新增账号</el-button>
            </div>
            <el-cascader class="casa" v-model="areaId" placeholder="请选择区域" :options="provinceOptions" @change="handleChange"></el-cascader>
            <el-dialog title="新增账号" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
              <el-form
                :model="ruleForm"
                status-icon
                ref="ruleForm"
                :rules="rules"
                :inline="true"
                :label-position="labelPosition"
              >
                <el-form-item
                  label="管理员姓名"
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
                <el-form-item
                  label="管理员级别"
                  prop="userClass"
                  :label-width="formLabelWidth"
                >
                  <el-select v-model="ruleForm.userClass" placeholder="请选择" @change="changeOptions">
                    <el-option
                      v-for="(item, index) in userClasses"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="管理员角色"
                  prop="role"
                  :label-width="formLabelWidth"
                >
                  <el-select v-model="ruleForm.role" placeholder="请选择" @change="changeRole">
                    <el-option
                      v-for="(item, index) in roleList"
                      :key="index"
                      :label="item.role"
                      :value="item.role"
                    ></el-option>
                  </el-select>
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
                  label="权限"
                  prop="powerChoose"
                  :label-width="formLabelWidth"
                >
                  <el-checkbox-group v-model="ruleForm.powerChoose" class="checkbox-group">
                    <el-checkbox
                      v-for="(item, index) in powerList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
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
                    <el-form-item label="账号">
                      <span>{{props.row.loginName}}</span>
                    </el-form-item>
                    <el-form-item label="角色">
                      <span>{{props.row.agtRoleName}}</span>
                    </el-form-item>
                    <el-form-item label="管理员名">
                      <span>{{props.row.name}}</span>
                    </el-form-item>
                    <el-form-item label="手机号">
                      <span>{{ props.row.telephone }}</span>
                    </el-form-item>
                    <el-form-item label="负责区域">
                      <div
                        class
                        v-for="(item, index) in props.row.areas"
                        :key="index"
                      >{{item.province ? item.province : '' + item.city ? item.city : '' + item.district ? item.district : ''}}</div>
                    </el-form-item>
                    <el-form-item label="权限">
                      <span>{{ getPower(props.row.perm) }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="账号" prop="loginName" align="center"></el-table-column>
              <el-table-column label="角色" prop="agtRoleName" align="center"></el-table-column>
              <el-table-column
                label="管理员名"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column label="手机号" prop="telephone" align="center"></el-table-column>
              <!-- <el-table-column label="状态" prop="status" align="center"></el-table-column> -->
              <!-- <el-table-column label="操作" align="center">
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
              :page-sizes="[5, 10, 15, 20]"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-card>
        <!-- 审核弹框 -->
        <el-dialog :visible.sync="dialogExamVisible" :modal-append-to-body="false">
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
import rules from 'src/assets/js/rules';
export default {
  components: {
    exam
  },
  mounted() {
    this.getTableData();
    this.superPlat();
    this.getRoleList();
  },
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入密码"));
    //   } else {
    //     if (this.ruleForm.prePassword !== "") {
    //       this.$refs.ruleForm.validateField("prePassword");
    //     }
    //     callback();
    //   }
    // };
    // var validatePass2 = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请再次输入密码"));
    //   } else if (value !== this.ruleForm.password) {
    //     callback(new Error("两次输入密码不一致!"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      time: "",
      provinceOptions: [],
      userClasses: [
        { value: "1", label: "省级管理员" },
        { value: "2", label: "市级管理员" },
        { value: "3", label: "区级管理员" }
      ],
      tableData: [],
      loading: true,
      pagesize: 10,
      currentpage: 1,
      total: 0,
      dialogFormVisible: false,
      ruleForm: {
        name: "",
        username: "",
        // password: "",
        // prePassword: "",
        phoneNumber: "",
        idCard: "",
        userType: "2",
        role: "",
        powerChoose: [],
        areaChoose: [],
        companyName: "",
        userClass: "" //管理员级别
      },
      userFormData: {},
      rules,
      formLabelWidth: "100px",
      roleList: [],
      powerList: [
        { value: "1", label: "商户添加" },
        { value: "2", label: "商户审核" }
      ],
      labelPosition: "left",
      identityImageUrl: "", //身份证
      businessImageUrl: "", //营业执照
      props: { multiple: true }, //地区允许多选
      areas: [],
      areaOptions: areaJson,
      type: 2, //账户列表类型,
      id: "",
      dialogExamVisible: false,
      examItem: {},
      areaId: '',
      loginType: localStorage.getItem('type')
    };
  },
  computed: {},
  watch: {
    
  },
  created() {
  },
  methods: {
    //选择区域
    handleChange(e) {
      this.areaId = e[e.length-1];
      this.getTableData();
    },
    //列表查询
    // polling(areaId) {
    //   areaId = '';
    //   let url = this.type == '2' ? '/agt/list' : '/buss/findBussByPage';
    //   this.axios.get(url + '?pageNum=' + this.currentpage + '&&pageSize=' + this.pagesize + '&&areaId=' + '111')
    //   .then(res => {
        
    //   })
    //   .catch();
    // },
    //管理员或者代理商级别切换\
    changeOptions(val) {
      let allOptions = [];
      if (val == "1") {
        $.each(this.provinceOptions, (index, item) => {
          allOptions.push({
            value: item.value,
            label: item.label
          });
        });
        this.areaOptions = allOptions;
      }
      if (val == "2") {
        //深拷贝区域
        let opts = JSON.parse(JSON.stringify(this.provinceOptions));
        $.each(opts, (index, item) => {
          $.each(item.children, (secondIndex, secondItem) => {
            delete secondItem.children;
          })
        });
        this.areaOptions = opts;
      } 
      if(val == "3") {
        this.areaOptions = this.provinceOptions;
      }
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
      // }
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
    getPower(perm) {
      let power = [];
      $.each(this.powerList, (index, item) => {
        $.each(perm.split(","), (keyIndex, keyItem) => {
          if (item.value == keyItem) {
            power.push(item.label);
          }
        });
      });
      return power.join(",");
    },
    //新增账号打开dialog，并设置当前类型
    addNew() {
      this.dialogFormVisible = true;
    },
    changeRole() {
      var sub = this.roleList.find(item => {
        return item.role == this.ruleForm.role;
      });
      let keys = sub.perm.split(",");
      let powerChoose = [];
      $.each(this.powerList, (index, item) => {
        $.each(keys, (keyIndex, keyItem) => {
          if (item.value == keyItem) {
            powerChoose.push(item.label);
          }
        });
      });
      this.ruleForm.powerChoose = [];
      for (let i = 0; i < powerChoose.length; i++) {
        this.$set(this.ruleForm.powerChoose, i, powerChoose[i]);
      }
    },
    getRoleList() {
      let roleList = localStorage.getItem("roleList");
      if (roleList) {
        this.roleList = JSON.parse(roleList);
      } else {
        this.axios
        .get("/role/show?type=1")
        .then(res => {
          if (res.code == 1) {
            this.roleList = res.data;
            localStorage.setItem('roleList', JSON.parse(res.data));
          }
        })
        .catch(error => {});
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //新增账号表单提交,
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.areas = [];
          for (var i = 0; i < this.ruleForm.areaChoose.length; i++) {
            this.areas.push(
              this.ruleForm.areaChoose[i][
                this.ruleForm.areaChoose[i].length - 1
              ]
            );
          }
          let formData = new FormData();
            let url = "/agtChild/add";
            let power = [];
            $.each(this.powerList, (index, item) => {
              $.each(this.ruleForm.powerChoose, (keyIndex, keyItem) => {
                if (item.label == keyItem) {
                  power.push(item.value);
                }
              });
            });
            let userFormData = {
              areasNum: this.areas,
              name: this.ruleForm.name,
              power: power,
              agtRoleName: this.ruleForm.role,
              telephone: this.ruleForm.phoneNumber,
              userCardid: this.ruleForm.idCard
            };
            this.axios
              .post("/agtChild/add", userFormData, {
                headers: { "Content-Type": "application/json" }
              })
              .then(res => {
                this.success(res);
              })
              .catch(() => {});
            // this.add(url, userFormData);
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
      this.areas = [];
      this.startDate = "";
      this.endDate = "";
    },
    //页面初始化获取数据列表
    getTableData() {
      let data = {
        pageNum: this.currentpage,
        pageSize: this.pagesize,
      };
      let url = "/agt/list";
      this.axios
        .post(url, data)
        .then(res => {
          if (res.code == 1) {
            this.tableData = res.rows;
            this.total = res.total;
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
@import "../../assets/styles/mixin";
@import "../../assets/styles/sorts";
</style>
