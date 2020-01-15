<template>
  <div class="basic">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="header">
            <div>我的资质</div>
          </div>
          <div class="table-wrapper">
            <div class="refer">
              <div class="refer-item">推介人姓名：{{referName}}</div>
              <div class="refer-item">推介人电话：{{referTelephone}}</div>
            </div>
            <div class="info">
              <div class="info-item">
                <div class="item-title">公司名称:</div>
                <div class="item-content">{{info.companyName}}</div>
              </div>
              <div class="info-item">
                <div class="item-title">法人:</div>
                <div class="item-content">{{info.name}}</div>
              </div>
              <div class="info-item">
                <div class="item-title">代理期限:</div>
                <div class="item-content">{{info.time}}</div>
              </div>
              <div class="info-item">
                <div class="item-title">代理区域:</div>
                <div class="item-content">
                  <div class="area" v-for="(item, index) in proportions" :key="index">{{item.city}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="item-title">分成比例:</div>
                <div class="item-content">
                  <div class="proportion-first" v-for="(item, index) in proportions" :key="index">
                    <div class="first" v-if="item.leval == '1'">
                      <!-- <div class="first-city">{{item.city}}：{{item.leval == '1' ? '15%' : item.leval == '2' ? '3%' : '3%'}}</div>
                      <div class="second" v-for="(secondItem, secondIndex) in item.children" :key="secondIndex">
                        <div class="second-city">{{secondItem.city}}：{{secondItem.leval == '1' ? '15%' : secondItem.leval == '2' ? '3%' : '3%'}}</div>
                        <div class="third" v-for="(thirdItem, thirdIndex) in secondItem.children" :key="thirdIndex">
                          <div class="third-city">{{thirdItem.city}}：{{thirdItem.leval == '1' ? '15%' : thirdItem.leval == '2' ? '3%' : '3%'}}</div>
                        </div>
                      </div> -->
                      <div class="first-city">{{item.city}}：15%</div>
                      <div class="second" v-for="(secondItem, secondIndex) in item.children" :key="secondIndex">
                        <div class="second-city">{{secondItem.city}}：{{secondItem.leval == '2' ? '3%' : '7%'}}</div>
                        <!-- <div class="third" v-for="(thirdItem, thirdIndex) in secondItem.children" :key="thirdIndex">
                          <div class="third-city">{{thirdItem.city}}：{{thirdItem.leval == '1' ? '15%' : thirdItem.leval == '2' ? '3%' : '3%'}}</div>
                        </div> -->
                      </div>
                    </div>
                    <div class="first" v-if="item.leval == '2'">
                      <div class="first-city">{{item.city}}：12%</div>
                      <div class="second" v-for="(secondItem, secondIndex) in item.children" :key="secondIndex">{{secondItem.city}}：4%</div>
                    </div>
                    <div class="first" v-if="item.leval == '3'">
                      <div class="first-city">{{item.city}}：7%</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-img">
                  <div class="item-title">身份证:</div>
                  <div class="item-content">
                    <viewer :images="[info.cardidImg]"> 
                      <img class="img" :src="info.cardidImg" alt />
                    </viewer>
                  </div>
                </div>
                <div class="info-img">
                  <div class="item-title">营业执照:</div>
                  <div class="item-content">
                    <viewer :images="[info.certificateImg]"> 
                      <img class="img" :src="info.certificateImg" alt />
                    </viewer>
                  </div>
                </div>
              </div>
            </div>
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
      info: JSON.parse(localStorage.getItem("user")),
      areaNums: JSON.parse(localStorage.getItem("areaNums")),
      areas: [],
      proportions: [],
      referName: '',
      referTelephone: ''
    };
  },
  mounted() {
    // this.getAreas();
    this.getProportion();
    this.getRefer();
  },
  methods: {
    getAreas() {
      console.log(this.info, this.areaNums);
      let areaNum = new Set();
      this.areaNums.forEach(item => {
        areaNum.add(item.split(",")[0]);
      });
    },
    //获取区域分成
    getProportion() {
      this.axios.get('/agt/getAgtSharingPro')
      .then(res => {
        console.log(res);
        this.proportions = res.data;
      })
      .catch();
    },
    //获取推介人
    getRefer() {
      this.axios.get('/show/referRelation')
      .then(res => {
        if(res.code == '1') {
          this.referName = res.data.name;
          this.referTelephone = res.data.telephone;
        }
      })
      .catch();
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/mixin";
.basic {
  .header {
    font-size: 18px;
    min-width: 900px;
    @include fx(flex-start);
  }
  .refer {
      margin-bottom: 40px;
      .refer-item {
        margin-bottom: 10px;
      }
    }
  .info {
    .info-item {
      margin-bottom: 20px;
      display: flex;
      flex-direction: flex-start;
      .item-title {
        font-size: 17px;
        width: 80px;
        text-align: left;
      }
      .item-content {
        margin-left: 8px;
        .proportion-first {
          margin-bottom: 25px;
        }
        .second {
          margin-left: 30px;
          margin-top: 10px;
          .third {
            margin-left: 30px;
            margin-top: 10px;
          }
        }
      }
      .info-img {
        margin-right: 20px;
        .img {
          margin-top: 5px;
          width: 300px;
          box-shadow: 0 0 5px #ccc;
        }
      }
    }
  }
}
</style>