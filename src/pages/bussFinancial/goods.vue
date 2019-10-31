<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <div>
              <span>商品金流列表</span>
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
                    <el-form-item label="商品名：">
                      <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="规格：">
                      <span>{{ props.row.specs }}</span>
                    </el-form-item>
                    <el-form-item label="金流(元)：">
                      <span>{{ props.row.seasinal }}</span>
                    </el-form-item>
                    <el-form-item label="应季期：">
                      <span>{{ props.row.financeStreamTotal }}</span>
                    </el-form-item>
                    <el-form-item label="商户售价：">
                      <span>{{ props.row.merchantPrice }}</span>
                    </el-form-item>
                    <el-form-item label="平台售价：">
                      <span>{{ props.row.platformPrice }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="商品名" prop="name" align="center"></el-table-column>
              <el-table-column label="规格" prop="specs" align="center"></el-table-column>
              <el-table-column label="金流(元)" prop="financeStreamTotal" align="center"></el-table-column>
              <el-table-column label="应季期" prop="seasinal" align="center"></el-table-column>
              <el-table-column label="商户售价(元)" prop="merchantPrice" align="center"></el-table-column>
              <el-table-column label="平台售价(元)" prop="platformPrice" align="center"></el-table-column>
              <el-table-column label="操作" align="center" v-if="!queryType">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.financeStreamTotal > 0" size="mini" type="primary" @click="getOrderList(scope.row)">查看订单金流</el-button>
                  <el-button v-else size="mini" type="info" disabled>暂无金流</el-button>
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
      tableData: [],
      loading: true,
      pagesize: 10,
      currentpage: 1,
      total: 0,
      queryType: '',
      formLabelWidth: "100px",
      labelPosition: "left"
    };
  },
  computed: {},
  watch: {},
  created() {
    let dt = this.$route.query;
    if(dt.queryType) {
      this.queryType = dt.queryType;
    }
    this.id = dt.id;
    this.name = dt.name;
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getOrderList(row) {
        this.$router.push({
        path: "/bussFinancial/order",
        query: { id: row.itemId, name: row.name }
      }); 
    },
    //页面初始化获取数据列表
    getTableData() {
      let data = {
        pageSize: this.pagesize,
        pageNum: this.currentpage,
        bussId: localStorage.getItem('myId')
      };
      let url = "/financeStream/capitalGoodsForBussFlowPage";
      this.axios
        .post(url, data)
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          } else {
            this.tableData = [];
          }
          this.loading = false;
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
