<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div class="header" v-if="hasBindBank">
            <div v-if="hasBindBank">
              <span>提现银行卡信息</span>
            </div>
            <div class="info">
              <div class="info-item">
                <span class="title">开户行：</span>
                <span class="txt">{{bankName}}</span>
              </div>
              <div class="info-item">
                <span class="title">银行卡号：</span>
                <span class="txt">{{cardNum}}</span>
              </div>
              <div class="info-item">
                <span class="title">持卡人姓名：</span>
                <span class="txt">{{cardName}}</span>
              </div>
            </div>
          </div>
          <div class="header" v-if="!hasBindBank">
            <div>
              <span>提现银行卡信息(暂无)</span>
              <el-button type="text" @click="addBankCard" class="bind-btn">绑定银行卡</el-button>
            </div>
          </div>
          <div class="header">
            <div>
              <span>账号金额</span>
            </div>
            <div class="info">
              <div class="info-item">
                <el-button
                  v-if="bankName"
                  type="primary"
                  @click="dialogWithdrawVisible = true"
                  class="bind-btn"
                >提现</el-button>
              </div>
              <div class="info-item">
                <span class="title">已提现金额(元)：</span>
                <span class="txt">{{cashSuccessTotal}}</span>
              </div>
              <div class="info-item">
                <span class="title">提现中总金额(元)：</span>
                <span class="txt">{{cashIngTotal}}</span>
              </div>
              <div class="info-item">
                <span class="title">余额(元)：</span>
                <span class="txt">{{cash}}</span>
              </div>
            </div>
          </div>
          <div class="header record">
            <span>提现记录</span>
            <el-radio-group class="radio-group" v-model="typeTotal">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">审核通过</el-radio>
              <el-radio :label="2">提现中</el-radio>
              <el-radio :label="3">提现失败</el-radio>
            </el-radio-group>
          </div>
          <div class="header left">
            <span>请选择日期范围(非必选)</span>
            <el-date-picker
              class="date"
              v-model="time"
              type="daterange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            ></el-date-picker>
          </div>
          <div class="table-wrapper">
            <el-table v-loading="loading" element-loading-text="加载数据中" :data="tableData" border>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" class="table-expand">
                    <el-form-item label="金额">
                      <span>{{props.row.cash}}</span>
                    </el-form-item>
                    <el-form-item label="操作时间">
                      <span>{{props.row.createTime}}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="金额" prop="cash" align="center"></el-table-column>
              <el-table-column label="操作时间" prop="createTime" align="center"></el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="info"
                    disabled
                  >{{scope.row.type == '1' ? '已成功' : scope.row.type == '2' ? '提现中' : '提现失败'}}</el-button>
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
          <el-dialog title="绑定银行卡" :visible.sync="dialogBankVisible" :modal-append-to-body="false">
            <el-form
              :model="ruleForm"
              status-icon
              ref="ruleForm"
              :rules="rules"
              :inline="true"
              :label-position="labelPosition"
            >
              <el-form-item label="开户行" prop="bankName" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.bankName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="银行卡号" prop="cardNum" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.cardNum" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="cardName" :label-width="formLabelWidth">
                <el-input v-model="ruleForm.cardName" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
              <el-button type="primary" plain @click="resetForm('ruleForm')">重 置</el-button>
              <el-button type="info" @click="dialogBankVisible = false">取 消</el-button>
            </div>
          </el-dialog>
          <el-dialog title="提现" :visible.sync="dialogWithdrawVisible" :modal-append-to-body="false">
            <div class="money">提现金额(元)：</div>
            <div class="money-input">
              <el-input
                type="number"
                v-model="withdrawMoney"
                oninput="value = value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3')"
              ></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitWithdraw">提 交</el-button>
              <el-button type="info" @click="dialogWithdrawVisible = false">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import rules from "src/assets/js/rules";
