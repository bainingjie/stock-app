<template>
  <div class="stock_check">
    <div class="is-size-4">商品を検索</div>
    <div class="is-size-7">例1) 商品番号/商品名/カテゴリー</div>
    <div class="is-size-7">例2) 商品名-色-サイズ</div>
    <div class="is-size-7">例3) 色-サイズ</div>
    <div style="margin-top: 10px !important">
      <input placeholder="検索" class="input is-size-10" v-model="keyword" />
    </div>
    <!-- <div>{{ filteredItems }}</div> -->
    <div class="card">
      <table
        class="table is-striped is-hoverable is-fullwidth is-size-7-mobile"
      >
        <thead>
          <tr>
            <th>商品番号</th>
            <th>カテゴリー</th>
            <th>商品名</th>
            <th>色</th>
            <th>サイズ</th>
            <th>幅-奥行-高さ-重さ</th>
            <th>在庫</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in item_info" :key="key">
            <template v-if="filteredItems.indexOf(key) > -1">
              <td>{{ item.product_number }}</td>
              <td>{{ item.product_category }}</td>
              <td>{{ item.product_name }}</td>
              <td>{{ item.product_color }}</td>
              <td>{{ item.product_size }}</td>
              <td>
                {{ item.product_depth }}-{{ item.product_height }}-{{
                  item.product_width
                }}-{{ item.product_weight }}
              </td>
              <td>{{ stock[key] }}</td>
              <td>
                <div class="modal">
                  <div class="modal-background"></div>
                  <div class="modal-content">
                    <!-- Any other Bulma elements you want -->
                  </div>
                  <button
                    class="modal-close is-large"
                    aria-label="close"
                  ></button>
                </div>
                <a
                  class="button is-primary is-size-7-mobile"
                  v-on:click="
                    $router.push({
                      name: 'UpdateItem',
                      params: { item_id: key },
                    })
                  "
                >
                  編集
                </a>
              </td>
            </template>
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
      item_DB: null,
      stock_info: [],
      item_info: [],
      product_list: {},

      keyword: "",
    };
  },
  created: function () {
    this.database = firebase.database();
    // this.uid = firebase.auth().currentUser.uid;
    // this.stock_DB = this.database.ref("stock_info/" + this.uid);
    this.stock_DB = this.database.ref("stock_info/");

    // データに変更があると実行されるfunction
    this.stock_DB.on("value", (snapshot) => {
      this.stock_info = snapshot.val(); // 再取得してstock_infoに格納する
    });

    this.item_DB = this.database.ref("item_info/");
    this.item_DB.on("value", (snapshot) => {
      this.item_info = snapshot.val(); // 再取得してstock_infoに格納する
      // console.log(this.item_info);
    });

    this.database
      .ref("item_info/")
      .once("value")
      .then((snapshot) => {
        this.item_info = snapshot.val();
      });
  },
  computed: {
    filteredItems: function () {
      let ret_filter_stock_info = [];
      for (let key in this.item_info) {
        let product_text =
          this.item_info[key].product_number +
          "-" +
          this.item_info[key].product_category +
          "-" +
          this.item_info[key].product_name +
          "-" +
          this.item_info[key].product_color +
          "-" +
          this.item_info[key].product_size;

        let lower_keyword = this.keyword.toLowerCase();
        let lower_product_text = product_text.toLowerCase();
        if (lower_product_text.indexOf(lower_keyword) !== -1) {
          ret_filter_stock_info.push(key);
          // let item = this.item_info[key];
          // item.productID = key;
          // ret_filter_stock_info.push(item);
        }
      }
      return ret_filter_stock_info;
    },
    stock() {
      let product_list = {};
      for (let key in this.stock_info) {
        const productID = this.stock_info[key].productID;
        if (!(productID in product_list)) {
          product_list[productID] = 0;
        }

        if (this.stock_info[key].IN_or_OUT == "入庫") {
          product_list[productID] += Number(this.stock_info[key].quantity);
        } else if (this.stock_info[key].IN_or_OUT == "出庫") {
          product_list[productID] -= Number(this.stock_info[key].quantity);
        }
      }
      return product_list;
    },
  },
  methods: {
    clear: function () {
      this.keyword = "";
    },
  },
};
</script>

<style lang="scss">
@import "~bulma";
.stock_check {
  padding: 20px;
}
</style>
