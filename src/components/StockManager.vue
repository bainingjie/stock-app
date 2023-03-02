<template>
  <div class="stock_info">
    <div class="box">
      <div class="container">
        <!-- <a
          class="button is-hidden-tablet"
          v-bind:class="{ 'is-danger': is_show_edit_view }"
          v-on:click="is_show_edit_view = !is_show_edit_view"
        >
          <span class="icon">
            <i
              class="fa"
              v-bind:class="{
                'fa-angle-down': !is_show_edit_view,
                'fa-angle-up': is_show_edit_view,
              }"
            ></i>
          </span>
          <span>入出庫情報編集</span>
        </a> -->
        <div v-if="step == 0">
          <div class="is-size-4">step1 商品を検索</div>
          <div class="is-size-7">例1) 商品番号/商品名/カテゴリー</div>
          <div class="is-size-7">例2) 商品名-色-サイズ</div>
          <div class="is-size-7">例3) 色-サイズ</div>

          <div class="is-size-10" style="margin-top: 10px !important">
            <input
              class="input is-size-7-mobile"
              placeholder="Search"
              v-model="keyword"
            />
          </div>

          <div style="overflow-y: scroll; height: 200px">
            <table class="table is-striped is-hoverable is-size-10-mobile">
              <tbody>
                <tr v-for="item in filteredItems" :key="item.productID">
                  <td>
                    {{ item.product_number }}-{{ item.product_category }}-{{
                      item.product_name
                    }}-{{ item.product_color }}-{{ item.product_size }}
                  </td>
                  <td>
                    <div>
                      <a
                        class="button is-primary is-rounded is-small"
                        v-on:click="
                          conc(item);
                          plus_step();
                        "
                      >
                        選択
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <div>{{ filteredItems }}</div>
          <div>{{ filteredStockInfo }}</div>
          <a class="panel-block is-active">
            <span class="panel-icon">
              <i class="fas fa-book" aria-hidden="true"></i>
            </span>
            bulma
          </a> -->
        </div>

        <div v-if="step == 1">
          <div class="is-size-4" style="margin-bottom: 10px !important">
            step2 レコードを追加

            <a class="button is-primary" v-on:click="goback()"> 戻る </a>
          </div>
          <div class="is-size-5">選択した商品:{{ searchedProductText }}</div>
          <div class="field is-horizontal">
            <p class="control has-tooltip-primary" data-tooltip="状態">
              <span class="select">
                <select v-model="IN_or_OUT">
                  <option value="入庫">入庫</option>
                  <option value="出庫">出庫</option>
                </select>
              </span>
            </p>

            <p class="control has-tooltip-primary" data-tooltip="個数">
              <input
                class="input"
                type="text"
                placeholder="個数"
                v-model="quantity"
              />
            </p>

            <!-- <p class="control  has-tooltip-primary" data-tooltip="単価">
            <input class="input" type="text" placeholder="単価" v-model="priceYen">
          </p> -->
            <p class="control has-tooltip-primary" data-tooltip="反映日">
              <input class="input" type="date" v-model="applyData" />
            </p>
            <p class="control">
              <a class="button is-primary" v-on:click="addStockInfo()">
                追加
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container has-text-centered is-size-7-mobile">
      <table class="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <!-- <th class="is-hidden-mobile"><abbr title="Index">Idx</abbr></th> -->
            <!-- <th>選択</th> -->
            <th style="padding-top: 0">
              <div>
                <span class="select">
                  <select v-model="filter_IN_or_OUT">
                    <option value="全て">全て</option>
                    <option value="入庫">入庫</option>
                    <option value="出庫">出庫</option>
                  </select>
                </span>
              </div>
            </th>
            <th>商品番号</th>
            <th>カテゴリー</th>
            <th>商品名</th>
            <th>色</th>
            <th>サイズ</th>
            <!-- <th>From</th>
            <th>To</th> -->
            <th>数量</th>
            <!-- <th>単価</th> -->
            <!-- <th class="is-hidden-mobile">登録日</th> -->
            <th class="is-hidden-mobile">反映日</th>

            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in filteredStockInfo" :key="stock.id">
            <!-- <th><input type="checkbox" /></th> -->
            <td>{{ stock.IN_or_OUT }}</td>
            <td>{{ item_info[stock.productID]?.product_number }}</td>
            <td>{{ item_info[stock.productID]?.product_category }}</td>
            <td>{{ item_info[stock.productID]?.product_name }}</td>
            <!-- <td>{{ stock.from }}</td>
            <td>{{ stock.to }}</td> -->
            <td>{{ item_info[stock.productID]?.product_color }}</td>
            <td>{{ item_info[stock.productID]?.product_size }}</td>

            <td>{{ stock.quantity }}</td>
            <td class="is-hidden-mobile">{{ stock.applyData }}</td>
            <td>
              <div>
                <a
                  class="button is-primary is-rounded is-small"
                  v-on:click="deleteStockInfo(stock.key)"
                >
                  削除
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