export default {
  components: {},
  data() {
    return {
      loading: true,
      dialogBankVisible: false,
      dialogWithdrawVisible: false,
      labelPosition: "top",
      formLabelWidth: "100px",
      withdrawMoney: "",
      tableData: [],
      total: 0,
      hasBindBank: false,
      rules: rules,
      pagesize: 10,
      currentpage: 1,
      cash: 0, //余额
      cashIngTotal: 0, //提现中总金额
      cashSuccessTotal: 0, //已提现
      bankName: "",
      cardNum: "",
      cardName: "",
      ruleForm: {
        bankName: "",
        cardNum: "",
        cardName: ""
      },
      typeTotal: 0,
      time: ""
    };
  },
  created() {},
  mounted() {
    this.getBankInfo();
    this.getInfo();
    this.getTableData();
  },
  watch: {
    typeTotal() {
      this.getTableData();
    },
    time() {
      this.getTableData();
    }
  },
  computed: {},
  methods: {
    //绑定银行卡dialog
    addBankCard() {
      this.dialogBankVisible = true;
    },
    //绑定银行卡提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = "/bindCard";
          let data = {
            bankName: this.ruleForm.bankName,
            card: this.ruleForm.cardNum,
            name: this.ruleForm.cardName
          };
          this.axios
            .post(url, data)
            .then(res => {
              if (res.code == "1") {
                this.$message.success(res.msg);
                this.dialogBankVisible = false;
                this.getBankInfo();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取金额
    getInfo() {
      this.axios
        .get("/showAccount")
        .then(res => {
          if (res.code == "1") {
            this.cash = res.data.cash ? res.data.cash : 0;
            this.cashIngTotal = res.data.cashIngTotal
              ? res.data.cashIngTotal
              : 0;
            this.cashSuccessTotal = res.data.cashSuccessTotal
              ? res.data.cashSuccessTotal
              : 0;
          }
        })
        .catch();
    },
    //获取银行卡信息
    getBankInfo() {
      this.axios
        .get("/showCard")
        .then(res => {
          if (res.code == "1") {
            if (res.data) {
              this.bankName = res.data.bankName;
              this.cardNum = res.data.card;
              this.cardName = res.data.name;
              this.hasBindBank = true;
            }
          }
        })
        .catch();
    },
    //提现提交
    submitWithdraw() {
      if (this.withdrawMoney) {
        if (this.withdrawMoney < this.cash) {
          let url = "/cashOut";
          let data = {
            cash: this.withdrawMoney
          };
          this.axios
            .post(url, data)
            .then(res => {
              if (res.code == "1") {
                this.getInfo();
                this.$message.success(res.msg);
                this.withdrawMoney = "";
                this.dialogWithdrawVisible = false;
                this.getTableData();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch();
        } else {
          this.$message.error("余额不足");
        }
      } else {
        this.$message.error("请输入金额");
      }
    },
    //获取提现记录
    getTableData() {
      let url = "/showCashOutDetails";
      let beginTime = this.time ? this.time[0] : "";
      let endTime = this.time ? this.time[1] : "";
      let data = {
        typeTotal: this.typeTotal == "0" ? "1,2,3" : this.typeTotal,
        pageSize: this.pagesize,
        pageNum: this.currentpage,
        beginTime: beginTime,
        endTime: endTime
      };
      this.axios
        .post(url, data)
        .then(res => {
          if (res.code == "1") {
            this.total = res.total;
            this.tableData = res.rows;
          } else {
            this.tableData = [];
          }
          this.loading = false;
        })
        .catch();
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
.basic {
  .header {
    padding: 18px 20px;
    border-top: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    @include fx(space-between);
    .bind-btn {
      margin-left: 20px;
    }
    .info {
      @include fx(flex-start);
      .info-item {
        margin-right: 50px;
      }
    }
  }
  .left {
    @include fx(flex-end);
    .date {
      margin-left: 40px;
    }
  }
  .record {
    margin-top: 40px;
  }
  .money {
    margin-bottom: 10px;
  }
}
</style>
