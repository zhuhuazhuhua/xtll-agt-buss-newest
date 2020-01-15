<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card v-if="perm6 || perm13">
          <div class="header" v-if="hasBindBank">
            <div class="bank-info-title">
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
              <el-button type="primary" plain @click="addBankCard" class="bind-btn">修改银行卡信息</el-button>
            </div>
          </div>
          <div class="header" v-if="!hasBindBank">
            <div>
              <span>提现银行卡信息(暂无)</span>
              <el-button type="primary" plain @click="addBankCard" class="bind-btn">绑定银行卡</el-button>
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
                <span class="txt">{{cashSuccessTotal | getAmount}}</span>
              </div>
              <div class="info-item">
                <span class="title">提现中总金额(元)：</span>
                <span class="txt">{{cashIngTotal | getAmount}}</span>
              </div>
              <div class="info-item">
                <span class="title">余额(元)：</span>
                <span class="txt">{{cash | getAmount}}</span>
                <span v-if="loginType == '3'">(包含5%平台押金{{bond | getAmount}})</span>
              </div>
            </div>
          </div>
          <div class="header record">
            <span>提现记录</span>
            <el-radio-group class="radio-group" v-model="typeTotal">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="3">已成功</el-radio>
              <el-radio :label="2">提现中</el-radio>
              <el-radio :label="4">提现失败</el-radio>
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
                    <el-form-item label="申请时间">
                      <span>{{props.row.createTime}}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="编号" prop="id" align="center"></el-table-column>
              <el-table-column label="金额" prop="cash" align="center"></el-table-column>
              <el-table-column label="申请时间" prop="createTime" align="center"></el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="info"
                    disabled
                  >{{scope.row.type == '3' ? '已成功' : scope.row.type == '2' ? '提现中' : '提现失败'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="logDetail(scope.row)">查看日志</el-button>
                </template>
              </el-table-column>
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
          <el-dialog
            :title="!hasBindBank ? '绑定银行卡' : '修改银行卡信息'"
            :visible.sync="dialogBankVisible"
            :modal-append-to-body="false"
          >
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
                oninput="value = value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')"
              ></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitWithdraw">提 交</el-button>
              <el-button type="info" @click="dialogWithdrawVisible = false">取 消</el-button>
            </div>
          </el-dialog>
          <el-dialog
            :title="`编号${currentLog.id}的日志`"
            :visible.sync="dialogLogDetailVisible"
            :modal-append-to-body="false"
          >
            <el-table element-loading-text="加载数据中" :data="detailTableData" border>
              <el-table-column label="金额" prop="cash" align="center"></el-table-column>
              <el-table-column label="操作时间" prop="createTime" align="center"></el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="info"
                    disabled
                  >{{scope.row.type == '3' ? '提现失败' : scope.row.type == '2' ? '提现中' : '提现成功'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button type="info" @click="dialogLogDetailVisible = false">取 消</el-button>
            </div>
          </el-dialog>
        </el-card>
        <el-card v-if="!perm6 && !perm13">
          <div class="header no-power">暂无权限</div>
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
      perm6: false,
      perm13: false,
      loginType: localStorage.getItem("type"),
      loading: true,
      dialogBankVisible: false,
      dialogWithdrawVisible: false,
      dialogLogDetailVisible: false,
      labelPosition: "top",
      formLabelWidth: "100px",
      withdrawMoney: "",
      tableData: [],
      detailTableData: [],
      currentLog: {},
      total: 0,
      hasBindBank: false,
      rules: rules,
      pagesize: 10,
      currentpage: 1,
      bond: 0,//押金
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
      time: "",
      id: "" //银行卡id
    };
  },
  created() {
    this.getPermTrueOrFalse();
  },
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
    getPermTrueOrFalse() {
      this.perm6 = this.getTrueOrFalse("6");
      this.perm13 = this.getTrueOrFalse("13");
    },
    //查看日志
    logDetail(row) {
      this.currentLog = row;
      this.axios
        .post("/showCashOutDetails", { id: row.id })
        .then(res => {
          if (res.code == "1") {
            this.detailTableData = res.rows;
          } else {
            this.$message({
              type: "error",
              message: "查询日志失败",
              duration: 3000
            });
            this.detailTableData = [];
            setTimeout(() => {
              this.dialogLogDetailVisible = false;
            }, 3000);
          }
          console.log(res);
        })
        .catch();
      this.dialogLogDetailVisible = true;
    },
    //绑定银行卡dialog
    addBankCard() {
      if (this.hasBindBank) {
        this.ruleForm = {
          bankName: this.bankName,
          cardNum: this.cardNum,
          cardName: this.cardName
        };
      }
      this.dialogBankVisible = true;
    },
    //绑定银行卡或修改银行卡提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = this.hasBindBank ? "/updateCard" : "/bindCard";
          let data = this.hasBindBank
            ? {
                id: this.id,
                bankName: this.ruleForm.bankName,
                card: this.ruleForm.cardNum,
                name: this.ruleForm.cardName
              }
            : {
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
            this.bond = res.data.bond ? res.data.bond : 0;
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
              this.id = res.data.id;
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
        if ((this.loginType == '3' && this.withdrawMoney <= (this.cash - this.bond)) || (this.loginType != '3' && this.withdrawMoney <= this.cash)) {
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
      let url = "/showCashOut";
      let beginTime = this.time ? this.time[0] : "";
      let endTime = this.time ? this.time[1] : "";
      let data = {
        typeTotal: this.typeTotal == "0" ? "3,2,4" : this.typeTotal,
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
    .bank-info-title {
      margin-right: 20px;
    }
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
  .no-power {
    color: red;
  }
}
</style>
