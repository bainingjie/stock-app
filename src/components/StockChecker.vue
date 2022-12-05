<template>
  <div class="stock_check">
    <div class="card">
      <table class="table is-striped is-hoverable is-fullwidth is-size-7-mobile">
        <thead>
          <tr>
            <th><abbr title="Index">Product</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stock, key) in stock" :key="key">
            <th>商品名：{{item_info[key]?.product_name}} 、個数 {{stock}}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
 
<script>
import firebase from "firebase";
 
export default {
  name: "StockChecker",
  data() {
    return {
      database: null,
      stock_DB: null,
      stock_info: [],
      item_info:[],
      product_list:{},


      place_list: [],
      aggregate_res: {}
    };
  },
  created: function() {
    this.database = firebase.database();
    // this.uid = firebase.auth().currentUser.uid;
    // this.stock_DB = this.database.ref("stock_info/" + this.uid);
    this.stock_DB = this.database.ref("stock_info/");
 
    // データに変更があると実行されるfunction
    this.stock_DB.on("value", (snapshot) => {
      this.stock_info = snapshot.val(); // 再取得してstock_infoに格納する
    });

    this.database.ref("item_info/").once('value')
      .then((snapshot) => {
        this.item_info = snapshot.val()
      })
  },
  computed: {
    stock(){
      let product_list = {}
      for (let key in this.stock_info) {
        const productID = this.stock_info[key].productID
        if(! (productID in product_list)){
          product_list[productID]=0
        }

        if(this.stock_info[key].IN_or_OUT=="入庫"){
          product_list[productID] += Number(this.stock_info[key].quantity)
        }else if(this.stock_info[key].IN_or_OUT=="出庫"){
          product_list[productID] -= Number(this.stock_info[key].quantity)
        }
      }
      return product_list
    }
  },
  methods: {
  }
};
</script>
 
<style lang="scss">
@import '~bulma';
.stock_check {padding: 20px;}
</style>