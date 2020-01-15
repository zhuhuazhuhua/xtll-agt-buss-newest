<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <div>
              <span>管理员列表</span>
              <el-button type="text" v-if="perm12" @click="addNew" class="add-btn">新增管理员</el-button>
            </div>
            <el-dialog v-if="perm12" title="新增管理员" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
              <el-form
                :model="ruleForm"
                status-icon
                ref="ruleForm"
                :rules="rules"
                :inline="true"
                :label-position="labelPosition"
              >
                <el-form-item label="管理员姓名" prop="name" :label-width="formLabelWidth">
                  <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="idCard" :label-width="formLabelWidth">
                  <el-input v-model="ruleForm.idCard" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phoneNumber" :label-width="formLabelWidth">
                  <el-input v-model="ruleForm.phoneNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理员角色" prop="role" :label-width="formLabelWidth">
                  <el-select v-model="ruleForm.role" placeholder="请选择" @change="changeRole">
                    <el-option
                      v-for="(item, index) in roleList"
                      :key="index"
                      :label="item.role"
                      :value="item.role"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="权限" prop="powerChoose" :label-width="formLabelWidth">
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
            <el-dialog v-if="perm12" title="修改账号" :visible.sync="dialogEditVisible" :modal-append-to-body="false">
              <el-form status-icon :inline="true" :label-position="labelPosition">
                <!-- <div></div>
                <el-button type="primary" @click="update('1')">重置密码</el-button>-->
                <div></div>
                <el-form-item label="管理员姓名" :label-width="formLabelWidth">
                  <el-input v-model="editName" autocomplete="off"></el-input>
                </el-form-item>
                <el-button type="primary" @click="update('4')" :disabled="!editName">修改</el-button>
                <div></div>
                <el-form-item label="联系方式" :label-width="formLabelWidth">
                  <el-input v-model="editTelephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-button type="primary" @click="update('2')" :disabled="!editTelephone">修改</el-button>
                <div></div>
                <el-form-item label="管理员角色" :label-width="formLabelWidth">
                  <el-select v-model="editRoleName" placeholder="请选择">
                    <el-option
                      v-for="(item, index) in roleList"
                      :key="index"
                      :label="item.role"
                      :value="item.role"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" @click="update('6')" :disabled="!editRoleName">修改</el-button>
                </el-form-item>
                <el-form-item label="权限" :label-width="formLabelWidth">
                  <el-checkbox-group v-model="editPower" class="checkbox-group">
                    <el-checkbox
                      v-for="(item, index) in powerList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-checkbox>
                  </el-checkbox-group>
                  <el-button type="primary" @click="update('5')" :disabled="!editPower">修改</el-button>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="dialogEditVisible = false">取 消</el-button>
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
                      <span>{{props.row.roleName}}</span>
                    </el-form-item>
                    <el-form-item label="管理员名">
                      <span>{{props.row.name}}</span>
                    </el-form-item>
                    <el-form-item label="手机号">
                      <span>{{ props.row.telephone }}</span>
                    </el-form-item>
                    <el-form-item label="权限">
                      <span>{{ getPower(props.row.perm) }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="账号" prop="loginName" align="center"></el-table-column>
              <el-table-column label="角色" prop="roleName" align="center"></el-table-column>
              <el-table-column label="管理员名" prop="name" align="center"></el-table-column>
              <el-table-column label="手机号" prop="telephone" align="center"></el-table-column>
              <!-- <el-table-column label="状态" prop="status" align="center"></el-table-column> -->
              <!-- <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handleEdit(scope.$index, scope.row)"
                  >
                    <i class="el-icon-edit operate-btn"></i>编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    plain
                    @click="handleDelete(scope.$index, scope.row)"
                  >
                    <i class="el-icon-delete operate-btn"></i>删除
                  </el-button>
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import exam from "src/components/exam";
import citys from "src/data/citii";
import rules from 'src/assets/js/rules';
// import areaJson from "src/data/city";
export default {
  components: { exam },
  data() {
    return {
      perm12: false,
      dialogEditVisible: false,
      checkAll: false,
      isIndeterminate: true,
      tableData: [],
      loading: true,
      pagesize: 10,
      currentpage: 1,
      total: 0,
      dialogFormVisible: false,
      ruleForm: {
        name: "",
        phoneNumber: "",
        idCard: "",
        role: "",
        powerChoose: []
      },
      userFormData: {},
      rules,
      formLabelWidth: "100px",
      roleList: [],
      powerList: [
        { value: "7", label: "商品上架(暂未开放)" },
        { value: "8", label: "商品下架" },
        { value: "9", label: "商品添加" },
        { value: "10", label: "商品修改" },
        { value: "11", label: "订单管理" },
        { value: "12", label: "子账号添加" },
        { value: "13", label: "财务管理" }
      ],
      labelPosition: "left",
      id: "",
      editPower: [],
      editName: "",
      editRoleName: "",
      editTelephone: ""
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getPermTrueOrFalse();
  },
  mounted() {
    this.getTableData();
    this.superPlat();
    this.getRoleList();
  },
  methods: {
    getPermTrueOrFalse() {
      this.perm12 = this.getTrueOrFalse("12");
    },
    //判断是否是超管
    superPlat() {
      let mark = localStorage.getItem("areaNums");
      this.mark = mark;
      if (!mark) {
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
          .get("/role/show?type=2")
          .then(res => {
            if (res.code == 1) {
              this.roleList = res.data;
              localStorage.setItem("roleList", JSON.parse(res.data));
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
          let formData = new FormData();
          let url = "/bussChild/add";
          let power = [];
          $.each(this.powerList, (index, item) => {
            $.each(this.ruleForm.powerChoose, (keyIndex, keyItem) => {
              if (item.label == keyItem) {
                power.push(item.value);
              }
            });
          });
          let userFormData = {
            name: this.ruleForm.name,
            power: power,
            roleName: this.ruleForm.role,
            telephone: this.ruleForm.phoneNumber,
            userCardid: this.ruleForm.idCard
          };
          this.axios
            .post(url, userFormData, {
              headers: { "Content-Type": "application/json" }
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
    },
    //页面初始化获取数据列表
    getTableData() {
      let data = {
        pageNum: this.currentpage,
        pageSize: this.pagesize
      };
      let url = "/buss/list";
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
    //账号编辑
    handleEdit(index, row) {
      this.dialogEditVisible = true;
      console.log(index, row);
      this.editName = row.name;
      this.editTelephone = row.telephone;
      this.id = row.id;
      this.editRoleName = row.roleName;
      let keys = row.perm.split(",");
      let powerChoose = [];
      $.each(this.powerList, (index, item) => {
        $.each(keys, (keyIndex, keyItem) => {
          if (item.value == keyItem) {
            powerChoose.push(item.label);
          }
        });
      });
      this.editPower = [];
      for (let i = 0; i < powerChoose.length; i++) {
        this.$set(this.editPower, i, powerChoose[i]);
      }
    },
    //修改信息
    update(number) {
      let data = {};
      let url = "/bussChild/update";
      if (number == "5") {
        this.power = [];
        $.each(this.powerList, (index, item) => {
          $.each(this.editPower, (keyIndex, keyItem) => {
            if (item.label == keyItem) {
              this.power.push(item.value);
            }
          });
        });
        data = {
          number: "5",
          id: this.id,
          power: this.power
        };
      } else if (number == "2") {
        if (this.editTelephone.match(/^1[3|4|5|7|8][0-9]\d{8}$/) == null) {
          this.$message({
            message: "请输入正确的手机号",
            type: "error",
            duration: 2000
          });
          return false;
        } else {
          data = {
            telephone: this.editTelephone,
            number: "2",
            id: this.id
          };
        }
      } else if (number == "4") {
        data = {
          name: this.editName,
          number: "2",
          id: this.id
        };
      } else {
        data = {
          roleName: this.editRoleName,
          id: this.id,
          number: "6"
        };
      }
      this.axios
        .post(url, data)
        .then(res => {
          this.delUserSuccess(res);
        })
        .catch(error => {});
    },
    //账号删除
    handleDelete(index, row) {
      let name = row.loginName;
      this.$confirm(`确定删除 ${name} 管理员？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/buss/delete";
          let data = {
            id: row.id
          };
          this.axios
            .post(url, data)
            .then(res => {
              this.delUserSuccess(res, row);
            })
            .catch(() => {});
        })
        .catch(() => {});
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
.basic {
  .header {
    @include fx(flex-start);
    .casa {
      margin-left: 50px;
    }
    .add-btn {
      margin-left: 10px;
    }
    .radio-group {
      @include fx(space-around);
      margin-left: 100px;
    }
    .check-group {
      margin-left: 100px;
      display: flex;
      .all-group {
        margin-left: 20px;
      }
    }
    .unPass {
      margin-left: 100px;
    }
  }
  .el-table {
    .warning-row {
      background-color: oldlace;
    }
    .table-expand {
      font-size: 0;
      margin-left: 200px;
    }
    .table-expand label {
      width: 70px;
      color: $label;
    }
    .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      display: flex;
    }
    .operate-btn {
      margin-right: 3px;
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
  .upload-title {
    text-align: center;
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
  // .inline {
  //   display: flex;
  //   justify-content: start;
  // }
}
</style>
