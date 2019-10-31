<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span>商品列表</span>
            <!-- <el-cascader class="casa" v-model="value" :options="options" @change="handleChange"></el-cascader> -->
          </div>
          <div class="table-wrapper">
            <el-table v-loading="loading" element-loading-text="加载数据中" :data="tableData" border>
              <el-table-column label="编号" prop="id" align="center"></el-table-column>
              <el-table-column label="商品名称" prop="goodsName" align="center"></el-table-column>
              <el-table-column label="商品规格" prop="specs" align="center"></el-table-column>
              <!-- <el-table-column label="商品数量" prop="count" align="center"></el-table-column> -->
              <el-table-column label="商品数量" align="center">1</el-table-column>
              <el-table-column label="商户售价(元)" prop="merchantPrice" align="center"></el-table-column>
              <el-table-column label="用户" prop="name" align="center"></el-table-column>
              <el-table-column label="手机" prop="phone" align="center"></el-table-column>
              <el-table-column label="物流公司" prop="logisComp" align="center">
                <template slot-scope="scope">{{scope.row.logisComp || '未填写' }}</template>
              </el-table-column>
              <el-table-column label="物流号" prop="orderId" align="center">
                <template slot-scope="scope">{{scope.row.orderId || '未填写' }}</template>
              </el-table-column>
              <el-table-column label="发货农场" prop="farm" align="center"></el-table-column>
              <el-table-column label="地区" prop="city" align="center"></el-table-column>
              <el-table-column label="详细地址" prop="address" align="center"></el-table-column>
              <el-table-column label="时间" prop="createTimeUid" align="center">
                <template slot-scope="scope">{{scope.row.createTimeUid | getTime}}</template>
              </el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="info"
                    disabled
                  >{{scope.row.status == '0' ? '等待配送' : scope.row.status == '1' ? '订单完成' : scope.row.status == '2' ? '配送中' : '异常'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    v-if="scope.row.status == '0'"
                    @click="handleDistribute(scope.row, '1')"
                  >配 送</el-button>
                  <!-- <el-button
                    size="mini"
                    type="primary"
                    v-if="scope.row.status == '2'"
                    @click="handleSuccess(scope.row, '2')"
                  >完成订单</el-button> -->
                  <el-button
                    size="mini"
                    type="primary"
                    v-if="scope.row.status == '2'"
                    @click="showLogisticView(scope.row)"
                  >查看物流</el-button>
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
            title="填写物流号"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            width="30%"
          >
            <div class="dia-content">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="物流公司" prop="logistics">
                  <el-select v-model="ruleForm.logistics" placeholder="请选择" @change="getMail">
                    <el-option
                      v-for="item in logisticses"
                      :key="item.key"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="物流号" prop="orderId">
                  <el-input v-model="ruleForm.orderId"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="distribute">配送</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="物流详情"
            :visible.sync="dialogLogisticVisible"
            :modal-append-to-body="false"
            width="60%"
          >
            <div class="dia-content">
              <div class="goods-info">
                <div class="info-item">
                  物流号：
                  <span class="info">{{currentGoods.orderId}}</span>
                </div>
                <div class="info-item">
                  发货农场：
                  <span class="info">{{currentGoods.farm}}</span>
                </div>
                <div class="info-item">
                  寄货物品：
                  <span class="info">{{currentGoods.goodsName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;数量：
                  <span class="info">{{currentGoods.count + '(' + currentGoods.specs + ')'}}</span>
                </div>
                <div class="info-item">
                  寄货物流公司：
                  <span class="info">{{currentGoods.logisComp}}</span>
                </div>
                <div class="info-item">
                  收件人：
                  <span class="info">{{currentGoods.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;收件人号码：
                  <span class="info">{{currentGoods.phone}}</span>
                </div>
                <div class="info-item">
                  收货地址：
                  <span class="info">{{currentGoods.city + ' ' + currentGoods.address}}</span>
                </div>
              </div>
              <div class="logistic">
                <div class="step-title">物流进度</div>
                <el-steps
                  direction="vertical"
                  :active="goodsStep.length"
                  space="70px"
                  finish-status="success"
                >
                  <el-step
                    v-for="(item, index) in goodsStep"
                    :key="index"
                    :description="item.context"
                  >
                    <div></div>
                  </el-step>
                </el-steps>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogLogisticVisible = false">关 闭</el-button>
            </span>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import mails from "src/data/fast-mail";
import rules from "src/assets/js/rules";
export default {
  data() {
    return {
      currentGoods: {},
      options: [],
      loading: true,
      tableData: [],
      value: [],
      dialogVisible: false,
      dialogLogisticVisible: false,
      logisticDetail: {},
      goodsStep: [],
      ruleForm: {
        orderId: "",
        logistics: ""
      },
      rules: rules,
      logisticses: mails,
      total: 0,
      pagesize: 10,
      currentpage: 1
    };
  },
  filters: {
    getTime: function(value) {
      var dateee = new Date(value).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    }
  },
  mounted() {
    // this.getSort();
    this.getTableList();
  },
  methods: {
    getMail(e) {
      console.log(e);
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
      let ops = JSON.parse(
        JSON.stringify(list)
          .replace(/list/g, "children")
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      ops.unshift({
        value: "1",
        label: "全部"
      });
      this.options = ops;
    },
    getTableList() {
      let typeThird =
        this.value[this.value.length - 1] == 1
          ? ""
          : this.value[this.value.length - 1];
      let data = {
        pageNum: this.currentpage,
        pageSize: this.pagesize
      };
      this.axios
        .post("/showLogisticList", data)
        .then(res => {
          if(res.code == '1') {
            console.log(res);
            this.tableData = res.rows;
            this.total = res.total;
            this.loading = false;
          } else {  
            this.tableData = [];
          }
        })
        .catch();
    },
    //商品分类
    handleChange() {
      this.getTableList();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getTableList();
    },
    handleCurrentChange(value) {
      this.currentpage = value;
      console.log(value);
      this.getTableList();
    },
    //查看物流
    showLogisticView(row) {
      let witch = this.logisticses.find(item => {
        return item.name == row.logisComp;
      });
      let data = {
        id: witch.id,
        orderId: row.orderId
      };
      this.axios.post("/getWuliuMessage", data).then(res => {
        if (res.code == "1") {
          if(res.msg) {
            this.logisticDetail = JSON.parse(res.msg);
            this.goodsStep = this.logisticDetail.data.reverse();
            this.currentGoods = row;
            this.dialogLogisticVisible = true;
          } else {
            this.$message.error("查询无结果，请隔段时间再查");
          }
        } else {
          this.$message.error("获取物流信息失败");
        }
      });
    },
    //点击配送跳出form弹框
    handleDistribute(row) {
      this.currentGoods = row;
      this.dialogVisible = true;
    },
    //订单完成
    handleSuccess(row) {
      this.$confirm(`请确认此订单已完成？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "/changeLogicStatus";
          let data = {
            id: row.id,
            status: "1"
          };
          this.handle(url, data, "2");
        })
        .catch(() => {});
    },
    //填写form表单后配送
    distribute() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let url = "/changeLogicStatus";
          let data = {
            logisComp: this.ruleForm.logistics,
            orderId: this.ruleForm.orderId.trim(),
            id: this.currentGoods.id,
            status: "2"
          };
          this.handle(url, data, "1");
        }
      });
    },
    handle(url, data, type) {
      this.axios
        .post(url, data)
        .then(res => {
          if (res.code == "1") {
            this.getTableList();
            type == "1" && this.resetForm("ruleForm");
          } else {
            this.$message({
              message: res.msg,
              type: "danger",
              duration: 2000
            });
          }
        })
        .catch();
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/mixin";
.goods-info {
  .info-item {
    margin-bottom: 10px;
    .info {
      color: #222;
    }
  }
}
.logistic {
  margin-top: 30px;
  margin-left: 10px;
  .step-title {
    @include sc(16px, $label);
    margin-bottom: 10px;
  }
}
</style>