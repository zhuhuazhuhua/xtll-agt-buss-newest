<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span>商品类型</span>
            <el-cascader class="casa" v-model="value" :options="options" @change="handleChange"></el-cascader>
            <el-button
              v-show="value.length > 1"
              class="add"
              type="primary"
              size="mini"
              @click="add = true"
            >添加商品</el-button>
          </div>
          <div class="table-wrapper">
            <div class="add-form" v-show="add && value.length > 1">
              <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px">
                <el-form-item label="商品名称" prop="name">
                  <el-input class="add-name" v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="种植时间" prop="plantTime">
                  <el-input-number
                    size="medium"
                    :precision="0"
                    v-model="ruleForm.plantTime"
                    :min="0"
                    label="游戏时间"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="商品利润率基数" prop="rate">
                  <input id="add-rate" type="number" v-model="ruleForm.rate" />
                </el-form-item>
                <div class="add-see">
                  <span class="see-title">商品利润率</span>
                  <span class="see-content">{{addSeeRate}} %</span>
                </div>
              </el-form>
              <el-row class="add-btn">
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">添 加</el-button>
                <el-button @click="add = false" size="small">取 消</el-button>
              </el-row>
            </div>
            <el-table v-loading="loading" element-loading-text="加载数据中" :data="tableData" border>
              <el-table-column label="商品类型" prop="name" align="center"></el-table-column>
              <el-table-column label="种植时间" prop="plantTime" align="center"></el-table-column>
              <el-table-column label="利润率" prop="rate" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" plain @click="changeItem(scope.row)">
                    <i class="el-icon-edit operate-btn"></i>修改
                  </el-button>
                  <el-button size="mini" type="danger" plain @click="deleteItem(scope.row)">
                    <i class="el-icon-delete operate-btn"></i>删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog
            title="修改信息"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            width="30%"
          >
            <div class="dia-content">
              <div class="dia-item">
                <span class="dia-title">种植时间(天):</span>
                <el-input-number
                  size="medium"
                  :precision="0"
                  v-model="changePlantTime"
                  :min="0"
                  label="游戏时间"
                  @change="checkChange"
                ></el-input-number>
                <span class="day">天</span>
              </div>
              <div class="dia-item">
                <span class="dia-title">商品利润率基数</span>
                <el-input id="rate" type="number" v-model="changeRate" @change="checkChange" />
              </div>
              <div class="dia-item">
                <span class="dia-title">商品利润率</span>
                <span>{{seeRate}} %</span>
              </div>
              <div class="dia-item">
                <el-button
                  type="primary"
                  size="small"
                  @click="changeAllRate"
                  :disabled="changeRate != initRate"
                >一键重置</el-button>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button
                :disabled="!changePlantTime || !changeRate || cantSubmit"
                type="primary"
                @click="changeSubmit"
              >修 改</el-button>
            </span>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      add: false,
      loading: false,
      value: ["1"],
      options: [
        { value: "1", label: "全部" },
        {
          value: "1",
          label: "种植类",
          children: [
            {
              value: "1",
              label: "优质谷物"
            },
            {
              value: "2",
              label: "新鲜水果"
            },
            {
              value: "3",
              label: "茗茶精选"
            }
          ]
        },
        {
          value: "2",
          label: "养殖类",
          children: [
            {
              value: "4",
              label: "优质家禽"
            },
            {
              value: "5",
              label: "优质家畜"
            },
            {
              value: "6",
              label: "其他"
            }
          ]
        }
      ],
      tableData: [],
      dialogVisible: false,
      changePlantTime: "",
      initPlantTime: "",
      changeRate: "",
      initRate: "",
      seeRate: "",
      cantSubmit: true,
      currentGoods: {},
      ruleForm: {
        name: "",
        plantTime: "",
        rate: ""
      },
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        plantTime: [
          { required: true, message: "请输入种植时间", trigger: "blur" }
        ],
        rate: [
          { required: true, message: "请输入商品利率基数", trigger: "blur" }
        ]
      },
      addSeeRate: ""
    };
  },
  watch: {
    changeRate(val) {
      this.seeRate = (val / 1000).toFixed(3);
    },
    "ruleForm.rate"(value) {
      this.addSeeRate = (value / 1000).toFixed(3);
    }
  },
  mounted() {
    this.getRoleList(["1"]);
  },
  methods: {
    getRoleList(arr) {
      let url = "/goods/list";
      let allurl = "";
      if (arr.length == 1) {
        allurl = url;
      } else {
        allurl = url + "?fId=" + arr[1];
      }
      this.axios
        .get(allurl)
        .then(res => {
          if (res.code == 1) {
            this.tableData = res.list;
          }
        })
        .catch(error => {});
    },
    //一键重置一类中所有商品的利润率
    changeAllRate() {
      this.$confirm(
        `此操作将重置所有 ${this.currentGoods.name} 类型的商品的利润率为 ${this.currentGoods.rate}，是否继续？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let data = {
            id: this.currentGoods.id
          };
          this.axios
            .post("/goods/reset", data)
            .then(res => {
              if (res.code == "1") {
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
            })
            .catch();
        })
        .catch(() => {});
    },
    //商品分类
    handleChange(val) {
      this.value = val;
      console.log(this.value);
      this.getRoleList(val);
    },
    //跳出商品修改弹框
    changeItem(goods) {
      this.changePlantTime = goods.plantTime || "1";
      this.initPlantTime = this.changePlantTime;
      this.changeRate = goods.rate ? parseFloat(goods.rate) * 1000 : 1;
      this.initRate = this.changeRate;
      this.seeRate = (this.changeRate / 1000).toFixed(3);
      this.currentGoods = goods;
      this.dialogVisible = true;
    },
    //检测信息是否修改
    checkChange() {
      if (
        this.changePlantTime != this.initPlantTime ||
        this.changeRate != this.initRate
      ) {
        this.cantSubmit = false;
      }
    },
    //修改商品
    changeSubmit() {
      console.log(this.currentGoods, this.changePlantTime, this.changeRate);
      let data = {
        fId: this.value[1],
        id: this.currentGoods.id,
        name: this.currentGoods.name,
        plantTime: this.changePlantTime,
        rate: this.changeRate,
        sId: this.value[0]
      };
      this.axios
        .post("/goods/update", data)
        .then(res => {
          if (res.code == "1") {
            this.$message({
              message: res.msg,
              type: "success",
              duration: 2000
            });
            this.getRoleList(this.value);
            this.reset();
          } else {
            this.$message({
              message: res.msg,
              type: "error",
              duration: 2000
            });
          }
        })
        .catch();
    },
    //商品删除
    deleteItem(goods) {
      this.$confirm(`是否删除 ${goods.name} 商品类型？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            id: goods.id
          };
          this.axios.post("/goods/del", data).then(res => {
            if (res.code == "1") {
              this.$message({
                message: res.msg,
                type: "success",
                duration: 2000
              });
              this.getRoleList(this.value);
            } else {
              this.$message({
                message: res.msg,
                type: "error",
                duration: 2000
              });
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    //添加商品
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            name: this.ruleForm.name,
            plantTime: this.ruleForm.plantTime,
            rate: this.ruleForm.rate,
            fId: this.value[1],
            sId: this.value[0]
          };
          this.axios
            .post("/goods/add", data)
            .then(res => {
              if (res.code == "1") {
                this.$message({
                  message: res.msg,
                  type: "success",
                  duration: 2000
                });
                this.resetForm("ruleForm");
                this.getRoleList(this.value);
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                  duration: 2000
                });
              }
            })
            .catch();
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    reset() {
      this.dialogVisible = false;
      (this.changePlantTime = ""),
        (this.initPlantTime = ""),
        (this.changeRate = ""),
        (this.initRate = ""),
        (this.seeRate = ""),
        (this.cantSubmit = true),
        (this.currentGoods = {});
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/mixin";
.operate-btn {
  margin-right: 3px;
}
.add-form {
  margin-bottom: 30px;
  .add-btn {
    margin-top: 30px;
    margin-left: 260px;
  }
  .add-name {
    width: 200px;
  }
  #add-rate {
    width: 200px;
  }
  .add-see {
    @include fx(flex-start);
    .see-title {
      @include sc(14px, #606266);
      width: 188px;
      text-align: right;
      margin-right: 30px;
    }
    .see-content {
      @include sc(14px, #606266);
    }
  }
}
.add {
  margin-left: 30px;
}
.add-input {
  width: 240px;
}
.operate {
  margin-left: 120px;
}
.dia-item {
  @include fx(flex-start);
  margin-bottom: 20px;
  .dia-title {
    margin-right: 20px;
    min-width: 110px;
  }
  .day {
    margin-left: 10px;
  }
  #rate {
    width: 200px;
  }
}
</style>