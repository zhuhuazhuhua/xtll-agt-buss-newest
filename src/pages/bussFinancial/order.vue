<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <el-page-header @back="goBack" content="商品订单"></el-page-header>
            <span class="name">商品名称：{{name}}</span>
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
                    <el-form-item label="编号：">
                      <span>{{ props.row.plantUid }}</span>
                    </el-form-item>
                    <el-form-item label="时间：">
                      <span>{{ props.row.createTime }}</span>
                    </el-form-item>
                    <el-form-item label="付款类型：">
                      <span>{{ props.row.status }}</span>
                    </el-form-item>
                    <el-form-item label="金额(元)：">
                      <span>{{ props.row.money | getAmount }}</span>
                    </el-form-item>
                    <el-form-item label="付款比例：">
                      <span>{{ props.row.percentage }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="编号" prop="plantUid" align="center"></el-table-column>
              <el-table-column label="时间" prop="createTime" align="center"></el-table-column>
              <el-table-column label="付款类型" prop="status" align="center"></el-table-column>
              <el-table-column label="金额(元)" align="center">
                <template slot-scope="props">{{props.row.money | getAmount}}</template>
              </el-table-column>
              <el-table-column label="比例" prop="percentage" align="center"></el-table-column>
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
      loading: true,
      tableData: [],
      pagesize: 10,
      currentpage: 1,
      total: 0,
      name: ''
    };
  },
  created() {
    let dt = this.$route.query;
    this.id = dt.id;
    this.name = dt.name;
  },
  mounted() {
    this.getTableData();
  },
  watch: {
      
  },
  computed: {},
  methods: {
    getTableData() {
        let url = '/financeStream/capitalOrderPage';
        let data = {
            itemId: this.id,
            pageSize: this.pagesize,
            pageNum: this.currentpage
        };
        this.axios.post(url, data)
        .then(res => {
          if(res.code == '1') {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          } else {
            this.tableData = [];
          }
          this.loading = false;
        })
        .catch();
    },
    goBack() {
      this.$router.go(-1);
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
      min-width: 900px;
      @include fx(flex-start);
      .name {
        margin-left: 40px;
      }
    }
  }
</style>
