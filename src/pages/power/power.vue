<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header">权限管理</div>
          <div v-if="perm14 || perm15" class="table-wrapper">
            <el-form label-position="right" ref="roleForm">
              <el-form-item label="管理员类型列表" :label-width="labelWidth">
                <el-select v-model="currentRoleName" @change="changeRole" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in roleList"
                    :key="index"
                    :label="item.role"
                    :value="item.role"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="添加管理员类型" :label-width="labelWidth">
                <el-input class="add-input" v-model="addRoleName" placeholder="请输入内容"></el-input>
                <span class="explain">（请输入要添加的管理员类型）</span>
              </el-form-item>
              <el-form-item label="权限" :label-width="labelWidth">
                <el-checkbox-group v-model="powerChoose" class="checkbox-group">
                  <el-checkbox
                    v-for="(item, index) in powerList"
                    :key="index"
                    :label="item.label"
                    :value="item"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="operate"
                  type="success"
                  @click="addRole"
                  :disabled="addRoleName && powerChoose && powerChoose.length > 0 ? false : true"
                >添加</el-button>
                <el-button
                  type="primary"
                  @click="modifyRole"
                  :disabled="currentRoleName ? false : true"
                >修改</el-button>
                <el-button
                  type="danger"
                  @click="deleteRole"
                  :disabled="currentRoleName ? false : true"
                >删除</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="!perm14 && !perm15" class="no-power table-wrapper">暂无权限</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  components: {},
  data() {
    return {
      perm15: false,
      perm14: false,
      canAdd: true,
      labelWidth: "120px",
      powerList: localStorage.getItem('type') == '2' ? [
        { value: "1", label: "子账号添加" },
        { value: "2", label: "子账号修改(暂未开放)" },
        { value: "3", label: "子账号删除(暂未开放)" },
        { value: "4", label: "商户初审" },
        { value: "5", label: "商户添加" },
        { value: "6", label: "财务管理" },
        { value: "14", label: "管理员类型设置" },
      ] : [
        { value: "7", label: "商品上架(暂未开放)" },
        { value: "8", label: "商品下架" },
        { value: "9", label: "商品添加" },
        { value: "10", label: "商品修改" },
        { value: "11", label: "订单管理" },
        { value: "12", label: "子账号添加" },
        { value: "13", label: "财务管理" },
        { value: "15", label: "管理员类型设置" }
      ],
      powerChoose: [], //选中的权限
      addRoleName: "", //添加管理员类型名称
      currentRoleName: "", //select当前管理员名称
      currentId: "", //select当前管理员id
      roleList: [], //当前选中管理员列表
      loginType: localStorage.getItem('type'),
      addType: localStorage.getItem('type') == '2' ? '1' : '2'
    };
  },
  created() {
    this.getPermTrueOrFalse();
    this.getRoleList();
  },
  methods: {
    getPermTrueOrFalse() {
      if(this.loginType == '2') {
        this.perm14 = this.getTrueOrFalse("14");
      } else {
        this.perm15 = this.getTrueOrFalse("15");
      }
    },
    getRoleList() {
      this.axios
        .get("/role/show?type=" + this.addType)
        .then(res => {
          if (res.code == 1) {
            this.roleList = res.data;
            localStorage.setItem('roleList', JSON.parse(res.data));
          }
        })
        .catch(error => {});
    },
    //获取不同管理员权限
    changeRole() {
      var sub = this.roleList.find(item => {
        return item.role == this.currentRoleName;
      });
      var keys = sub.perm.split(",");
      let powerChoose = [];
      $.each(this.powerList, (index, item) => {
        $.each(keys, (keyIndex, keyItem) => {
          if (item.value == keyItem) {
            powerChoose.push(item.label);
          }
        });
      });
      this.powerChoose = powerChoose;
    },
    operate(name, url, data, string) {
      this.$confirm(`${string} ${name} 管理员类型？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let power = this.getPower();
          this.axios
            .post(url, data)
            .then(res => {
              if (res.code == 1) {
                this.$message({
                  message: res.msg,
                  type: "success",
                  duration: 1500
                });
                this.getRoleList();
                this.reset();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    //添加管理员
    addRole() {
      let bool = this.roleList.find(item => {
        return item.role === this.addRoleName;
      });
      if (bool) {
        this.$message({
          message: `已存在 ${this.addRoleName} 管理员类型`,
          type: "warning",
          duration: 2000
        });
      } else {
        let data = {
          power: this.getPower(),
          role: this.addRoleName,
          type: this.addType
        };
        this.operate(this.addRoleName, "/role/add", data, "确定添加");
      }
    },
    //删除管理员
    deleteRole() {
      let data = {
        id: this.getCurrentRole().id,
        type: this.addType
      };
      this.operate(this.currentRoleName, "/role/del", data, "确定删除");
    },
    //修改管理员权限
    modifyRole() {
      let data = {
        id: this.getCurrentRole().id,
        power: this.getPower(),
        role: this.getCurrentRole().role,
        type: this.addType
      };
      this.operate(this.currentRoleName, "/role/update", data, "确定修改");
    },
    getPower() {
      let power = [];
      $.each(this.powerList, (index, item) => {
        $.each(this.powerChoose, (keyIndex, keyItem) => {
          if (item.label == keyItem) {
            power.push(item.value);
          }
        });
      });
      return power;
    },
    getCurrentRole() {
      let currentRole = this.roleList.filter((item, index) => {
        return item.role == this.currentRoleName;
      })[0];
      return currentRole;
    },
    reset() {
      this.powerChoose = []; //选中的权限
      this.addRoleName = ""; //添加管理员类型名称
      this.currentRoleName = ""; //select当前管理员名称
    }
  }
};
</script>

<style scoped lang="scss">
.explain {
  color: #909399;
}
.add-input {
  width: 240px;
}
.operate {
  margin-left: 120px;
}
.no-power {
  color: red;
}
</style>