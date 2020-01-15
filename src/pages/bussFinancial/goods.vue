<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div v-if="queryType == '1'" slot="header" class="header">
            <el-page-header @back="goBack" content="商品金流列表"></el-page-header>
            <span class="name">商户名称：{{name}}</span>
          </div>
          <div v-else slot="header" class="header">
            <div>
              <span>商品销售记录</span>
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
                    <el-form-item label="商品名称：">
                      <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="商品价格(元)：">
                      <span>{{ props.row.merchantPrice }}</span>
                    </el-form-item>
                    <el-form-item label="规格：">
                      <span>{{ props.row.specs }}</span>
                    </el-form-item>
                    <el-form-item label="应季期：">
                      <span>{{ props.row.seasinal }}</span>
                    </el-form-item>
                    <el-form-item label="累计出售：">
                      <span>{{ props.row.orderCount }}</span>
                    </el-form-item>
                    <el-form-item label="销售总额(元)：">
                      <span>{{ props.row.financeStreamTotal | getAmount }}</span>
                    </el-form-item>
                    <!-- <el-form-item label="平台售价：">
                      <span>{{ props.row.platformPrice }}</span>
                    </el-form-item> -->
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="name" align="center"></el-table-column>
              <el-table-column label="商品价格(元)" prop="merchantPrice" align="center"></el-table-column>
              <el-table-column label="规格" prop="specs" align="center"></el-table-column>
              <el-table-column label="应季期" align="center">
                <template slot-scope="props">{{props.row.seasinal.split('#').join('~')}}</template>
              </el-table-column>
              <el-table-column label="累计出售" prop="orderCount" align="center"></el-table-column>
              <!-- <el-table-column label="平台售价(元)" prop="platformPrice" align="center"></el-table-column> -->
              <el-table-column label="销售总额(元)" align="center">
                <template slot-scope="props">{{props.row.financeStreamTotal | getAmount}}</template>
              </el-table-column>
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
  data() {
    return {
      tableData: [],
      loading: true,
      pagesize: 10,
      currentpage: 1,
      total: 0,
      queryType: '',
      formLabelWidth: "100px",
      labelPosition: "left",
      id: ''
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
    goBack() {
      this.$router.go(-1);
    },
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
        bussId: this.id || localStorage.getItem('myId')
      };
      let url = "/financeStream/capitalGoodsForBussFlowPage";
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
      this.getTableData();
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/mixin";
.header {
      min-width: 900px;
      @include fx(flex-start);
      .name {
        margin-left: 40px;
      }
    }
</style>