const today_date = new Date();
const today_str =
  today_date.getFullYear() +
  "-" +
  ("0" + (today_date.getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + today_date.getDate()).slice(-2);

const convert_date = function (date_str, output_year = true) {
  const date = new Date(date_str);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const ret_str = output_year ? `${year}/${month}/${day}` : `${month}/${day}`;
  return ret_str;
};

export default {
  name: "StockManager",
  data() {
    return {
      step: 0,
      database: null,
      stock_DB: null,
      stock_info: [],
      item_DB: null,
      item_info: [],
      productID: "",

      keyword: "",
      searchedproductID: "",
      searchedProductText: "",

      quantity: "",
      applyData: today_str,
      is_show_edit_view: false,

      /* added */
      IN_or_OUT: "入庫",
      filter_IN_or_OUT: "全て",
    };
  },
  created: function () {
    this.database = firebase.database();
    // this.uid = firebase.auth().currentUser.uid
    // this.stock_DB = this.database.ref("stock_info/" + this.uid)
    this.stock_DB = this.database.ref("stock_info/");
    this.stock_DB.on("value", (snapshot) => {
      this.stock_info = snapshot.val(); // 再取得してstock_infoに格納する
    });
    this.item_DB = this.database.ref("item_info/");
    this.item_DB.on("value", (snapshot) => {
      this.item_info = snapshot.val(); // 再取得してstock_infoに格納する
      // console.log(this.item_info);
    });

    // this.database.ref("item_info/" + this.uid).once('value')
    // this.database
    //   .ref("item_info/")
    //   .once("value")
    //   .then((snapshot) => {
    //     this.item_info = snapshot.val();
    //   });
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
          let item = this.item_info[key];
          item.productID = key;
          ret_filter_stock_info.push(item);
        }
      }
      return ret_filter_stock_info;
    },
    filteredStockInfo: function () {
      let count_index = 0;
      let ret_filter_stock_info = {};
      let key_list = [];

      for (let key in this.stock_info) {
        if (this.searchedproductID) {
          if (this.stock_info[key].productID != this.searchedproductID) {
            continue;
          }
        }
        if (this.filter_IN_or_OUT == "全て") {
          key_list.push(key);
        } else if (this.stock_info[key].IN_or_OUT == this.filter_IN_or_OUT) {
          key_list.push(key);
        }
      }
      key_list.reverse();
      for (let idx in key_list) {
        const key = key_list[idx];
        const stock = this.stock_info[key];
        count_index += 1;
        stock.registDate = convert_date(stock.registDate);
        stock.applyData = convert_date(stock.applyData, false);
        stock.key = key;
        ret_filter_stock_info[count_index] = stock;
      }
      return ret_filter_stock_info;
    },
  },
  methods: {
    goback: function () {
      this.keyword = "";
      this.searchedproductID = "";
      this.searchedProductText = "";
      this.plus_step();
    },
    plus_step: function () {
      this.step = 1 - this.step;
    },
    conc: function (item) {
      console.log(item);
      this.searchedProductText =
        item.product_number +
        "-" +
        item.product_category +
        "-" +
        item.product_name +
        "-" +
        item.product_color +
        "-" +
        item.product_size;

      this.searchedproductID = item.productID;
    },
    // DBのstock_info/[uid]/以下にデータを格納していく
    addStockInfo: function () {
      console.log(this.searchedproductID);
      this.stock_DB.push({
        IN_or_OUT: this.IN_or_OUT,
        productID: this.searchedproductID,
        quantity: this.quantity,
        registDate: today_str,
        applyData: this.applyData,
      });
      window.alert("記録を追加しました");
      this.quantity = "";
    },
    // stock_infoの削除
    deleteStockInfo: function (key) {
      this.stock_DB.child(key).remove();
    },
  },
};
</script>

<style lang="scss">
@import "~bulma";
@import "~bulma-tooltip";
.input {
  margin-top: 0 !important;
}
.td {
  font-weight: 400 !important;
}
</style>
