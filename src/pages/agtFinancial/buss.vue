<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <div>
              <span>商户金流列表</span>
            </div>
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
                    <el-form-item label="账号：">
                      <span>{{props.row.loginName}}</span>
                    </el-form-item>
                    <el-form-item label="农场名：">
                      <span>{{props.row.name}}</span>
                    </el-form-item>
                    <el-form-item label="金流(元)：">
                      <span>{{props.row.financeStreamTotal | getAmount}}</span>
                    </el-form-item>
                    <el-form-item label="手机号：">
                      <span>{{ props.row.telephone }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="账号" prop="loginName" align="center"></el-table-column>
              <el-table-column label="农场名" prop="name" align="center"></el-table-column>
              <el-table-column label="金流(元)" align="center">
                <template slot-scope="props">{{props.row.financeStreamTotal | getAmount}}</template>
              </el-table-column>
              <el-table-column label="手机号" prop="telephone" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.financeStreamTotal > 0" size="mini" type="primary" @click="getGoodsList(scope.row)">查看商品金流</el-button>
                  <el-button v-else size="mini" type="info" disabled>暂无金流</el-button>
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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  components: {},
  mounted() {
    this.getTableData();
  },
  data() {
    return {
      tableData: [],
      loading: true,
      pagesize: 10,
      currentpage: 1,
      total: 0,
      formLabelWidth: "100px",
      labelPosition: "left"
    };
  },
  computed: {},
  watch: {},
  methods: {
    getGoodsList(row) {
      this.$router.push({
        path: "/bussFinancial/goods",
        query: { id: row.id, name: row.name, companyName: row.companyName, queryType: 1 }
      });
    },
    //页面初始化获取数据列表
    getTableData() {
      let data = {
        agtId: localStorage.getItem('myId'),
        pageSize: this.pagesize,
        pageNum: this.currentpage
      };
      let url = "/financeStream/capitalBussForAgt";
      this.axios
        .post(url, data)
        .then(res => {
          if (res.code == 1) {
            console.log(res);
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
@import "../../assets/styles/mixin";
</style>
